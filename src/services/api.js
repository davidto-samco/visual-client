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
  const billTo = o.customer?.billTo ?? {};

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
    contactFax: o.contact?.fax ?? "",
    terms: o.termsDescription ?? "",
    soldToAddress: soldToLines.join("\n"),
    salesRep: o.salesRep?.name ?? "",
    quoteId: o.quoteId ?? "",
    revisionDate: o.revisionDate ?? "",
    revisionNumber: o.revisionNumber ?? "",
    billTo: {
      name: billTo.name ?? o.customer?.name ?? "",
      address1: billTo.address1 ?? "",
      address2: billTo.address2 ?? "",
      address3: billTo.address3 ?? "",
      city: billTo.city ?? "",
      state: billTo.state ?? "",
      zipCode: billTo.zipCode ?? "",
      country: billTo.country ?? "",
    },
    shipTo: {
      name: o.customer?.name ?? "",
      address1: shipTo.address1 ?? "",
      address2: shipTo.address2 ?? "",
      city: shipTo.city ?? "",
      state: shipTo.state ?? "",
      zipCode: shipTo.zipCode ?? "",
      country: shipTo.country ?? "",
    },
    lineItems,
    subtotal,
    tax: o.tax?.taxAmount ?? 0,
    taxRate: o.tax?.taxPercent ? `${o.tax.taxPercent}%` : "0",
    taxLabel: o.tax?.salesTaxGroupId ?? "",
    freight: 0,
    grandTotal: o.totalAmount ?? subtotal,
    total: o.tax?.totalWithTax ?? o.totalAmount ?? subtotal,
  };
}

/**
 * Maps server quote document → QuoteDetail shape
 * Server: { quoteId, status, quoteDate, expirationDate, currency, customer,
 *           contact, salesRep, description, terms, lineItems, totalPrice,
 *           formattedTotalPrice, linkedOrders, lineItemCount }
 */
