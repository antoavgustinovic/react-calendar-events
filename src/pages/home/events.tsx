import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { calendar_v3 } from 'googleapis';
import { useState } from 'react';

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

function renderEvent({ id, summary, start, end }: calendar_v3.Schema$Event) {
  const eventStart = getDateTimeOrDate(start);
  const eventEnd = getDateTimeOrDate(end);

  return (
    <Box
      key={id}
      borderWidth="1px"
      borderRadius="md"
      p={4}
      m={1}
      bg="gray.100"
      _hover={{ bg: 'gray.200', cursor: 'pointer' }}
      transition="background-color 0.2s"
    >
      <Heading size="sm" textAlign="center">
        {summary}
      </Heading>
      <Box>
        <Text fontSize="md" textAlign="center" color="gray.500">
          {eventStart ? formatDate(new Date(eventStart)) : ''}{' '}
          {eventStart && eventEnd ? `${formatTime(new Date(eventStart))}-${formatTime(new Date(eventEnd))}` : ''}
        </Text>
      </Box>
    </Box>
  );
}

function CalendarEvents({ events }: { events: calendar_v3.Schema$Event[] }) {
  const [displayEvents, setDisplayEvents] = useState('7d');

  const handleDisplay = (event: React.MouseEvent<HTMLButtonElement>) => setDisplayEvents(event.currentTarget.name);

  return (
    <>
      <HStack justifyContent="center" spacing="2vh" mb="20px">
        <Button variant="link" onClick={handleDisplay} name={DisplayTime.NEXT_24H}>
          Next 24 Hours
        </Button>
        <Button variant="link" onClick={handleDisplay} name={DisplayTime.NEXT_7_DAYS}>
          Next 7 days
        </Button>
        <Button variant="link" onClick={handleDisplay} name={DisplayTime.NEXT_30_DAYS}>
          Next 30 days
        </Button>
      </HStack>
      <VStack spacing={4} align="stretch">
        {groupEvents(events, displayEvents).map(({ days, events }) => (
          <Box key={days}>
            <Heading fontFamily="monospace" color="green.600" size="lg" textAlign="center">
              {days}
            </Heading>
            {events.map(renderEvent)}
          </Box>
        ))}
      </VStack>
    </>
  );
}

export default CalendarEvents;
