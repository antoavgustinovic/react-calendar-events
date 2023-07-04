import {
  FormControl as ChakraFormControl,
  FormControlProps as ChakraFormControlProps,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react';
import { FieldError } from 'react-hook-form';

export interface FormControlProps extends ChakraFormControlProps {
  error?: FieldError;
  htmlFor?: string;
}

const FormControl = ({ children, isInvalid, error, htmlFor, label, ...formControlProps }: FormControlProps) => (
  <ChakraFormControl isInvalid={isInvalid} {...formControlProps}>
    <FormLabel htmlFor={htmlFor}>{label}</FormLabel>
    {children}
    <FormErrorMessage mb={5}>{error && error.message}</FormErrorMessage>
  </ChakraFormControl>
);

export default FormControl;
