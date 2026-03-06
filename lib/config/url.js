import { getPort } from './env.js';
import portTypeValidator from '../utils/port-type-validator.js';

export function getUrl(type) {
  portTypeValidator(type);
  return `http://localhost:${getPort(type)}`;
}
