import { preload } from 'swr';

import axios from '../config/axios';
import { EVENTS_URL_KEY, EVENTS_URL_WITH_QUERY_PARAMS_KEY, getResourceUrl } from '../utils/service-helper';

interface NewEventRequestBody {
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  summary: string;
}

export const deleteEventService = (url: string, { arg }: { arg: string }) => axios.delete(`${EVENTS_URL_KEY}${arg}`);

export const addEventService = (url: string, { arg }: { arg: NewEventRequestBody }) =>
  axios.post(`${EVENTS_URL_KEY}`, JSON.stringify(arg));

export const preloadEvents = (token: string) =>
  preload(EVENTS_URL_WITH_QUERY_PARAMS_KEY, (resource: string) =>
    axios
      .get(getResourceUrl(resource), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data as object),
  );
