/**
 * ============================================================================
 * MUSTAFA & TASNEEM — WEDDING RSVP WEBHOOK (Google Apps Script)
 * ----------------------------------------------------------------------------
 * Receives the RSVP form from the invitation website and appends one row per
 * response to this Google Sheet:
 * https://docs.google.com/spreadsheets/d/1tygrKTnyoGsdj4KtKI4ogeCblV7MA8zkt8AwEICrxrM/edit
 *
 * DEPLOY (about 2 minutes) — full steps are in README.md next to this file:
 *  1. Open the sheet > Extensions > Apps Script, paste this whole file, Save.
 *  2. Run  setupSheet  once (approve the permissions) to create the header row.
 *  3. Deploy > New deployment > Web app:  Execute as "Me",  Who has access "Anyone".
 *  4. Copy the Web app URL (ends in /exec) into  rsvp-config.js  on the website.
 *
 * The web app runs as YOU, so the sheet itself can stay private (Restricted).
 * ============================================================================
 */

var SPREADSHEET_ID = '1tygrKTnyoGsdj4KtKI4ogeCblV7MA8zkt8AwEICrxrM';
var TIMEZONE = 'Asia/Kolkata';

var HEADERS = [
  'Timestamp (IST)',
  'Guest Name',
  'Phone / WhatsApp',
  'Number of Guests',
  'Attendance Status',
  'Mubarak Wish / Dua',
  'Reference'
];

var MAX_LEN = { name: 120, phone: 40, count: 10, attendance: 60, message: 1000, id: 64 };

/** The first tab of the spreadsheet (the one your share link opens). */
function getSheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
}

/** Run once from the editor: writes the styled header row and sets the columns to plain text. */
function setupSheet() {
  var sheet = getSheet_();
  var header = sheet.getRange(1, 1, 1, HEADERS.length);
  header.setValues([HEADERS]);
  header.setBackground('#5B3D8F');      // royal lavender
  header.setFontColor('#FFF3CF');       // soft gold
  header.setFontWeight('bold');
  header.setFontSize(11);
  header.setHorizontalAlignment('center');
  header.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);
  // Plain text so phone numbers such as "+91 98765 43210" are never read as formulas or numbers.
  sheet.getRange(2, 1, Math.max(sheet.getMaxRows() - 1, 1), HEADERS.length).setNumberFormat('@');
  sheet.autoResizeColumns(1, HEADERS.length);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    var data = parseBody_(e);

    // Spam trap: real guests never see or fill this hidden field.
    if (data.website) return json_({ status: 'success', message: 'ok' });

    var rec = clean_(data);
    if (!rec.name || !rec.phone) {
      return json_({ status: 'error', message: 'Name and phone are required.' });
    }

    var sheet = getSheet_();
    if (sheet.getLastRow() === 0) setupSheet();

    // The website re-sends the same reference when a guest retries, so nothing is recorded twice.
    if (rec.id && isDuplicate_(sheet, rec.id)) {
      return json_({ status: 'success', message: 'Already recorded.' });
    }

    var row = [
      Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss'),
      rec.name, rec.phone, rec.count, rec.attendance, rec.message, rec.id
    ];
    var target = sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length);
    target.setNumberFormat('@');            // text first, then the values, so nothing is interpreted
    target.setValues([row]);
    target.setVerticalAlignment('middle');
    target.setFontSize(10);

    return json_({ status: 'success', message: 'RSVP recorded.' });
  } catch (error) {
    return json_({ status: 'error', message: String(error) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) { /* not held */ }
  }
}

/** Opening the /exec URL in a browser shows this, which is a quick way to check the deployment. */
function doGet() {
  return json_({ status: 'active', title: 'Mustafa & Tasneem wedding RSVP webhook is active.' });
}

/* ---------------------------------------------------------------------------
   helpers
   --------------------------------------------------------------------------- */
function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents) || {}; } catch (err) { /* fall through to form fields */ }
  }
  return (e && e.parameter) || {};
}

function clean_(d) {
  function text(value, max) {
    var s = (value === null || value === undefined) ? '' : String(value);
    s = s.replace(/[^\t\n\r\u0020-\u007E\u00A0-\uFFFF]/g, ' ').trim();
    return s.length > max ? s.substring(0, max) : s;
  }
  // A leading = + - @ can turn a cell into a formula when the sheet is downloaded, so neutralise it.
  function safe(s) { return /^[=+\-@]/.test(s) ? "'" + s : s; }

  return {
    name: safe(text(d.name, MAX_LEN.name)),
    phone: text(d.phone, MAX_LEN.phone).replace(/[^0-9+()\-\s]/g, '').trim(),
    count: text(d.count, MAX_LEN.count),
    attendance: safe(text(d.attendance, MAX_LEN.attendance)) || 'Joyfully Attending',
    message: safe(text(d.message, MAX_LEN.message)),
    id: text(d.id, MAX_LEN.id).replace(/[^A-Za-z0-9_-]/g, '')
  };
}

function isDuplicate_(sheet, id) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var refs = sheet.getRange(2, 7, last - 1, 1).getValues();
  for (var i = 0; i < refs.length; i++) {
    if (String(refs[i][0]) === id) return true;
  }
  return false;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
