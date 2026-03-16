const BASE_URL = import.meta.env.VITE_API_URL ?? "";

// ---------------------------------------------------------------------------
// Core fetch wrapper — unwraps { success, data, meta }
// ---------------------------------------------------------------------------
async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const json = await res.json();

  if (!res.ok || json.success === false) {
    throw new Error(json.error?.message ?? `HTTP ${res.status}`);
  }

  // Return full json so callers can access both data and meta
  return json;
}

// ---------------------------------------------------------------------------
// Sales API
// ---------------------------------------------------------------------------

/**
 * Maps server order summary → OrderList shape
 * Server: { jobNumber, customerName, orderDate, totalAmount, customerPo }
 */
function normalizeOrderSummary(o) {
  return {
    id: o.jobNumber,
    jobNumber: o.jobNumber,
    customerName: o.customerName ?? "",
    date: o.orderDate ?? "",
    totalAmount: o.totalAmount ?? 0,
    customerPo: o.customerPo ?? "",
  };
}

/**
 * Maps server order acknowledgement → OrderDetail/OrderHeader/OrderTotals shape
 * Server: { orderId, orderDate, customerPoRef, totalAmount, currencyId,
 *           termsDescription, desiredShipDate, salesRep, customer, contact,
 *           lineItems: [{ lineNumber, baseLotId, partId, description,
 *                         quantity, unitPrice, lineTotal, promiseDate }] }
 */
function normalizeOrderDetail(o) {
  const shipTo = o.customer?.shipTo ?? {};
  const soldToLines = [
    o.customer?.name,
    shipTo.address1,
    shipTo.address2,
    [shipTo.city, shipTo.state, shipTo.zipCode].filter(Boolean).join(", "),
    shipTo.country,
  ].filter(Boolean);

  const lineItems = (o.lineItems ?? []).map((li) => ({
    line: li.lineNumber,
    qty: li.quantity,
    baseLotId: li.baseLotId ?? "",
    partId: li.partId ?? "",
    description: li.description ?? "",
    unitPrice: li.unitPrice ?? 0,
    extension: li.lineTotal ?? 0,
    promiseDate: li.promiseDate ?? "",
  }));

  const subtotal = lineItems.reduce((sum, li) => sum + li.extension, 0);

  return {
    id: o.orderId,
    jobNumber: o.orderId,
    customerName: o.customer?.name ?? "",
    customerId: o.customer?.customerId ?? "",
    poNumber: o.customerPoRef ?? "",
    date: o.orderDate ?? "",
    desiredShipDate: o.desiredShipDate ?? "",
    promiseDate: o.promiseDate ?? "",
    status: o.status ?? "",
    shipVia: o.shipVia ?? "",
    currency: o.currencyId ?? "CDN",
    contact: o.contact?.fullName ?? "",
    contactPhone: o.contact?.phone ?? "",
    terms: o.termsDescription ?? "",
    soldToAddress: soldToLines.join("\n"),
    salesRep: o.salesRep?.name ?? "",
    quoteId: o.quoteId ?? "",
    lineItems,
    subtotal,
    tax: o.tax?.taxAmount ?? 0,
    taxRate: o.tax?.taxPercent ? `${o.tax.taxPercent}%` : "0",
    freight: 0,
    grandTotal: o.totalAmount ?? subtotal,
    total: o.tax?.totalWithTax ?? o.totalAmount ?? subtotal,
  };
}

export const salesApi = {
  /** Load recent orders (no filters) */
  async getRecentOrders(limit = 200) {
    const json = await request(`/api/sales/orders?limit=${limit}`);
    // No filter → server returns data as array directly
    const records = Array.isArray(json.data) ? json.data : [];
    return records.map(normalizeOrderSummary);
  },

  /** Search with customer name / date range */
  async searchOrders({
    customerName,
    startDate,
    endDate,
    page = 1,
    limit = 200,
  } = {}) {
    const params = new URLSearchParams({ page, limit });
    if (customerName) params.set("customerName", customerName);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const json = await request(`/api/sales/orders?${params}`);
    const records = Array.isArray(json.data) ? json.data : [];
    return {
      records: records.map(normalizeOrderSummary),
      meta: json.meta ?? {},
    };
  },

  /** Full order acknowledgement */
  async getOrder(jobNumber) {
    const json = await request(
      `/api/sales/orders/${encodeURIComponent(jobNumber)}`,
    );
    return normalizeOrderDetail(json.data);
  },
};

