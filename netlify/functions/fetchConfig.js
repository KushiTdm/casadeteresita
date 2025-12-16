// netlify/functions/fetchConfig.js
exports.handler = async (event, context) => {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const API_KEY = process.env.GOOGLE_API_KEY;
    
    if (!SHEET_ID || !API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing environment variables' })
      };
    }
    
    const range = 'Configuration!A2:B';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', errorText);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Failed to fetch config from Sheets' }) 
      };
    }

    const data = await response.json();
    const config = {};
    (data.values || []).forEach((row) => {
      const key = row[0];
      const value = row[1];
      if (key === 'whatsapp_number') config.whatsappNumber = value;
      if (key === 'currency') config.currency = value;
      if (key === 'check_in_time') config.checkInTime = value;
      if (key === 'check_out_time') config.checkOutTime = value;
      if (key === 'booking_rates') config.booking_rates = value;
    });

    return { 
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(config) 
    };
  } catch (error) {
    console.error('Error fetching config:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};