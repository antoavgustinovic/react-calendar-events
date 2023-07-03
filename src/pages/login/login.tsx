/* eslint-disable no-alert */
import { Alert, Box, Button, Flex, Heading } from '@chakra-ui/react';
import { useGoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/use-auth';
import { preloadEvents } from '../../hooks/use-events';

function LoginPage() {
  const navigate = useNavigate();
  const { token, handleLogin } = useAuth();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      handleLogin(tokenResponse.access_token);
      preloadEvents(tokenResponse.access_token);
    },
    onError: (errorResponse) => {
      <Alert>{errorResponse.error}</Alert>;
    },
    scope: 'profile email https://www.googleapis.com/auth/calendar',
  });

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [navigate, token]);

  return (
    <Flex h="100vh" justifyContent="center" backgroundColor="gray.100">
      <Box width="70vh" mt="60" height="35vh" borderRadius="10px" backgroundColor="gray.50" shadow="dark-lg">
        <Heading fontFamily="monospace" color="blue.800" fontSize="7vh" textAlign="center" pt="6vh">
          Calendar Events
        </Heading>
        <Heading fontFamily="monospace" color="blue.800" fontSize="30" textAlign="center">
          Log in
        </Heading>
        <Flex pt="7vh" justifyContent="center">
          <Button justifyContent="center" colorScheme="twitter" onClick={() => login()}>
            Sign in with Google 🚀
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}

export default LoginPage;
