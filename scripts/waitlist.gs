/**
 * SeedShelter — Waitlist Email Capture
 * Google Apps Script (Free Serverless Backend)
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and create a new project
 * 2. Paste this entire file contents into Code.gs
 * 3. Click "Deploy" → "New Deployment"
 * 4. Select Type: "Web app"
 * 5. Set "Execute as": Me
 * 6. Set "Who has access": Anyone
 * 7. Click Deploy → copy the Web App URL
 * 8. Paste that URL into js/main.js → WAITLIST_ENDPOINT constant
 *
 * The script will automatically create a Google Sheet named
 * "SeedShelter Waitlist" in your Google Drive.
 */

// Sheet name constant
var SHEET_NAME = 'SeedShelter Waitlist';

/**
 * Get or create the waitlist spreadsheet
 */
function getOrCreateSheet() {
  var files = DriveApp.getFilesByName(SHEET_NAME);

  if (files.hasNext()) {
    var file = files.next();
    var ss = SpreadsheetApp.open(file);
    return ss.getActiveSheet();
  }

  // Create new spreadsheet with headers
  var ss = SpreadsheetApp.create(SHEET_NAME);
  var sheet = ss.getActiveSheet();
  sheet.appendRow(['Email', 'Timestamp', 'Source']);
  sheet.getRange('A1:C1').setFontWeight('bold');
  sheet.setColumnWidth(1, 300);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 150);

  return sheet;
}

/**
 * Check if email already exists in the sheet
 */
function emailExists(sheet, email) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase() === email.toLowerCase()) {
      return true;
    }
  }
  return false;
}

/**
 * Handle POST requests (waitlist signups)
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var email = (data.email || '').trim().toLowerCase();

    // Basic validation
    if (!email || email.indexOf('@') === -1) {
      return buildResponse({ status: 'error', message: 'Invalid email address' });
    }

    var sheet = getOrCreateSheet();

    // Check for duplicates
    if (emailExists(sheet, email)) {
      return buildResponse({ status: 'duplicate', message: 'Already on the waitlist' });
    }

    // Add new entry
    sheet.appendRow([
      email,
      new Date().toISOString(),
      'website'
    ]);

    return buildResponse({ status: 'success', message: 'Added to waitlist' });

  } catch (err) {
    return buildResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * Handle GET requests (health check / CORS preflight)
 */
function doGet(e) {
  return buildResponse({ status: 'ok', message: 'SeedShelter Waitlist API' });
}

/**
 * Build a JSON response with CORS headers
 */
function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
