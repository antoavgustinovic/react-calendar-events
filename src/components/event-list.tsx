import { Box } from '@chakra-ui/react';
import { calendar_v3 } from 'googleapis/build/src/apis/calendar/v3';

import Event from './event';

function EventList({ events }: { events: calendar_v3.Schema$Event[] }) {
  return events.map((event) => (
    <Box key={event.id}>
      <Event event={event} />
    </Box>
  ));
}

export default EventList;
