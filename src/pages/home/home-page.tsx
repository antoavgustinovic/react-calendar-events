import { Alert, AlertIcon, Box, Flex, Spinner } from '@chakra-ui/react';

import EventGroupList from '../../components/event-group-list';
import { useEvents } from '../../hooks/use-events';

function HomePage() {
  const { data: events, error, isLoading } = useEvents();

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

  return <Box mt="1vh">{events?.items && <EventGroupList events={events?.items} />}</Box>;
}

export default HomePage;
