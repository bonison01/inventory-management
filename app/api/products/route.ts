import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const { productName, qty, sellingPrice, trainerPrice, storePrice, company } = body;

  try {
    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.SPREADSHEET_ID; // Your Google Sheet ID

    // Append the data to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:F', // Assuming your data starts from column A to F
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[productName, qty, sellingPrice, trainerPrice, storePrice, company]],
      },
    });

    return NextResponse.json({ message: 'Product data saved successfully!' });
  } catch (error) {
    console.error('Error saving product data to Google Sheets:', error);
    return NextResponse.json({ error: 'Failed to save product data' }, { status: 500 });
  }
}
