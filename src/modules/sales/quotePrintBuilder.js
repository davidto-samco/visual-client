// ---------------------------------------------------------------------------
// Logo images (imported as asset URLs by Vite)
// ---------------------------------------------------------------------------
import SAMCO_LOGO from "@/assets/samco_logo.png";
import ISO_BADGE from "@/assets/iso_badge.png";

// ---------------------------------------------------------------------------
// Helpers
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
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}-${d.getFullYear()}`;
}

function escHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

// ---------------------------------------------------------------------------
// Build the full HTML document for the quote print window
// ---------------------------------------------------------------------------
export function buildQuotePrintHTML(quote) {
  const cur = quote.currency ?? "USD";
  const curLabel = cur === "CDN" ? "Price (CDN)" : "Unit Price (USD)";

  const logoUrl = new URL(SAMCO_LOGO, window.location.origin).href;
  const badgeUrl = new URL(ISO_BADGE, window.location.origin).href;

  // Customer address lines
  const addressLines = (quote.customerAddress ?? "")
    .split("\n")
    .filter(Boolean);

  // Line items rows
  const lineRows = (quote.lineItems ?? [])
    .map((li) => {
      const desc = escHtml(li.description);
      const extDesc = li.extendedDescription
        ? `<div class="ext-desc">${escHtml(li.extendedDescription)}</div>`
        : "";
      const up = li.unitPrice > 0 ? fmt(li.unitPrice, cur) : "";

      return `
        <tr>
          <td class="item-name">${desc}${extDesc}</td>
          <td class="right">${up}</td>
        </tr>`;
    })
    .join("");

  // Total
  const totalPrice = quote.totalPrice ?? 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Samco Quotation ${quote.quoteId}</title>
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
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 6px;
    padding-bottom: 6px;
    border-bottom: 2px solid #000;
  }
  .logo-area { flex: 1; }
  .samco-logo { height: 100px; width: auto; }
  .company-info {
    font-size: 8pt;
    line-height: 1.5;
    margin-top: 4px;
  }
  .iso-badge { height: 110px; width: auto; }

  /* ---- Tagline ---- */
  .tagline {
    text-align: center;
    font-style: italic;
    font-size: 11pt;
    margin: 8px 0 14px;
    padding: 4px 0;
  }

  /* ---- Quote info grid ---- */
  .quote-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .quote-info .left { width: 55%; }
  .quote-info .right-col { text-align: right; }
  .quote-info .label { font-weight: 700; font-size: 9pt; }
  .quote-info .value { font-size: 9.5pt; }

  /* ---- Greeting ---- */
  .greeting {
    font-style: italic;
    margin: 12px 0 18px;
    font-size: 9.5pt;
    line-height: 1.6;
  }

  /* ---- Description ---- */
  .desc-section {
    margin-bottom: 16px;
  }
  .desc-label {
    font-weight: 700;
    margin-bottom: 4px;
    font-size: 9.5pt;
  }
  .desc-text {
    line-height: 1.6;
    white-space: pre-line;
  }

  /* ---- Items table ---- */
  .items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
    font-size: 9.5pt;
  }
  .items-table th {
    border-bottom: 2px solid #000;
    border-top: 1px solid #000;
    padding: 4px 6px;
    text-align: left;
    font-weight: 700;
    font-size: 8.5pt;
    text-decoration: underline;
  }
  .items-table td {
    padding: 3px 6px;
    vertical-align: top;
  }
  .items-table .item-name { font-weight: 700; }
  .items-table .right { text-align: right; width: 120px; }
  .ext-desc {
    font-weight: 400;
    font-size: 8.5pt;
    margin: 3px 0 6px 16px;
    line-height: 1.5;
    color: #333;
  }

  /* ---- Total ---- */
  .total-section {
    text-align: right;
    margin-top: 12px;
    padding-top: 8px;
    border-top: 2px solid #000;
    font-size: 10.5pt;
  }
  .total-label { font-weight: 700; }
  .total-amount { font-weight: 700; font-size: 12pt; }

  /* ---- Footer ---- */
  .footer {
    margin-top: 30px;
    font-size: 8.5pt;
    border-top: 1px solid #000;
    padding-top: 8px;
    line-height: 1.6;
  }
  .footer .delivery { margin-bottom: 6px; }
  .footer .terms-line { margin-bottom: 4px; }
  .footer .contact-line { margin-top: 10px; font-weight: 700; }

  /* ---- Page break for auth page ---- */
  .page-break { page-break-before: always; }

  /* ---- Auth page ---- */
  .auth-title {
    text-align: center;
    font-weight: 700;
    font-size: 13pt;
    margin: 20px 0 16px;
    border-bottom: 2px solid #000;
    padding-bottom: 8px;
  }
  .auth-body {
    font-style: italic;
    text-align: center;
    font-size: 9.5pt;
    line-height: 1.7;
    margin-bottom: 30px;
  }
  .sig-grid {
    display: flex;
    justify-content: space-between;
    margin: 40px 0 20px;
  }
  .sig-block {
    width: 45%;
    text-align: center;
  }
  .sig-line {
    border-top: 1px solid #000;
    padding-top: 4px;
    font-size: 8.5pt;
    margin-top: 30px;
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
    <div class="company-info">
      315 Nantucket Blvd., Toronto, Ont. M1P 2P2<br>
      Phone: (416) 285-0619 &nbsp; Fax: (416) 285-1353<br>
      Website: www.samco-machinery.com<br>
      E-mail: sales@samco-machinery.com
    </div>
  </div>
  <div>
    <img src="${badgeUrl}" alt="ISO 9001 QMI Registered" class="iso-badge" />
  </div>
</div>

<div class="tagline">Rollforming and Machinery Specialists Since 1972</div>

<!-- ====== QUOTE INFO ====== -->
<div class="quote-info">
  <div class="left">
    <div><span class="label">Samco Quotation #:</span> <span class="value" style="font-weight:700; font-size:12pt;">${quote.quoteId}</span></div>
    <br>
    <div><span class="label">Customer:</span> <span class="value">${addressLines[0] || ""}</span></div>
    ${addressLines
      .slice(1)
      .map(
        (line) =>
          `<div style="margin-left: 70px;" class="value">${escHtml(line)}</div>`,
      )
      .join("")}
    <br>
    <div><span class="label">Attention:</span> <span class="value">${escHtml(quote.contact)}</span></div>
  </div>
  <div class="right-col">
    <div><span class="label">Date:</span> <span class="value">${fmtDate(quote.quoteDate)}</span></div>
    <br>
    ${quote.contactPhone ? `<div><span class="label">Phone:</span> <span class="value">${escHtml(quote.contactPhone)}</span></div>` : ""}
    ${quote.contactFax ? `<div><span class="label">Fax:</span> <span class="value">${escHtml(quote.contactFax)}</span></div>` : ""}
  </div>
</div>

<!-- ====== GREETING ====== -->
<div class="greeting">
  We are pleased to provide the following quote on the equipment you requested. Please
  contact me at any time if you have any questions. We look forward to your order.
</div>

<!-- ====== DESCRIPTION ====== -->
${
  quote.description
    ? `<div class="desc-section">
  <div class="desc-label">Description:</div>
  <div class="desc-text">${escHtml(quote.description)}</div>
