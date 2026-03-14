const axios = require('axios');

const calculateRoute = async (origin, destination) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json`;
    const response = await axios.get(url, {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
        departure_time: 'now',
        traffic_model: 'best_guess'
      }
    });

    const data = response.data;

    if (data.status !== 'OK') {
      throw new Error(`Maps API error: ${data.status}`);
    }

    const leg = data.routes[0].legs[0];
    return {
      distance: leg.distance.text,
      duration: leg.duration_in_traffic?.text || leg.duration.text,
      eta_seconds: leg.duration_in_traffic?.value || leg.duration.value,
      steps: leg.steps.map(s => ({
        instruction: s.html_instructions.replace(/<[^>]*>/g, ''),
        distance: s.distance.text
      })),
      polyline: data.routes[0].overview_polyline.points
    };
  } catch (error) {
    console.error('Route calculation error:', error.message);
    throw error;
  }
};

module.exports = { calculateRoute };