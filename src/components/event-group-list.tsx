import { Box, Heading, useDisclosure, VStack } from '@chakra-ui/react';
import { calendar_v3 } from 'googleapis/build/src/apis/calendar/v3';
import { useState } from 'react';

import DisplayTimeRange from '../enums/events';
import { groupEvents } from '../utils/date-helper';
import EventList from './event-list';
import Navbar from './navbar';
import NewEventModal from './new-event';

function EventGroupList({ events }: { events: calendar_v3.Schema$Event[] }) {
  const [displayEvents, setDisplayEvents] = useState<string>(DisplayTimeRange.NEXT_7_DAYS);
  const { isOpen: isNewEventOpen, onOpen: onNewEventOpen, onClose: onNewEventClose } = useDisclosure();

  const handleDisplayTimeRange = (event: React.MouseEvent<HTMLButtonElement>) =>
    setDisplayEvents(event.currentTarget.name);

  const groupedEvents = groupEvents(events, displayEvents);

  return (
    <>
      <Navbar onDisplayTimeRange={handleDisplayTimeRange} onNewEventOpen={onNewEventOpen} />
      <VStack spacing={4} align="stretch">
        {groupedEvents.map(({ days, events }) => (
          <Box key={days} mx={1}>
            <Heading fontFamily="monospace" color="green.600" size="lg" textAlign="center">
              {days}
            </Heading>
            <EventList events={events} />
          </Box>
        ))}
      </VStack>
      <NewEventModal isOpen={isNewEventOpen} onClose={onNewEventClose} />
    </>
  );
}

export default EventGroupList;
