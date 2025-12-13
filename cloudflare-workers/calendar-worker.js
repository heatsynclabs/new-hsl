/**
 * Cloudflare Worker for Google Calendar API
 * Fetches events from Google Calendar
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    try {
      // Get query parameters
      const timeMin = url.searchParams.get('timeMin');
      const timeMax = url.searchParams.get('timeMax');
      const maxResults = url.searchParams.get('maxResults') || '50';

      // Check for required environment variables
      if (!env.GOOGLE_API_KEY || !env.CALENDAR_ID) {
        return new Response(
          JSON.stringify({
            error: 'Missing environment variables. Please set GOOGLE_API_KEY and CALENDAR_ID'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Build Google Calendar API URL
      const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars';
      const calendarId = encodeURIComponent(env.CALENDAR_ID);

      const params = new URLSearchParams({
        key: env.GOOGLE_API_KEY,
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

      // Fetch from Google Calendar API
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Check for API errors
      if (data.error) {
        return new Response(
          JSON.stringify({
            error: `Google Calendar API error: ${data.error.message}`
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        JSON.stringify(data),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (error) {
      console.error('Calendar API error:', error);

      return new Response(
        JSON.stringify({
          error: 'Failed to fetch calendar events',
          details: error.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  }
};