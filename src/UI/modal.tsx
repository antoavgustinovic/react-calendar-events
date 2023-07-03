import {
  Button,
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';

import ModalType from '../enums/modal';

type Props = {
  modalHeader: string;
  modalBody: string | JSX.Element;
  buttonCloseText?: string;
  buttonConfirmText?: string;
  isOpen: boolean;
  type: ModalType;
  onClose: () => void;
  onConfirm?: () => void;
};

const Modal: React.FC<Props> = ({
  modalHeader,
  modalBody,
  buttonCloseText,
  buttonConfirmText,
  isOpen,
  type = ModalType.PROMPT,
  onClose,
  onConfirm,
}) => (
  <ChakraModal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" isCentered size="3xl">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{modalHeader}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>{modalBody}</ModalBody>
      {type === 'prompt' && (
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            {buttonCloseText}
          </Button>
          <Button variant="ghost" onClick={onConfirm}>
            {buttonConfirmText}
          </Button>
        </ModalFooter>
      )}
    </ModalContent>
  </ChakraModal>
);

export default Modal;
