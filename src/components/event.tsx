import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, IconButton, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { calendar_v3 } from 'googleapis/build/src/apis/calendar/v3';

import { useDeleteEvents } from '../hooks/use-events';
import Modal from '../ui/modal';
import { getDateRangeAndTimeRange } from '../utils/date-helper';

function Event({ event }: { event: calendar_v3.Schema$Event }) {
  const toast = useToast();
  const { trigger: deleteEvent } = useDeleteEvents();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id, start, end, summary } = event;

  const handleDelete = (id: string) => {
    deleteEvent(id, {
      onSuccess: () => toast({ status: 'success', title: 'Event deleted' }),
      onError: () => toast({ status: 'error', title: 'There was an error while trying to delete your event' }),
      optimisticData: (currentEvents) => ({
        ...currentEvents,
        items: currentEvents?.items?.filter((event) => event.id !== id),
      }),
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
        <IconButton aria-label="Delete" colorScheme="red" size="sm" icon={<DeleteIcon />} onClick={() => onOpen()} />
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => id && handleDelete(id)}
        modalHeader="Are you sure?"
        modalBody={<Text as="em">Are you sure that you want to delete this event? </Text>}
        buttonCloseText="Cancel"
        buttonConfirmText="Confirm"
      />
    </Flex>
  );
}

export default Event;