// ---------------------------------------------------------------------------
// Inventory API
// ---------------------------------------------------------------------------

function normalizePart(p) {
  return {
    partNumber: p.id ?? p.partId ?? "", // server returns "id"
    description: p.description ?? "",
    partType: p.partType ?? p.type ?? "",
    uom: p.unitOfMeasure ?? "",
    materialCode: p.commodityCode ?? "", // server returns "commodityCode"
    drawingId: p.drawingNumber ?? "", // server returns "drawingNumber"
    drawingRev: p.drawingRevision ?? "",
    weight: "",
    materialCost: p.unitMaterialCost ?? 0, // server returns "unitMaterialCost"
    laborCost: p.unitLaborCost ?? 0,
    burdenCost: p.unitBurdenCost ?? 0,
    totalCost: p.totalUnitCost ?? 0, // server returns "totalUnitCost"
    unitPrice: p.unitPrice ?? 0,
    onHand: p.qtyOnHand ?? 0,
    available: p.qtyAvailable ?? 0,
    onOrder: p.qtyOnOrder ?? 0,
    inDemand: p.qtyInDemand ?? 0,
    preferredVendor: p.preferredVendorName ?? "",
    vendorId: p.preferredVendorId ?? "",
    status: p.status ?? "",
  };
}

export const inventoryApi = {
  async searchParts(partNumber, { page = 1, limit = 50 } = {}) {
    const params = new URLSearchParams({ partNumber, page, limit });
    const json = await request(`/api/inventory/parts/search?${params}`);
    const results = Array.isArray(json.data) ? json.data : [];
    return { results: results.map(normalizePart), meta: json.meta ?? {} };
  },

  async getPart(partId) {
    const json = await request(
      `/api/inventory/parts/${encodeURIComponent(partId)}`,
    );
    return normalizePart(json.data);
  },

  async getWhereUsed(partId, { page = 1, limit = 50 } = {}) {
    const params = new URLSearchParams({ page, limit });
    const json = await request(
      `/api/inventory/parts/${encodeURIComponent(partId)}/where-used?${params}`,
    );
    return {
      records: Array.isArray(json.data) ? json.data : [],
      meta: json.meta ?? {},
    };
  },
};

// ---------------------------------------------------------------------------
// Engineering API
// ---------------------------------------------------------------------------

/**
 * Recursively convert simplified tree nodes from server shape → BOMTree shape.
 * Server node: { subId, partId, partDescription, orderQty, status,
 *               formattedStatus, formattedId, startDate, finishDate, children }
 * BOMTree node: { id, label, quantity, details, dateRange, children }
 */
function normalizeBOMNode(node) {
  const labelParts = [node.formattedId];
  if (node.partDescription) labelParts.push(node.partDescription);

  const dates = [node.startDate, node.finishDate]
    .filter(Boolean)
    .map((d) => d.substring(0, 10)); // trim to YYYY-MM-DD

  return {
    id: node.subId ?? node.formattedId ?? Math.random().toString(36),
    label: labelParts.join(" - "),
    quantity: node.orderQty ?? 1,
    details: node.formattedStatus ?? node.status ?? "",
    dateRange: dates.join(" → "),
    children: (node.children ?? []).map(normalizeBOMNode),
  };
}

export const engineeringApi = {
  async searchWorkOrders(baseId, { page = 1, limit = 50 } = {}) {
    const params = new URLSearchParams({ baseId, page, limit });
    const json = await request(`/api/engineering/work-orders/search?${params}`);
    return {
      records: Array.isArray(json.data) ? json.data : [],
      meta: json.meta ?? {},
    };
  },

  /** Returns a BOMTree-compatible tree or null */
  async getWorkOrderTree(baseId, lotId) {
    const json = await request(
      `/api/engineering/work-orders/${encodeURIComponent(baseId)}/${encodeURIComponent(lotId)}/tree/simplified`,
    );
    // data = { tree: {...}, totalWorkOrders: N }
    const tree = json.data?.tree ?? null;
    return tree ? normalizeBOMNode(tree) : null;
  },
};
