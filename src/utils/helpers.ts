export const getResourceUrl = (resource: string) => {
  if (resource.startsWith('http')) {
    return resource;
  }

  return `https://www.googleapis.com/calendar/${resource}`;
};

// parameters for getting the events from API
const params = {
  timeMin: new Date().toISOString(),
  singleEvents: true,
  orderBy: 'startTime',
  showDeleted: false,
};

export const str = Object.entries(params)
  .map(([key, val]) => `${key}=${String(val)}`)
  .join('&');

export const EVENTS_URL_KEY = `v3/calendars/primary/events?${str}`;
