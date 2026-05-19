const writeLog = (level, event, fields = {}) => {
  const entry = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...fields,
  };

  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
    return;
  }

  console.log(line);
};

module.exports = {
  info: (event, fields) => writeLog('info', event, fields),
  warn: (event, fields) => writeLog('warn', event, fields),
  error: (event, fields) => writeLog('error', event, fields),
};
