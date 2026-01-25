import https from 'https';

export const handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { timeMin, timeMax, maxResults = '50' } = event.queryStringParameters || {};

    if (!process.env.GOOGLE_API_KEY || !process.env.CALENDAR_ID) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Missing environment variables. Please set GOOGLE_API_KEY and CALENDAR_ID'
        }),
      };
    }

    // Build the Google Calendar API URL
    const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars';
    const calendarId = encodeURIComponent(process.env.CALENDAR_ID);
    const apiKey = process.env.GOOGLE_API_KEY;

    const params = new URLSearchParams({
      key: apiKey,
      orderBy: 'startTime',
      singleEvents: 'true',
      maxResults: maxResults,
    });

    if (timeMin) {
      params.append('timeMin', timeMin);
    }

    if (timeMax) {
      params.append('timeMax', timeMax);
    }

    const apiUrl = `${baseUrl}/${calendarId}/events?${params.toString()}`;

    // Make the request to Google Calendar API
    const data = await new Promise((resolve, reject) => {
      https.get(apiUrl, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            resolve(parsed);
          } catch (error) {
            reject(new Error('Failed to parse Google Calendar response'));
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    });

    // Check for API errors
    if (data.error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: `Google Calendar API error: ${data.error.message}`
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('Calendar API error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch calendar events',
        details: error.message
      }),
    };
  }
};