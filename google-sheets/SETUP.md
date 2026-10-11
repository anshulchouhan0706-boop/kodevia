# Connect the "Book a free demo" form to your Google Sheet

Sheet: https://docs.google.com/spreadsheets/d/1JHp8hu2tqjc5DqBMFPYt1z2ouf3Ea6QT5hIsMmaPXRw
(The script already points at this sheet.)

1. Open the sheet, then **Extensions → Apps Script**.
2. Delete the sample code and paste in everything from `google-sheets/Code.gs`.
   Click **Save**.
3. In the function dropdown at the top choose **setup**, then click **Run**.
   Google asks for permission: pick your account → **Advanced** →
   **Go to (project name)** → **Allow**. A **Leads** tab with headers appears
   in your sheet.
4. **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   Click **Deploy**.
5. Copy the **Web app URL** (ends in `/exec`) and send it to Claude, or paste
   it into `data-endpoint=""` on `<form id="lead">` in `index.html`.

Columns in the Leads tab: Submitted (IST), Name, Phone, Email, Company,
Service, Budget, Timeline, Heard about us, Project details, Consent, Page.

Changing the script later: **Deploy → Manage deployments → Edit → New
version → Deploy** keeps the same URL.
