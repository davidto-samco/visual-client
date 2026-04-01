// ---------------------------------------------------------------------------
// Logo images (imported as asset URLs by Vite)
// ---------------------------------------------------------------------------
import SAMCO_LOGO from "@/assets/samco_logo.png";
import ISO_BADGE from "@/assets/iso_badge.png";

// ---------------------------------------------------------------------------
// Currency formatter (matches existing formatCurrency logic)
// ---------------------------------------------------------------------------
function fmt(value, currency = "USD") {
  const v = Number(value) || 0;
  const symbol = currency === "CDN" ? "CDN$" : "$";
  return `${symbol}${v.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

// ---------------------------------------------------------------------------
// Build the full HTML document for the print window
// ---------------------------------------------------------------------------
export function buildPrintHTML(order) {
  const cur = order.currency ?? "USD";
  const curLabel = cur === "CDN" ? "Price(CDN)" : "Price(USD)";

  // Resolve asset URLs to absolute so they work in the Blob print window
  const logoUrl = new URL(SAMCO_LOGO, window.location.origin).href;
  const badgeUrl = new URL(ISO_BADGE, window.location.origin).href;

  // Build Bill To lines
  const billTo = order.billTo ?? {};
  const billToLines = [
    billTo.name,
    billTo.address1,
    billTo.address2,
    billTo.address3,
    [billTo.city, billTo.state, billTo.zipCode].filter(Boolean).join(", "),
    billTo.country,
  ].filter(Boolean);

  // Build Ship To lines
  const shipTo = order.shipTo ?? {};
  const shipToLines = [
    shipTo.name || order.customerName,
    shipTo.address1,
    shipTo.address2,
    [shipTo.city, shipTo.state, shipTo.zipCode].filter(Boolean).join(", "),
    shipTo.country,
  ].filter(Boolean);

  // Line items rows
  const lineRows = (order.lineItems ?? [])
    .map((li) => {
      const up = li.unitPrice > 0 ? fmt(li.unitPrice, cur) : "";
      const ext = li.extension > 0 ? fmt(li.extension, cur) : "";
      return `
        <tr>
          <td class="center">${li.qty}</td>
          <td class="bold">${li.baseLotId || ""}</td>
          <td>${li.description || ""}</td>
          <td class="right">${up}</td>
          <td class="right">${ext}</td>
        </tr>`;
    })
    .join("");

  // Totals
  const orderAmount = order.grandTotal ?? order.subtotal ?? 0;
  const tax = order.tax ?? 0;
  const totalOrderAmount = order.total ?? orderAmount + tax;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Customer Order ${order.jobNumber}</title>
<style>
  @page {
    size: letter;
    margin: 0.5in 0.6in;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9.5pt;
    color: #000;
    background: #fff;
    padding: 0.5in 0.6in;
  }
  @media print {
    body { padding: 0; }
  }

  /* ---- Header ---- */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
    border-bottom: 2px solid #000;
    padding-bottom: 6px;
  }
  .logo-area {
    flex: 1;
  }
  .logo-area .samco-logo {
    height: 100px;
    width: auto;
  }
  .header-center {
    flex: 0 0 auto;
    text-align: center;
    padding: 0 16px;
  }
  .header-center .iso-badge {
    height: 110px;
    width: auto;
  }
  .header-right {
    flex: 0 0 auto;
    text-align: right;
    line-height: 1.3;
  }
  .header-right .order-num {
    font-size: 16pt;
    font-weight: 700;
  }
  .header-right .cust-code {
    font-size: 9pt;
    color: #555;
  }

  /* ---- Title ---- */
  h1 {
    text-align: center;
    font-size: 14pt;
    font-weight: 700;
    margin: 10px 0 8px;
    letter-spacing: 0.5px;
  }

  /* ---- Info grid ---- */
  .info-grid {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8px;
    font-size: 8.5pt;
  }
  .info-grid td {
    border: 1px solid #000;
    padding: 2px 5px;
    vertical-align: top;
  }
  .info-grid .label {
    font-weight: 700;
    text-align: center;
    background: #e8e8e8;
    font-size: 7.5pt;
    text-transform: uppercase;
  }
  .info-grid .value {
    text-align: center;
    min-height: 16px;
  }

  /* ---- Bill/Ship ---- */
  .addr-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8px;
    font-size: 8.5pt;
  }
  .addr-table td {
    border: 1px solid #000;
    padding: 3px 6px;
    vertical-align: top;
    width: 50%;
  }
  .addr-table .addr-label {
    font-weight: 700;
    text-align: center;
    background: #e8e8e8;
    font-size: 7.5pt;
  }
  .addr-line { line-height: 1.45; }

  /* ---- Project description ---- */
  .project-desc {
    font-weight: 700;
    font-style: italic;
    margin: 6px 0 4px;
    font-size: 9pt;
  }

  /* ---- Line items ---- */
  .lines-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 6px;
    font-size: 8.5pt;
  }
  .lines-table th {
    border-bottom: 2px solid #000;
    border-top: 1px solid #000;
    padding: 3px 5px;
    text-align: left;
    font-weight: 700;
    font-size: 7.5pt;
    text-decoration: underline;
  }
  .lines-table td {
    padding: 1.5px 5px;
    vertical-align: top;
  }
  .lines-table .center { text-align: center; }
  .lines-table .right { text-align: right; }
  .lines-table .bold { font-weight: 700; }

  /* ---- Totals ---- */
  .totals {
    width: 100%;
    margin-top: 4px;
    font-size: 9pt;
  }
  .totals td {
    padding: 1px 5px;
  }
  .totals .lbl {
    text-align: right;
    font-weight: 700;
    padding-right: 10px;
  }
  .totals .amt {
    text-align: right;
    width: 120px;
    border-top: 1px solid #000;
  }
  .totals .amt-top {
    text-align: right;
    width: 120px;
  }
  .totals .grand {
    border-top: 1px solid #000;
    font-weight: 700;
  }

  /* ---- Footer ---- */
  .footer {
    margin-top: 30px;
    text-align: center;
    font-size: 8pt;
  }
  .footer .ack-text {
    font-weight: 700;
    font-style: italic;
    color: #c00;
    margin-bottom: 4px;
    line-height: 1.4;
  }
  .footer .order-label {
    font-weight: 700;
    font-size: 10pt;
    margin-top: 10px;
  }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<!-- ====== HEADER ====== -->
<div class="header">
  <div class="logo-area">
    <img src="${logoUrl}" alt="Samco Machinery Limited" class="samco-logo" />
  </div>
  <div class="header-center">
    <img src="${badgeUrl}" alt="ISO 9001 QMI Registered" class="iso-badge" />
  </div>
  <div class="header-right">
    <div class="order-num">${order.jobNumber}</div>
    <div class="cust-code">${order.customerId || ""}</div>
  </div>
</div>

<!-- ====== TITLE ====== -->
<h1>CUSTOMER ORDER ACKNOWLEDGEMENT</h1>

<!-- ====== INFO GRID ====== -->
<table class="info-grid">
  <tr>
    <td class="label" colspan="2">Customer</td>
    <td class="label" colspan="2">Quote ID</td>
  </tr>
  <tr>
    <td class="value" colspan="2">${order.customerName}</td>
    <td class="value" colspan="2">${order.quoteId || ""}</td>
  </tr>
  <tr>
    <td class="label" colspan="2">Payment Terms</td>
    <td class="label">Revision Date</td>
    <td class="label">Revision #</td>
  </tr>
  <tr>
    <td class="value" colspan="2">${order.terms || ""}</td>
    <td class="value">${order.revisionDate || ""}</td>
    <td class="value">${order.revisionNumber || ""}</td>
  </tr>
  <tr>
    <td class="label">Customer P.O.</td>
    <td class="label">Buyers Name</td>
    <td class="label" colspan="2">Order Date</td>
  </tr>
  <tr>
    <td class="value">${order.poNumber || ""}</td>
    <td class="value">${order.contact || ""}</td>
    <td class="value" colspan="2">${fmtDate(order.date)}</td>
  </tr>
  <tr>
    <td class="label">Contact Phone #</td>
    <td class="label">Contact Fax #</td>
    <td class="label" colspan="2">Estimated Factory Acceptance Test Date</td>
  </tr>
  <tr>
    <td class="value">${order.contactPhone || ""}</td>
    <td class="value">${order.contactFax || ""}</td>
    <td class="value" colspan="2">${fmtDate(order.promiseDate)}</td>
  </tr>
  <tr>
    <td class="label" colspan="2">Sales Rep</td>
    <td class="label" colspan="2">Firmed Factory Acceptance Test Date</td>
  </tr>
  <tr>
    <td class="value" colspan="2">${order.salesRep || ""}</td>
    <td class="value" colspan="2">${fmtDate(order.desiredShipDate)}</td>
  </tr>
</table>

<!-- ====== BILL TO / SHIP TO ====== -->
<table class="addr-table">
  <tr>
    <td class="addr-label">Bill To</td>
    <td class="addr-label">Ship To</td>
  </tr>
  <tr>
    <td class="addr-line">${billToLines.map((l) => `${l}`).join("<br>")}</td>
    <td class="addr-line">${shipToLines.map((l) => `${l}`).join("<br>")}</td>
  </tr>
</table>

<!-- ====== PROJECT DESCRIPTION ====== -->
<div class="project-desc">Project Description:</div>

<!-- ====== LINE ITEMS ====== -->
<table class="lines-table">
  <thead>
    <tr>
      <th style="width:40px;">Qty</th>
      <th style="width:100px;">Base / Lot ID</th>
      <th>Description</th>
      <th style="width:100px; text-align:right;">Unit Price</th>
      <th style="width:110px; text-align:right;">${curLabel}</th>
    </tr>
  </thead>
  <tbody>
    ${lineRows}
  </tbody>
</table>

<!-- ====== TOTALS ====== -->
<table class="totals">
  <tr>
    <td></td>
    <td class="lbl">Order Amount:</td>
    <td class="amt-top">${fmt(orderAmount, cur)}</td>
  </tr>
  ${
    tax > 0
      ? `<tr>
    <td></td>
    <td class="lbl">${order.taxLabel || "GST"}</td>
    <td class="amt">${fmt(tax, cur)}</td>
  </tr>`
      : `<tr>
    <td></td>
    <td class="lbl"></td>
    <td class="amt">${fmt(0, cur)}</td>
  </tr>`
  }
  <tr>
    <td></td>
    <td class="lbl">Total Order Amount:</td>
    <td class="amt grand">${fmt(totalOrderAmount, cur)}</td>
  </tr>
</table>

<!-- ====== FOOTER ====== -->
<div class="footer">
  <div class="ack-text">
    This customer order acknowledgement verifies that your order has been accepted and is being processed<br>
    as per the above referenced quote and Samco's Terms &amp; Conditions.
  </div>
  <div class="order-label">CUSTOMER ORDER: ${order.jobNumber}</div>
</div>

</body>
</html>`;
}
