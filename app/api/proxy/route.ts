import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!googleScriptUrl) {
      throw new Error('Google Script URL is not defined in the environment variables');
    }

    // Fetch data from Google Apps Script (View action)
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'view' }), // Fetch all stock data
    });

    const text = await response.text();
    console.log('Raw response from Google Apps Script:', text);

    const data = JSON.parse(text); // Parse the JSON response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET proxy:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Request body:', body);

    const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!googleScriptUrl) {
      throw new Error('Google Script URL is not defined in the environment variables');
    }

    // Forward the POST request (for Add, Edit, Delete, Sell actions)
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body), // Forward the request body directly to the Google Apps Script
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST proxy:', error);
    return NextResponse.json({ error: 'Failed to handle request' }, { status: 500 });
  }
}
