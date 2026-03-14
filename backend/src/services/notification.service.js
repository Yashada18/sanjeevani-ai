const admin = require('firebase-admin');
const path = require('path');

let firebaseInitialized = false;

const initFirebase = () => {
  if (!firebaseInitialized) {
    try {
      const serviceAccount = require(path.resolve(__dirname, '../../firebase-service-account.json'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      firebaseInitialized = true;
      console.log('Firebase initialized');
    } catch (err) {
      console.warn('Firebase not initialized - notifications disabled:', err.message);
    }
  }
};

const sendDriverAlert = async (tokens, ambulanceLocation) => {
  if (!firebaseInitialized) return;
  
  const message = {
    notification: {
      title: 'Ambulance Approaching',
      body: 'Please clear the lane ahead'
    },
    data: {
      lat: String(ambulanceLocation.lat),
      lng: String(ambulanceLocation.lng),
      type: 'ambulance_alert'
    },
    tokens: tokens
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Alerts sent: ${response.successCount} success, ${response.failureCount} failed`);
    return response;
  } catch (error) {
    console.error('Notification error:', error.message);
  }
};

module.exports = { initFirebase, sendDriverAlert };