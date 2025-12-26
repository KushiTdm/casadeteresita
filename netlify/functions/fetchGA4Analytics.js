// netlify/functions/fetchGA4Analytics.js
// ⚠️ Nécessite la configuration d'un Service Account Google

const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Variables d'environnement Netlify
const PROPERTY_ID = process.env.GA4_PROPERTY_ID; // Ex: 123456789
const SERVICE_ACCOUNT_KEY = process.env.GA4_SERVICE_ACCOUNT_KEY; // JSON stringifié

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Parse les credentials
    const credentials = JSON.parse(SERVICE_ACCOUNT_KEY);

    // Initialiser le client GA4
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials
    });

    const { dateRange = 'last7Days' } = JSON.parse(event.body || '{}');

    // Calculer les dates
    const today = new Date();
    const startDate = new Date();
    
    if (dateRange === 'last7Days') {
      startDate.setDate(today.getDate() - 7);
    } else if (dateRange === 'last30Days') {
      startDate.setDate(today.getDate() - 30);
    } else if (dateRange === 'last90Days') {
      startDate.setDate(today.getDate() - 90);
    }

    const startDateStr = startDate.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    // ==========================================
    // 📊 REQUÊTES GA4 REPORTING API
    // ==========================================

    // 1. Métriques générales
    const [overviewResponse] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startDateStr, endDate: todayStr }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' }
      ]
    });

    // 2. Timeline (par jour)
    const [timelineResponse] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startDateStr, endDate: todayStr }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'sessions' },
        { name: 'conversions' }
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }]
    });

    // 3. Top Pages
    const [pagesResponse] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startDateStr, endDate: todayStr }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' }
      ],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10
    });

    // 4. Événements de conversion
    const [conversionsResponse] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startDateStr, endDate: todayStr }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: {
            values: [
              'view_item',
              'select_dates',
              'view_price',
              'begin_checkout',
              'contact'
            ]
          }
        }
      }
    });

    // 5. Blog Posts
    const [blogResponse] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startDateStr, endDate: todayStr }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'CONTAINS',
            value: '/blog/'
          }
        }
      },
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10
    });

    // 6. Museum
    const [museumResponse] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startDateStr, endDate: todayStr }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'CONTAINS',
            value: '/museum/'
          }
        }
      },
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10
    });

    // 7. Démographie
    const [demographicsResponse] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startDateStr, endDate: todayStr }],
      dimensions: [
        { name: 'country' },
        { name: 'deviceCategory' }
      ],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10
    });

    // ==========================================
    // 🔄 FORMATER LES DONNÉES
    // ==========================================

    const analytics = {
      overview: {
        totalVisits: parseInt(overviewResponse.rows?.[0]?.metricValues?.[0]?.value || 0),
        uniqueVisitors: parseInt(overviewResponse.rows?.[0]?.metricValues?.[1]?.value || 0),
        pageViews: parseInt(overviewResponse.rows?.[0]?.metricValues?.[2]?.value || 0),
        avgSessionDuration: parseFloat(overviewResponse.rows?.[0]?.metricValues?.[3]?.value || 0),
        bounceRate: parseFloat(overviewResponse.rows?.[0]?.metricValues?.[4]?.value || 0) * 100,
        conversionRate: 0 // À calculer
      },
      timeline: timelineResponse.rows?.map(row => ({
        date: row.dimensionValues[0].value,
        visits: parseInt(row.metricValues[0].value),
        bookings: parseInt(row.metricValues[1].value || 0)
      })) || [],
      pages: pagesResponse.rows?.map(row => ({
        path: row.dimensionValues[0].value,
        views: parseInt(row.metricValues[0].value),
        avgTime: Math.round(parseFloat(row.metricValues[1].value)),
        bounceRate: Math.round(parseFloat(row.metricValues[2].value) * 100)
      })) || [],
      conversions: {
        roomViews: 0,
        dateSelections: 0,
        priceChecks: 0,
        bookingIntents: 0,
        whatsappClicks: 0
      },
      blog: blogResponse.rows?.map(row => ({
        title: row.dimensionValues[0].value.split('/').pop() || 'Unknown',
        slug: row.dimensionValues[0].value,
        views: parseInt(row.metricValues[0].value),
        avgTime: Math.round(parseFloat(row.metricValues[1].value))
      })) || [],
      museum: museumResponse.rows?.map(row => ({
        title: row.dimensionValues[0].value.split('/').pop() || 'Unknown',
        slug: row.dimensionValues[0].value,
        views: parseInt(row.metricValues[0].value)
      })) || [],
      demographics: {
        countries: [],
        devices: []
      }
    };

    // Parser les conversions
    conversionsResponse.rows?.forEach(row => {
      const eventName = row.dimensionValues[0].value;
      const count = parseInt(row.metricValues[0].value);
      
      if (eventName === 'view_item') analytics.conversions.roomViews = count;
      if (eventName === 'select_dates') analytics.conversions.dateSelections = count;
      if (eventName === 'view_price') analytics.conversions.priceChecks = count;
      if (eventName === 'begin_checkout') analytics.conversions.bookingIntents = count;
      if (eventName === 'contact') analytics.conversions.whatsappClicks = count;
    });

    // Calculer le taux de conversion
    if (analytics.overview.pageViews > 0) {
      analytics.overview.conversionRate = (
        (analytics.conversions.whatsappClicks / analytics.overview.pageViews) * 100
      ).toFixed(2);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(analytics)
    };

  } catch (error) {
    console.error('GA4 API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch analytics',
        message: error.message 
      })
    };
  }
};