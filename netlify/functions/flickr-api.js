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
    const { limit = '20' } = event.queryStringParameters || {};

    // Flickr API URL
    const flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=bec64c9c0f28889dc6e0c5ef7be3511f&user_id=60827818%40N07&tags=publish&format=rest';

    // Fetch data from Flickr API
    const data = await new Promise((resolve, reject) => {
      https.get(flickrUrl, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          resolve(body);
        });
      }).on('error', (error) => {
        reject(error);
      });
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ contents: data }),
    };

  } catch (error) {
    console.error('Flickr API error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch Flickr photos',
        details: error.message
      }),
    };
  }
};