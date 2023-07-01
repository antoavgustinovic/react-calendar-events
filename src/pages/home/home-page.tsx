import { Alert, AlertIcon, Box, Button, Heading, Spinner, Text, VStack } from '@chakra-ui/react';
import { AxiosError, AxiosResponse } from 'axios';
import { calendar_v3 } from 'googleapis';
import useSWR from 'swr';

import { useAuth } from '../../hooks/use-auth';
import { EVENTS_URL_KEY } from '../../utils/helpers';

function HomePage() {
  const { handleLogout } = useAuth();
  const { data: events, error } = useSWR<AxiosResponse<calendar_v3.Schema$Events>, AxiosError>(EVENTS_URL_KEY);

  const renderContent = () => {
    if (error) {
      return (
        <Alert status="error">
          <AlertIcon />
          There was an error while retrieving your events. Please refresh the page or try again later.
        </Alert>
      );
    }

    if (!events) {
      return <Spinner />;
    }

    return (
      <VStack spacing={4} align="stretch">
        {events?.data?.items?.map((event) => (
          <Box
            key={event.id}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            bg="gray.100"
            _hover={{ bg: 'gray.200', cursor: 'pointer' }}
            transition="background-color 0.2s"
          >
            <Heading size="md">{event.summary}</Heading>
            <Text fontSize="sm" color="gray.500">
              {event?.start && event?.end && `${String(event.start.date)} - ${String(event.end.date)}`}
            </Text>
          </Box>
        ))}
      </VStack>
    );
  };

  return (
    <Box>
      <Button type="button" onClick={() => handleLogout()} colorScheme="red">
        Sign out
      </Button>
      <Heading as="h1" size="xl" />
      {renderContent()}
    </Box>
  );
}

export default HomePage;