function normalizeQuoteDetail(q) {
  const cust = q.customer ?? {};
  const addressLines = [
    cust.name,
    cust.address1,
    cust.address2,
    cust.address3,
    [cust.city, cust.state, cust.zipCode].filter(Boolean).join(", "),
    cust.country,
  ].filter(Boolean);

  const lineItems = (q.lineItems ?? []).map((li) => ({
    line: li.lineNumber,
    qty: li.quantity,
    description: li.description ?? "",
    partId: li.partId ?? "",
    customerPartId: li.customerPartId ?? "",
    unitPrice: li.unitPrice ?? 0,
    extension: li.lineTotal ?? 0,
    formattedUnitPrice: li.formattedUnitPrice ?? "",
    formattedExtension: li.formattedLineTotal ?? "",
    sellingUm: li.sellingUm ?? "",
    extendedDescription: li.extendedDescription ?? null,
  }));

  return {
    quoteId: q.quoteId ?? "",
    status: q.status ?? "",
    quoteDate: q.quoteDate ?? "",
    expirationDate: q.expirationDate ?? "",
    currency: q.currency ?? "USD",
    customerName: cust.name ?? "",
    customerId: cust.customerId ?? "",
    customerAddress: addressLines.join("\n"),
    contact: q.contact?.fullName ?? "",
    contactPhone: q.contact?.phone ?? "",
    contactFax: q.contact?.fax ?? "",
    contactPosition: q.contact?.position ?? "",
    salesRep: q.salesRep?.name ?? "",
    description: q.description ?? "",
    terms: q.terms?.description ?? "",
    shipVia: q.terms?.shipVia ?? "",
    fob: q.terms?.freeOnBoard ?? "",
    freightTerms: q.terms?.freightTerms ?? "",
    leadTimeWeeks: q.terms?.quotedLeadtimeWeeks ?? null,
    lineItems,
    totalPrice: q.totalPrice ?? 0,
    formattedTotalPrice: q.formattedTotalPrice ?? "$0.00",
    linkedOrders: (q.linkedOrders ?? []).map((o) => ({
      customerOrderId: o.customerOrderId ?? "",
      createDate: o.createDate ?? "",
    })),
    lineItemCount: q.lineItemCount ?? lineItems.length,
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

  /** Full quote document by quote ID */
  async getQuote(quoteId) {
    const json = await request(
      `/api/sales/quotes/${encodeURIComponent(quoteId)}`,
    );
    return normalizeQuoteDetail(json.data);
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

  /** Fetch all pages of search results */
  async searchAllParts(partNumber, { limit = 50 } = {}) {
    const firstPage = await this.searchParts(partNumber, { page: 1, limit });
    const allResults = [...firstPage.results];
    const totalPages = firstPage.meta.totalPages ?? 1;

    // Fetch remaining pages in parallel
    if (totalPages > 1) {
      const pagePromises = [];
      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(this.searchParts(partNumber, { page, limit }));
      }
      const pages = await Promise.all(pagePromises);
      for (const p of pages) {
        allResults.push(...p.results);
      }
    }

    return allResults;
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

  async getPurchaseHistory(partId) {
    const json = await request(
      `/api/inventory/parts/${encodeURIComponent(partId)}/purchase-history`,
    );
    return Array.isArray(json.data) ? json.data : [];
  },
};

// ---------------------------------------------------------------------------
// Engineering API
// ---------------------------------------------------------------------------

/**
 * Recursively convert simplified tree nodes from server shape → BOMTree shape.
 *
 * Now passes status, formattedId, partId, description as separate fields
 * so BOMTreeNode can render them individually (status at start, partId bold).
 */
function normalizeBOMNode(node) {
  const dates = [node.startDate, node.finishDate]
    .filter(Boolean)
    .map((d) => d.substring(0, 10));

  return {
    id: node.subId ?? node.formattedId ?? Math.random().toString(36),
    status: node.formattedStatus ?? "",
    formattedId: node.formattedId ?? "",
    partId: node.partId ?? "",
    description: node.partDescription ?? "",
    quantity: node.orderQty ?? 1,
    details: "",
    dateRange: dates.join(" → "),
    children: (node.children ?? []).map(normalizeBOMNode),
  };
}

/**
 * Recursively convert detailed tree nodes from server shape → BOMTree shape.
 * Preserves nodeType so the UI can color-code OP vs MAT vs WO.
 *
 * Now passes status, formattedId, partId, description as separate fields.
 */
function normalizeDetailedBOMNode(node) {
  const nodeType = node.nodeType ?? "WO";

  let status = node.formattedStatus ?? "";
  let formattedId = "";
  let partId = "";
  let description = "";
  let quantity = null;
  let details = "";
  let dateRange = "";
  let id = "";

  switch (nodeType) {
    case "WO": {
      formattedId = node.formattedId ?? "";
      partId = node.partId ?? "";
      description = node.partDescription ?? "";
      quantity = node.orderQty ?? null;
      const dates = [node.startDate, node.finishDate]
        .filter(Boolean)
        .map((d) => d.substring(0, 10));
      dateRange = dates.join(" → ");
      id = `wo-${node.subId ?? node.formattedId ?? Math.random().toString(36)}`;
      break;
    }
    case "OP": {
      description = node.formattedDescription ?? `OP ${node.opSeq}`;
      id = `op-${node.subId}-${node.opSeq}`;
      break;
    }
    case "MAT": {
      partId = node.partId ?? "";
      description = node.partDescription ?? "Unknown";
      quantity = node.qty ?? null;
      details = node.dimensions ?? "";
      id = `mat-${node.subId}-${node.opSeq}-${node.pieceNo}`;
      break;
    }
    default: {
      description = node.formattedId ?? "Unknown";
      id = Math.random().toString(36);
    }
  }

  return {
    id,
    nodeType,
    status,
    formattedId,
    partId,
    description,
    quantity,
    details,
    dateRange,
    pieceNo: nodeType === "MAT" ? (node.pieceNo ?? null) : undefined,
    children: (node.children ?? []).map(normalizeDetailedBOMNode),
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

  /** Returns a simplified BOMTree-compatible tree or null */
  async getWorkOrderTree(baseId, lotId) {
    const json = await request(
      `/api/engineering/work-orders/${encodeURIComponent(baseId)}/${encodeURIComponent(lotId)}/tree/simplified`,
    );
    // data = { tree: {...}, totalWorkOrders: N }
    const tree = json.data?.tree ?? null;
    return tree ? normalizeBOMNode(tree) : null;
  },

  /** Returns a detailed BOMTree-compatible tree or null */
  async getDetailedWorkOrderTree(baseId, lotId) {
    const json = await request(
      `/api/engineering/work-orders/${encodeURIComponent(baseId)}/${encodeURIComponent(lotId)}/tree/detailed`,
    );
    const tree = json.data?.tree ?? null;
    return tree ? normalizeDetailedBOMNode(tree) : null;
  },
};
