import { AxiosError } from 'axios';
import { calendar_v3 } from 'googleapis/build/src/apis/calendar/v3';
import useSWR, { preload } from 'swr';
import useSWRMutation from 'swr/mutation';

import { addEvent, deleteEvent, fetcher } from '../service/events-service';
import { eventQueryParams, EVENTS_URL_KEY } from '../utils/service-helper';
import { useAuth } from './use-auth';

export const useEvents = () => {
  const { token } = useAuth();
  return useSWR<calendar_v3.Schema$Events, AxiosError>(EVENTS_URL_KEY, fetcher(token, { params: eventQueryParams }));
};

export const useAddEvent = () => useSWRMutation(EVENTS_URL_KEY, addEvent);

export const useDeleteEvents = () => useSWRMutation(EVENTS_URL_KEY, deleteEvent);

export const preloadEvents = (token: string) => preload(EVENTS_URL_KEY, fetcher(token, { params: eventQueryParams }));
