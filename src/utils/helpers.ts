export const API_BASE_URL = 'https://www.googleapis.com/calendar/';
export const EVENTS_URL_KEY = `v3/calendars/primary/events/`;

export const getResourceUrl = (resource: string) => {
  if (resource.startsWith('http')) {
    return resource;
  }

  return `${API_BASE_URL}${resource}`;
};

// parameters for getting the events from API
const params = {
  timeMin: new Date().toISOString(),
  singleEvents: true,
  orderBy: 'startTime',
  showDeleted: false,
  //   maxResults: '15',
};

export const queryParams = Object.entries(params)
  .map(([key, val]) => `${key}=${String(val)}`)
  .join('&');

export const EVENTS_URL_WITH_QUERY_PARAMS_KEY = `${EVENTS_URL_KEY}?${queryParams}`;
