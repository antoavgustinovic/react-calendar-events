import { addDays, addMonths, endOfWeek, format, startOfWeek } from 'date-fns';
import { calendar_v3 } from 'googleapis/build/src/apis/calendar/v3';

import DisplayTimeRange from '../enums/events';
import { getDateTimeOrDate } from './date-helper';

function filterEvents(events: calendar_v3.Schema$Event[], displayEvents: string) {
  const currDateTime = new Date();
  let endDateTime = new Date();

  if (displayEvents === DisplayTimeRange.NEXT_7_DAYS) {
    endDateTime = addDays(endDateTime, 7);
  } else if (displayEvents === DisplayTimeRange.NEXT_30_DAYS) {
    endDateTime = addMonths(endDateTime, 1);
  } else {
    endDateTime = addDays(endDateTime, 1);
  }

  return events.filter(({ start, end }) => {
    const eventStart = getDateTimeOrDate(start);
    const eventEnd = getDateTimeOrDate(end);

    if (eventStart && eventEnd) {
      const eventStartDate = new Date(eventStart);
      const eventEndDate = new Date(eventEnd);
      return eventStartDate >= currDateTime && eventEndDate <= endDateTime;
    }

    return false;
  });
}

export function groupEvents(events: calendar_v3.Schema$Event[], displayEvents: string) {
  const filteredEvents = filterEvents(events, displayEvents);
  const groups: { [daysWeeks: string]: calendar_v3.Schema$Event[] } = {};

  filteredEvents.forEach((event) => {
    const { start } = event;
    const eventStart = getDateTimeOrDate(start);

    if (eventStart) {
      const eventStartDate = new Date(eventStart);
      const daysWeeks =
        displayEvents === DisplayTimeRange.NEXT_7_DAYS || displayEvents === DisplayTimeRange.NEXT_24H
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

export function getSortedEventsByStartDate(events: calendar_v3.Schema$Event[]) {
  const sortedEvents = [...events].sort((a, b) => {
    const aStartDate = a?.start?.dateTime ?? a?.start?.date ?? '';
    const bStartDate = b?.start?.dateTime ?? b?.start?.date ?? '';

    return new Date(aStartDate).getTime() - new Date(bStartDate).getTime();
  });

  return sortedEvents;
}
