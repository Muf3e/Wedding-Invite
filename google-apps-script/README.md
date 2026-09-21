# Connect the RSVP form to your Google Sheet

Sheet: <https://docs.google.com/spreadsheets/d/1tygrKTnyoGsdj4KtKI4ogeCblV7MA8zkt8AwEICrxrM/edit>

Every RSVP becomes one row:
`Timestamp (IST) · Guest Name · Phone / WhatsApp · Number of Guests · Attendance Status · Mubarak Wish / Dua · Reference`

## Set it up (about 2 minutes, one time)

1. Open the sheet, then **Extensions → Apps Script**.
2. Delete the sample code, paste **all** of `Code.gs` from this folder, and click **Save**.
3. Choose `setupSheet` in the function dropdown and click **Run**. Approve the permissions
   (**Advanced → Go to project → Allow**). The lavender & gold header row appears.
4. Click **Deploy → New deployment**, pick the gear icon → **Web app**, then set
   **Execute as: Me** and **Who has access: Anyone**, and click **Deploy**.
5. Copy the **Web app URL** (it ends in `/exec`).
6. Open `rsvp-config.js` on the website, paste the URL between the quotes, and save.
7. Test it: open the `/exec` URL in a browser (you should see `{"status":"active", …}`), then send a
   test RSVP from the website. A new row appears in the sheet.

## Good to know

- **Keep the sheet private.** The script runs as you ("Execute as: Me"), so guests never need access to the
  sheet. In the sheet, choose **Share → General access → Restricted**. If the link is set to
  "Anyone with the link", anyone who finds it can read your guests' names and phone numbers.
- **Editing the script later:** Deploy → Manage deployments → pencil icon → **New version**. The URL stays the same.
- **Guests always know what happened.** The site says "received" only after the sheet confirms. Otherwise
  the guest sees an error and can press Send again; retries never create duplicate rows (see the
  `Reference` column).
- **Everything is stored as plain text**, so phone numbers like `+91 98765 43210` are never turned into
  formulas or numbers.
