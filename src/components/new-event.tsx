import { Button, FormControl, FormLabel, HStack, Input, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import ModalType from '../enums/modal';
import { useAddEvent } from '../hooks/use-events';
import { buildEventDTO } from '../service/events-service';
import { NewEventFormData } from '../types/event-types';
import Modal from '../ui/modal';
import { getSortedEventsByStartDate } from '../utils/date-helper';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function NewEventModal({ isOpen, onClose }: Props) {
  const { handleSubmit, register, reset } = useForm<NewEventFormData>();
  const { trigger: addEvent } = useAddEvent();
  const toast = useToast();

  const onSubmit = handleSubmit((values) => {
    const requestBody = buildEventDTO(values);

    addEvent(requestBody, {
      onSuccess: () => toast({ status: 'success', title: 'Event created successfully' }),
      onError: () => toast({ status: 'error', title: 'There was an error while trying to create your event' }),
      optimisticData: (currentEvents) => {
        const items = currentEvents?.items ? [...currentEvents.items, requestBody] : [requestBody];
        const sortedItems = getSortedEventsByStartDate(items);

        return { ...currentEvents, items: sortedItems };
      },
    });
    onClose();
    reset();
  });

  return (
    <Modal
      type={ModalType.FORM}
      isOpen={isOpen}
      onClose={onClose}
      modalHeader="Create a new Event"
      modalBody={
        <form onSubmit={onSubmit}>
          <FormControl>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input id="title" placeholder="title" mb={3} {...register('title')} />
            <FormLabel htmlFor="startDate">Event start date</FormLabel>
            <Input id="startDate" type="datetime-local" mb={3} {...register('startDate')} />
            <FormLabel htmlFor="endDate">Event end date</FormLabel>
            <Input id="endDate" type="datetime-local" mb={3} {...register('endDate')} />
          </FormControl>
          <HStack my={4} justifyContent="flex-end">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="teal" type="submit">
              Submit
            </Button>
          </HStack>
        </form>
      }
    />
  );
}

export default NewEventModal;
