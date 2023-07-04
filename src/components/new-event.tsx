import { Button, HStack, Input, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import ModalType from '../enums/modal';
import { useAddEvent } from '../hooks/use-events';
import { buildEventDTO } from '../service/events-service';
import { NewEventFormData } from '../types/event-types';
import FormControl from '../ui/form-control';
import Modal from '../ui/modal';
import { getSortedEventsByStartDate } from '../utils/date-helper';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function NewEventModal({ isOpen, onClose }: Props) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<NewEventFormData>();
  const { trigger: addEvent } = useAddEvent();
  const toast = useToast();

  console.log(errors);

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
          <FormControl htmlFor="title" label="Title" isInvalid={!!errors.title} error={errors.title}>
            <Input
              id="title"
              placeholder="title"
              mb={3}
              {...register('title', {
                required: 'This field is required',
              })}
            />
          </FormControl>
          <FormControl htmlFor="startDate" label="startDate" isInvalid={!!errors.startDate} error={errors.startDate}>
            <Input
              id="startDate"
              type="datetime-local"
              mb={3}
              {...register('startDate', {
                required: 'This field is required',
              })}
            />
          </FormControl>
          <FormControl htmlFor="endDate" label="endDate" isInvalid={!!errors.endDate} error={errors.endDate}>
            <Input
              id="endDate"
              type="datetime-local"
              mb={3}
              {...register('endDate', {
                required: 'This field is required',
              })}
            />
          </FormControl>
          <HStack my={4} justifyContent="flex-end">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="teal" type="submit" isDisabled={!isValid}>
              Submit
            </Button>
          </HStack>
        </form>
      }
    />
  );
}

export default NewEventModal;
