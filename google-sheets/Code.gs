/**
 * Kodevia: "Book a free demo" form -> Google Sheet.
 *
 * Paste this whole file into Extensions -> Apps Script in your Google Sheet,
 * then Deploy -> New deployment -> Web app (Execute as: Me, Who has access:
 * Anyone). Copy the web app URL into data-endpoint="" on <form id="lead"> in
 * index.html. Full steps: google-sheets/SETUP.md.
 *
 * Each submission becomes one row. The header row is created automatically.
 * Optional: put your email in NOTIFY_EMAIL to get an email for every lead.
 */
// Your sheet: https://docs.google.com/spreadsheets/d/1JHp8hu2tqjc5DqBMFPYt1z2ouf3Ea6QT5hIsMmaPXRw
const SPREADSHEET_ID = '1JHp8hu2tqjc5DqBMFPYt1z2ouf3Ea6QT5hIsMmaPXRw';
const SHEET_NAME = 'Leads';
const NOTIFY_EMAIL = '';   // optional: your email, to get an email for every new lead
const FIELDS = ['submitted', 'name', 'phone', 'email', 'company', 'service', 'budget', 'timeline', 'source', 'message', 'consent', 'page'];
const HEADERS = ['Submitted (IST)', 'Name', 'Phone', 'Email', 'Company', 'Service', 'Budget', 'Timeline', 'Heard about us', 'Project details', 'Consent', 'Page'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    // basic spam guard: the website field is a hidden trap people never fill
    if (p.website) return out({ ok: true });
    if (!p.name || !p.phone || !p.email) return out({ ok: false, error: 'missing fields' });

    const sheet = getSheet();
    const row = FIELDS.map((k) => clean(p[k]));
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'New demo request: ' + clean(p.name) + ' (' + clean(p.service) + ')',
        body: HEADERS.map((h, i) => h + ': ' + row[i]).join('\n'),
      });
    }
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the web app URL in a browser shows this, so you can test the link.
function doGet() { return out({ ok: true, message: 'Kodevia lead form endpoint is live.' }); }

function getSheet() {
  // the sheet this script was opened from; falls back to the ID above
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#EDE7FE');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Stop spreadsheet formula injection and trim long input.
function clean(v) {
  v = String(v == null ? '' : v).trim().slice(0, 2000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Run this once from the editor (select setup, press Run) to create the
// Leads tab with its headers and grant permission before going live.
function setup() { getSheet(); }
