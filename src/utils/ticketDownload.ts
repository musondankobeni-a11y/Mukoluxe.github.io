import { OrderTicket } from '../types';
import { escapeHtml } from './security';

export const downloadOrderTicket = (ticket: OrderTicket) => {
  const safeClientName = escapeHtml(ticket.clientName);
  const safeClientPhone = escapeHtml(ticket.clientPhone);
  const safeEventType = escapeHtml(ticket.eventType);
  const safeLocation = escapeHtml(ticket.location);
  const safeEventDate = escapeHtml(ticket.eventDate);
  const safeTicketNumber = escapeHtml(ticket.ticketNumber);
  const safeStatus = escapeHtml(ticket.status);
  const safeNotes = ticket.specialNotes ? escapeHtml(ticket.specialNotes) : '';

  // Calculate or retrieve total
  const calculatedTotal = ticket.totalPrice || ticket.selectedDrinks.reduce((acc, d) => acc + (d.price || 0), 0);

  const drinksRowsHtml = ticket.selectedDrinks
    .map(d => `
      <tr style="border-bottom: 1px dashed rgba(212,175,55,0.2);">
        <td style="padding: 10px 8px; color: #fff; font-size: 13px; font-weight: 500;">
          ${escapeHtml(d.name)}
        </td>
        <td style="padding: 10px 8px; text-align: right; color: #ffd700; font-family: monospace; font-size: 13px; font-weight: 600;">
          ${d.price ? `ZMW ${d.price.toFixed(2)}` : 'Included'}
        </td>
      </tr>
    `)
    .join('');

  const ticketHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Muko Luxe Ticket - ${safeTicketNumber}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background: #0d0a08;
      color: #f7f3ed;
      padding: 40px 20px;
      margin: 0;
      display: flex;
      justify-content: center;
    }
    .ticket-card {
      width: 100%;
      max-width: 640px;
      background: #14100c;
      border: 2px solid #d4af37;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
      position: relative;
    }
    .header {
      border-bottom: 2px solid #d4af37;
      padding-bottom: 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #ffd700;
      text-transform: uppercase;
    }
    .badge {
      background: rgba(212, 175, 55, 0.2);
      border: 1px solid #d4af37;
      color: #ffd700;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .ref-box {
      background: #080706;
      border: 1px dashed #d4af37;
      border-radius: 10px;
      padding: 16px;
      text-align: center;
      margin-bottom: 24px;
    }
    .ref-label {
      font-size: 11px;
      color: #bfa15f;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .ref-val {
      font-size: 26px;
      font-family: monospace;
      font-weight: bold;
      color: #fff;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .grid-item {
      background: #1a1510;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #2e2418;
    }
    .item-label {
      font-size: 10px;
      color: #a88a4d;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .item-val {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }
    .drinks-section {
      background: #1a1510;
      padding: 18px;
      border-radius: 8px;
      border: 1px solid #2e2418;
      margin-bottom: 24px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }
    .total-box {
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid #d4af37;
      border-radius: 8px;
      padding: 14px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
    }
    .total-label {
      font-size: 12px;
      font-weight: bold;
      color: #ffd700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .total-value {
      font-size: 22px;
      font-family: monospace;
      font-weight: bold;
      color: #ffd700;
    }
    .footer {
      border-top: 1px solid #332a1e;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #8c734b;
    }
    .stamp {
      color: #ffd700;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .btn-print {
      display: block;
      width: 100%;
      background: #d4af37;
      color: #000;
      font-weight: bold;
      padding: 14px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 20px;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    @media print {
      .btn-print { display: none; }
      body { background: #fff; color: #000; }
      .ticket-card { background: #fff; color: #000; border-color: #000; box-shadow: none; }
      .brand, .badge, .stamp { color: #000; border-color: #000; }
      .ref-box, .grid-item, .drinks-section, .total-box { background: #f9f9f9; color: #000; border-color: #ccc; }
      .ref-val, .item-val, .total-value, td { color: #000 !important; }
    }
  </style>
</head>
<body>
  <div class="ticket-card">
    <div class="header">
      <div>
        <div class="brand">muko luxe_ concierge</div>
        <div style="font-size: 12px; color: #bfa15f; margin-top: 2px;">Official Event Bar Reservation Pass</div>
      </div>
      <div class="badge">${safeStatus}</div>
    </div>

    <div class="ref-box">
      <div class="ref-label">Ticket Tracking Reference</div>
      <div class="ref-val">${safeTicketNumber}</div>
    </div>

    <div class="grid">
      <div class="grid-item">
        <div class="item-label">Client / Host</div>
        <div class="item-val">${safeClientName}</div>
      </div>
      <div class="grid-item">
        <div class="item-label">Phone Contact</div>
        <div class="item-val">${safeClientPhone}</div>
      </div>
      <div class="grid-item">
        <div class="item-label">Event Type</div>
        <div class="item-val">${safeEventType}</div>
      </div>
      <div class="grid-item">
        <div class="item-label">Event Date</div>
        <div class="item-val">${safeEventDate}</div>
      </div>
      <div class="grid-item">
        <div class="item-label">Venue Location</div>
        <div class="item-val">${safeLocation}</div>
      </div>
      <div class="grid-item">
        <div class="item-label">Guest Count</div>
        <div class="item-val">${ticket.guestCount} Attendees</div>
      </div>
    </div>

    <div class="drinks-section">
      <div class="item-label">Selected Cocktails & Beverage Experience</div>
      <table>
        <tbody>
          ${drinksRowsHtml}
        </tbody>
      </table>

      <!-- TOTAL PRICE OF SELECTED ITEMS -->
      <div class="total-box">
        <div class="total-label">Total Price of Selected Items</div>
        <div class="total-value">ZMW ${calculatedTotal.toFixed(2)}</div>
      </div>

      ${safeNotes ? `<div style="margin-top: 14px; font-size: 12px; color: #bfa15f; font-style: italic;">Special Requests: "${safeNotes}"</div>` : ''}
    </div>

    <div class="footer">
      <div>
        <div>Concierge Call Line: 0976516321</div>
        <div>WhatsApp Direct: +2609 68 3 66 6 47</div>
        <div>Location Coordinates: GCWW+HQ6 Kabwe</div>
      </div>
      <div style="text-align: right;">
        <div class="stamp">VERIFIED PASS</div>
        <div style="font-size: 10px; margin-top: 4px;">&copy;muko luxe_concierge design by Humphrey nkobeni..</div>
      </div>
    </div>

    <button class="btn-print" onclick="window.print()">Print / Save PDF</button>
  </div>
</body>
</html>`;

  const blob = new Blob([ticketHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MukoLuxe_Ticket_${ticket.ticketNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
