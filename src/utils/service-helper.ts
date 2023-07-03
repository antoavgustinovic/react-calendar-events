export const API_BASE_URL = 'https://www.googleapis.com/calendar/';
export const EVENTS_URL_KEY = `v3/calendars/primary/events/`;

// parameters for getting the events from API
const params = {
  timeMin: new Date().toISOString(),
  singleEvents: true,
  orderBy: 'startTime',
  showDeleted: false,
};

const eventsQueryParams = Object.entries(params)
  .map(([key, val]) => `${key}=${String(val)}`)
  .join('&');

export const EVENTS_URL_WITH_QUERY_PARAMS_KEY = `${EVENTS_URL_KEY}?${eventsQueryParams}`;

export const getResourceUrl = (resource: string) => {
  if (resource.startsWith('http')) {
    return resource;
  }

  return `${API_BASE_URL}${resource}`;
};
