import { Button, FormControl, FormLabel, HStack, Input, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import ModalType from '../enums/modal';
import { useAddEvent } from '../hooks/use-events';
import Modal from '../ui/modal';

interface FormData {
  title: string;
  startDate: string;
  endDate: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function NewEventModal({ isOpen, onClose }: Props) {
  const { handleSubmit, register, reset } = useForm<FormData>();
  const { trigger: addEvent } = useAddEvent();
  const toast = useToast();

  const onSubmit = handleSubmit((values) => {
    const timeZone = 'Europe/Zagreb';
    const requestBody = {
      start: {
        dateTime: `${values.startDate}:00`,
        timeZone,
      },
      end: {
        dateTime: `${values.endDate}:00`,
        timeZone,
      },
      summary: values.title,
    };

    addEvent(requestBody, {
      onSuccess: () => toast({ status: 'success', title: 'Event created successfully' }),
      onError: () => toast({ status: 'error', title: 'There was an error while trying to create your event' }),
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
