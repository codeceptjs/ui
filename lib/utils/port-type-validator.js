const TYPES = ['application', 'ws'];

export default (type) => {
  if (!TYPES.includes(type)) {
    throw Error('Type must be "application" or "ws"');
  }
};
