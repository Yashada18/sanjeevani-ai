const alertHospital = async (hospitalId, emergencyData) => {
  console.log(`Hospital ${hospitalId} alerted:`, {
    patientETA: emergencyData.eta,
    emergencyType: emergencyData.emergencyType,
    ambulanceLocation: emergencyData.origin
  });

  // In production this will call hospital dashboard via WebSocket
  return {
    hospitalId,
    alerted: true,
    timestamp: new Date().toISOString()
  };
};

module.exports = { alertHospital };