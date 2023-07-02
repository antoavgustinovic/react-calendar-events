import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spinner,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { calendar_v3 } from 'googleapis';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

import axiosInstance from '../../config/axios';
import { EVENTS_URL_KEY, EVENTS_URL_WITH_QUERY_PARAMS_KEY } from '../../utils/helpers';

enum DisplayTime {
  NEXT_24H = '24h',
  NEXT_7_DAYS = '7d',
  NEXT_30_DAYS = '30d',
}

function getDateTimeOrDate(value: calendar_v3.Schema$EventDateTime | undefined): string | null {
  return value?.dateTime || value?.date || null;
}

function filterEvents(events: calendar_v3.Schema$Event[], displayEvents: string) {
  const currTime = new Date();
  const endTime = new Date();

  if (displayEvents === '7d') {
    endTime.setDate(currTime.getDate() + 7);
  } else if (displayEvents === '30d') {
    endTime.setDate(currTime.getDate() + 31);
  } else {
    endTime.setDate(currTime.getDate() + 1);
  }

  return events.filter(({ start, end }) => {
    const eventStart = getDateTimeOrDate(start);
    const eventEnd = getDateTimeOrDate(end);

    if (eventStart && eventEnd) {
      const eventStartDate = new Date(eventStart);
      const eventEndDate = new Date(eventEnd);
      return eventStartDate >= currTime && eventEndDate <= endTime;
    }

    return false;
  });
}

function formatDate(date: Date) {
  return format(date, 'd.M.yyyy');
}

function formatTime(date: Date) {
  return format(date, 'HH:mm');
}

function groupEvents(events: calendar_v3.Schema$Event[], displayEvents: string) {
  const filteredEvents = filterEvents(events, displayEvents);
  const groups: { [daysWeeks: string]: calendar_v3.Schema$Event[] } = {};

  filteredEvents.forEach((event) => {
    const { start } = event;
    const eventStart = getDateTimeOrDate(start);

    if (eventStart) {
      const eventStartDate = new Date(eventStart);
      const daysWeeks =
        displayEvents === '7d' || displayEvents === '24h'
          ? format(eventStartDate, 'EEEE')
          : `${format(startOfWeek(eventStartDate), 'd.M.yyyy')} - ${format(endOfWeek(eventStartDate), 'd.M.yyyy')}`;

      if (!groups[daysWeeks]) {
        groups[daysWeeks] = [];
      }
      groups[daysWeeks].push(event);
    }
  });

  return Object.entries(groups).map(([days, events]) => ({
    days,
    events,
  }));
}

const getDateRangeAndTimeRange = (start?: calendar_v3.Schema$EventDateTime, end?: calendar_v3.Schema$EventDateTime) => {
  if (start?.date && end?.date) {
    return `${formatDate(new Date(start.date))}-${formatDate(new Date(end.date))}`;
  }

  if (start?.dateTime && end?.dateTime) {
    return `${formatDate(new Date(start.dateTime))} ${formatTime(new Date(start.dateTime))}-${formatTime(
      new Date(end.dateTime),
    )}`;
  }

  return '';
};

const deleteUserApi = (url: string, { arg }: { arg: string }) => axiosInstance.delete(`${EVENTS_URL_KEY}${arg}`);

function Event({ event }: { event: calendar_v3.Schema$Event }) {
  const toast = useToast();
  const { trigger: deleteUser, isMutating } = useSWRMutation(EVENTS_URL_WITH_QUERY_PARAMS_KEY, deleteUserApi);
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

function EventList({ events }: { events: calendar_v3.Schema$Event[] }) {
  return events.map((event) => (
    <Box key={event.id}>
      <Event event={event} />
    </Box>
  ));
}

function CalendarEvents({ events }: { events: calendar_v3.Schema$Event[] }) {
  const [displayEvents, setDisplayEvents] = useState('7d');

  const handleDisplay = (event: React.MouseEvent<HTMLButtonElement>) => setDisplayEvents(event.currentTarget.name);

  const groupedEvents = groupEvents(events, displayEvents);

  return (
    <>
      <HStack justifyContent="center" spacing="2vh" mb="20px">
        <Button
          variant="link"
          onClick={handleDisplay}
          name={DisplayTime.NEXT_24H}
          _focus={{ fontWeight: 'bold', color: 'green.600' }}
        >
          Next 24 Hours
        </Button>
        <Button
          variant="link"
          onClick={handleDisplay}
          name={DisplayTime.NEXT_7_DAYS}
          _focus={{ fontWeight: 'bold', color: 'green.600' }}
        >
          Next 7 days
        </Button>
        <Button
          variant="link"
          onClick={handleDisplay}
          name={DisplayTime.NEXT_30_DAYS}
          _focus={{ fontWeight: 'bold', color: 'green.600' }}
        >
          Next 30 days
        </Button>
      </HStack>
      <VStack spacing={4} align="stretch">
        {groupedEvents.map(({ days, events }) => (
          <Box key={days}>
            <Heading fontFamily="monospace" color="green.600" size="lg" textAlign="center">
              {days}
            </Heading>
            <EventList events={events} />
          </Box>
        ))}
      </VStack>
    </>
  );
}

export default CalendarEvents;
