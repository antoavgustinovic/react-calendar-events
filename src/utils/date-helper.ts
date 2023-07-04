import { format, isSameDay } from 'date-fns';
import { calendar_v3 } from 'googleapis/build/src/apis/calendar/v3';

function formatDate(date: string) {
  return format(new Date(date), 'd.M.yyyy');
}

function formatTime(date: string) {
  return format(new Date(date), 'HH:mm');
}

export function getDateRangeAndTimeRange(
  start?: calendar_v3.Schema$EventDateTime,
  end?: calendar_v3.Schema$EventDateTime,
): string {
  const formatDateAndTime = (datetime: string): string => `${formatDate(datetime)} ${formatTime(datetime)}`;

  if (start?.date && end?.date) {
    return `${formatDate(start.date)}-${formatDate(end.date)}`;
  }

  if (start?.dateTime && end?.dateTime) {
    const startDateAndTime = formatDateAndTime(start.dateTime);
    const endDateAndTime = formatDateAndTime(end.dateTime);

    if (!isSameDay(new Date(start.dateTime), new Date(end.dateTime))) {
      return `${startDateAndTime} - ${endDateAndTime}`;
    }

    return `${startDateAndTime}-${formatTime(end.dateTime)}`;
  }

  return '';
}

export function getDateTimeOrDate(value: calendar_v3.Schema$EventDateTime | undefined): string | null {
  return value?.dateTime || value?.date || null;
}
