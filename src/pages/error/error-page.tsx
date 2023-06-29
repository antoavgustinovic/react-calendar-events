import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (isRouteErrorResponse(error)) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
        >
          Oops!
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Sorry, an unexpected error has occurred.
        </Text>
        <Text color="gray.500" mb={6}>
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
          {error.statusText || error.data.message}
        </Text>

        <Button
          colorScheme="teal"
          bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          color="white"
          variant="solid"
          onClick={() => navigate('/')}
        >
          Go to Home
        </Button>
      </Box>
    );
  }
}

export default ErrorPage;
