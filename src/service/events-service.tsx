import axiosInstance from '../config/axios';
import { EVENTS_URL_KEY } from '../utils/helpers';

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

export const deleteEventService = (url: string, { arg }: { arg: string }) =>
  axiosInstance.delete(`${EVENTS_URL_KEY}${arg}`);

export const addEventService = (url: string, { arg }: { arg: NewEventRequestBody }) =>
  axiosInstance.post(`${EVENTS_URL_KEY}`, JSON.stringify(arg));
