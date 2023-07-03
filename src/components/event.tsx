import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, Heading, IconButton, Spinner, Text, useToast } from '@chakra-ui/react';
import { calendar_v3 } from 'googleapis/build/src/apis/calendar/v3';

import { useDeleteEvents } from '../hooks/use-events';
import { getDateRangeAndTimeRange } from '../utils/helpers';

function Event({ event }: { event: calendar_v3.Schema$Event }) {
  const toast = useToast();
  const { trigger: deleteUser, isMutating } = useDeleteEvents();
  const { id, start, end, summary } = event;

  if (isMutating) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const handleDelete = (id: string) => {
    deleteUser(id, {
      onSuccess: () => toast({ status: 'success', title: 'Event deleted' }),
      onError: () => toast({ status: 'error', title: 'There was an error while trying to delete your event' }),
    });
  };

  return (
    <Flex
      key={id}
      borderWidth="1px"
      borderRadius="md"
      p={3}
      m={1}
      bg="gray.100"
      _hover={{ bg: 'gray.200', cursor: 'pointer' }}
      transition="background-color 0.2s"
      align="center"
    >
      <Box flex={1}>
        <Heading size="sm" textAlign="center">
          {summary}
        </Heading>
        <Text fontSize="md" textAlign="center" color="gray.500">
          {getDateRangeAndTimeRange(start, end)}
        </Text>
      </Box>
      <Box>
        <IconButton
          aria-label="Delete"
          colorScheme="red"
          size="sm"
          icon={<DeleteIcon />}
          onClick={() => id && handleDelete(id)}
        />
      </Box>
    </Flex>
  );
}

export default Event;
