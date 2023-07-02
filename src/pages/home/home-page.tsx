import { Alert, AlertIcon, Box, Flex, Spinner } from '@chakra-ui/react';
import { AxiosError, AxiosResponse } from 'axios';
import { calendar_v3 } from 'googleapis';
import useSWR from 'swr';

import { EVENTS_URL_KEY } from '../../utils/helpers';
import CalendarEvents from './events';

function HomePage() {
  const {
    data: events,
    error,
    isLoading,
  } = useSWR<AxiosResponse<calendar_v3.Schema$Events>, AxiosError>(EVENTS_URL_KEY);

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        There was an error while retrieving your events. Please refresh the page or try again later.
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Flex justifyContent="center">
        <Spinner thickness="6px" speed="0.65s" emptyColor="gray.200" color="green.500" size="xl" />
      </Flex>
    );
  }

  return <Box mt="1vh">{events?.data?.items && <CalendarEvents events={events?.data?.items} />}</Box>;
}

export default HomePage;
