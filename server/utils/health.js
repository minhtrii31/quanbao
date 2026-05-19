const mongoose = require('mongoose');
const { getProductionEnvReadiness } = require('../config/env');

const mongoStates = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

const getMongoStatus = () => {
  const state = mongoStates[mongoose.connection.readyState] || 'unknown';

  return {
    status: state === 'connected' ? 'ok' : 'failed',
    state,
  };
};

const getLiveness = () => ({
  success: true,
  status: 'ok',
  service: 'api',
});

const getReadiness = () => {
  const mongodb = getMongoStatus();
  const environment = getProductionEnvReadiness();
  const checks = { mongodb, environment };
  const ready = Object.values(checks).every((check) => check.status === 'ok' || check.status === 'skipped');

  return {
    httpStatus: ready ? 200 : 503,
    body: {
      success: ready,
      status: ready ? 'ready' : 'not_ready',
      checks,
    },
  };
};

module.exports = {
  getLiveness,
  getMongoStatus,
  getReadiness,
};
