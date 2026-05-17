/**
 * @OnlyCurrentDoc
 * 
 * SeedShelter — Waitlist Email Capture
 * Google Apps Script (Free Serverless Backend)
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet in your Google Drive (e.g., "SeedShelter Waitlist")
 * 2. In the Google Sheet menu, click Extensions → Apps Script
 * 3. Paste this entire file contents into Code.gs
 * 4. Click "Deploy" → "New Deployment"
 * 5. Select Type: "Web app"
 * 6. Set "Execute as": Me
 * 7. Set "Who has access": Anyone
 * 8. Click Deploy → copy the Web App URL
 * 9. Paste that URL into js/main.js → WAITLIST_ENDPOINT constant
 *
 * The script will automatically add headers if they don't exist yet.
 */

/**
 * Get the active spreadsheet and initialize headers if empty
 */
function getTargetSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  // If the sheet is empty, add headers and format them
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Email', 'Timestamp', 'Source']);
    sheet.getRange('A1:C1').setFontWeight('bold');
    sheet.setColumnWidth(1, 300);
    sheet.setColumnWidth(2, 200);
    sheet.setColumnWidth(3, 150);
  }

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

    var sheet = getTargetSheet();

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
