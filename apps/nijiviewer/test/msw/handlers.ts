import { http, HttpResponse } from 'msw';
import {
  HOLODEX_AUTOCOMPLETE,
  HOLODEX_LIVE,
  HOLODEX_USERS_LIVE,
  holodexChannelUrl,
} from './factories';

/**
 * Default handlers return empty arrays / null.
 * Tests should call `server.use(...)` to override per-case behavior.
 */
export const defaultHandlers = [
  http.get(HOLODEX_LIVE, () => HttpResponse.json([])),
  http.get(HOLODEX_USERS_LIVE, () => HttpResponse.json([])),
  http.get(HOLODEX_AUTOCOMPLETE, () => HttpResponse.json([])),
  http.get(holodexChannelUrl(':channelId'), () => HttpResponse.json(null)),
];
