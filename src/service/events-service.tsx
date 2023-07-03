/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { calendar_v3 } from 'googleapis/build/src/apis/calendar/v3';

import axios from '../config/axios';
import { getResourceUrl } from '../utils/service-helper';

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

type FetcherFn = {
  (init: any): (resource: string) => Promise<object>;
  (token: string | null | undefined): (resource: string) => Promise<object>;
  (init?: any, token?: string | null): (resource: string) => Promise<object>;
};

export const fetcher: FetcherFn = ((initOrToken: any, token?: string | null) => {
  if (typeof token === 'undefined') {
    return (resource: string) => {
      const init = initOrToken;
      return axios
        .get(getResourceUrl(resource), {
          ...init,
          headers: {
            ...init?.headers,
          },
        })
        .then((res) => res.data as object);
    };
  }

  const init = initOrToken;
  return (resource: string) =>
    axios
      .get(getResourceUrl(resource), {
        ...init,
        headers: {
          ...init?.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      .then((res) => res.data as object);
}) as FetcherFn;

export const deleteEvent = (url: string, { arg }: { arg: string }) =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  axios.delete(`${url}${arg}`) as Promise<calendar_v3.Schema$Events>;

export const addEvent = (url: string, { arg }: { arg: NewEventRequestBody }) =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  axios.post(url, JSON.stringify(arg)) as Promise<calendar_v3.Schema$Events>;
