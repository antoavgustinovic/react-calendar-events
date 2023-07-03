import { endOfWeek, format, startOfWeek } from 'date-fns';
import { calendar_v3 } from 'googleapis/build/src/apis/calendar/v3';

import DisplayTimeRange from '../enums/events';

function formatDate(date: Date) {
  return format(date, 'd.M.yyyy');
}

function formatTime(date: Date) {
  return format(date, 'HH:mm');
}

function isEndDateNextDay(startDate: Date, endDate: Date): boolean {
  const startDay = startDate.getDate();
  const startMonth = startDate.getMonth();
  const startYear = startDate.getFullYear();

  const endDay = endDate.getDate();
  const endMonth = endDate.getMonth();
  const endYear = endDate.getFullYear();

  // Compare date parts (day, month, and year)
  if (startDay !== endDay || startMonth !== endMonth || startYear !== endYear) {
    return true;
  }

  // Compare time parts (hour and minute)
  const startHour = startDate.getHours();
  const startMinute = startDate.getMinutes();
  const endHour = endDate.getHours();
  const endMinute = endDate.getMinutes();

  return endHour < startHour || (endHour === startHour && endMinute < startMinute);
}

export function getDateRangeAndTimeRange(
  start?: calendar_v3.Schema$EventDateTime,
  end?: calendar_v3.Schema$EventDateTime,
): string {
  const formatDateAndTime = (datetime: string): string => {
    const date = new Date(datetime);
    return `${formatDate(date)} ${formatTime(date)}`;
  };

  if (start?.date && end?.date) {
    return `${formatDate(new Date(start.date))}-${formatDate(new Date(end.date))}`;
  }

  if (start?.dateTime && end?.dateTime) {
    const startDateAndTime = formatDateAndTime(start.dateTime);
    const endDateAndTime = formatDateAndTime(end.dateTime);

    if (isEndDateNextDay(new Date(start.dateTime), new Date(end.dateTime))) {
      return `${startDateAndTime} - ${endDateAndTime}`;
    }

    return `${startDateAndTime}-${formatTime(new Date(end.dateTime))}`;
  }

  return '';
}

function getDateTimeOrDate(value: calendar_v3.Schema$EventDateTime | undefined): string | null {
  return value?.dateTime || value?.date || null;
}

function filterEvents(events: calendar_v3.Schema$Event[], displayEvents: string) {
  const currTime = new Date();
  const endTime = new Date();

  if (displayEvents === DisplayTimeRange.NEXT_7_DAYS) {
    endTime.setDate(currTime.getDate() + 7);
  } else if (displayEvents === DisplayTimeRange.NEXT_30_DAYS) {
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
