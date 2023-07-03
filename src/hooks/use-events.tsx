import { AxiosError, AxiosResponse } from 'axios';
import { calendar_v3 } from 'googleapis/build/src/apis/calendar/v3';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { addEventService, deleteEventService } from '../service/events-service';
import { EVENTS_URL_WITH_QUERY_PARAMS_KEY } from '../utils/helpers';

export const useEvents = () =>
  useSWR<AxiosResponse<calendar_v3.Schema$Events>, AxiosError>(EVENTS_URL_WITH_QUERY_PARAMS_KEY);

export const useAddEvent = () => useSWRMutation(EVENTS_URL_WITH_QUERY_PARAMS_KEY, addEventService);

export const useDeleteEvents = () => useSWRMutation(EVENTS_URL_WITH_QUERY_PARAMS_KEY, deleteEventService);
