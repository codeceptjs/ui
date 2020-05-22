const TYPES = ['application', 'ws'];

module.exports = (type) => {
  if (!TYPES.includes(type)) {
    throw Error('Type must be "application" or "ws"');
  }
};