</div>`
    : ""
}

<!-- ====== LINE ITEMS ====== -->
<table class="items-table">
  <thead>
    <tr>
      <th>Item / Description</th>
      <th style="text-align:right;">${curLabel}</th>
    </tr>
  </thead>
  <tbody>
    ${lineRows}
  </tbody>
</table>

<!-- ====== TOTAL ====== -->
<div class="total-section">
  <span class="total-label">Total Price:</span>
  &nbsp;&nbsp;
  <span class="total-amount">${fmt(totalPrice, cur)}</span>
</div>

<!-- ====== FOOTER ====== -->
<div class="footer">
  ${quote.leadTimeWeeks ? `<div class="delivery"><strong>Delivery:</strong> ${quote.leadTimeWeeks} weeks (to be confirmed at P.O. issue date)</div>` : ""}
  <div class="delivery"><strong>F.O.B.</strong> ${quote.fob || "SAMCO Machinery Limited, Toronto, Ontario, Canada"}</div>
  <br>
  ${quote.terms ? `<div class="terms-line"><strong>Terms:</strong> ${escHtml(quote.terms)}</div>` : ""}
  <br>
  <div class="terms-line">All pricing in ${cur}</div>
  <div class="terms-line">This quote is valid for 30 days and is based upon complete order</div>
  <div class="terms-line">Quote not valid unless accompanied by Samco's Terms &amp; Conditions</div>
  <div class="terms-line">All taxes are additional. All invoices are due upon receipt.</div>
  ${quote.salesRep ? `<div class="contact-line">Contact: ${escHtml(quote.salesRep)}</div>` : ""}
</div>

<!-- ====== AUTHORIZATION PAGE ====== -->
<div class="page-break"></div>

<div class="header">
  <div class="logo-area">
    <img src="${logoUrl}" alt="Samco Machinery Limited" class="samco-logo" />
    <div class="company-info">
      315 Nantucket Blvd., Toronto, Ont. M1P 2P2<br>
      Phone: (416) 285-0619 &nbsp; Fax: (416) 285-1353<br>
      Website: www.samco-machinery.com<br>
      E-mail: sales@samco-machinery.com
    </div>
  </div>
  <div>
    <img src="${badgeUrl}" alt="ISO 9001 QMI Registered" class="iso-badge" />
  </div>
</div>

<div class="tagline">Rollforming and Machinery Specialists Since 1972</div>

<div class="auth-title">AUTHORIZATION TO PROCEED</div>

<div class="auth-body">
  As per: SAMCO QUOTATION #${quote.quoteId}<br><br>
  We are authorizing SAMCO Machinery Limited to proceed with the order as per the above quotation
  with its terms and conditions attached.<br><br>
  We will forward a formal Purchase Order to your attention with any required payments as per quotation.<br><br>
  We understand that our order will begin (unless specified otherwise) when this signed authorization,
  complete specifications, &amp; the required payment (if specified) are received at SAMCO.
</div>

<div class="sig-grid">
  <div class="sig-block">
    <div class="sig-line">Company</div>
  </div>
  <div class="sig-block">
    <div class="sig-line">Samco Sales Rep</div>
  </div>
</div>

<div style="display:flex; justify-content:space-between; margin-top:20px;">
  <div style="width:35%; text-align:center;">
    <div class="sig-line">Authorized Company Signature</div>
  </div>
  <div style="width:25%; text-align:center;">
    <div class="sig-line">Date</div>
  </div>
  <div style="width:25%; text-align:center;">
    <div class="sig-line">Purchase Order #</div>
  </div>
</div>

<div style="text-align:center; margin-top:30px; font-weight:700; font-size:9.5pt;">
  PLEASE FAX THIS SIGNED AUTHORIZATION BACK TO<br>
  SAMCO AT FAX# (416) 285-1353
</div>

<div style="text-align:center; margin-top:20px; font-size:9pt; line-height:1.7;">
  <strong>Thank you for your order. Samco will confirm the delivery date
  and project schedule upon receiving the following 3 items:</strong><br><br>
  <strong>1)</strong> Customer down payment<br>
  <strong>2)</strong> Signed - Off Samco's profile drawing<br>
  <strong>3)</strong> Confirmation of line direction (in writing)<br><br>
  <strong>Please note:</strong> the quoted lead time commences once the above criteria are met.
</div>

</body>
</html>`;
}
