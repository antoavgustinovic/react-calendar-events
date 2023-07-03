export const API_BASE_URL = 'https://www.googleapis.com/calendar/';
export const EVENTS_URL_KEY = `v3/calendars/primary/events/`;

export const eventQueryParams = {
  timeMin: new Date().toISOString(),
  singleEvents: true,
  orderBy: 'startTime',
  showDeleted: false,
};

export const getResourceUrl = (resource: string) => {
  if (resource.startsWith('http')) {
    return resource;
  }

  return `${API_BASE_URL}${resource}`;
};
