/* eslint-disable no-alert */
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { useGoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { preload } from 'swr';

import axios from '../../config/axios';
import { useAuth } from '../../hooks/use-auth';
import { EVENTS_URL_KEY, getResourceUrl } from '../../utils/helpers';

function LoginPage() {
  const navigate = useNavigate();
  const { token, handleLogin } = useAuth();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      handleLogin(tokenResponse.access_token);
      //   eslint-disable-next-line @typescript-eslint/no-floating-promises
      preload(EVENTS_URL_KEY, (resource: string) =>
        axios.get(getResourceUrl(resource), {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }),
      );
    },
    onError: (errorResponse) => {
      alert(errorResponse);
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
      <Box width="40%" mt="60" height="40%" borderRadius="10px" backgroundColor="gray.50" shadow="dark-lg">
        <Heading fontFamily="monospace" color="blue.800" fontSize="60" textAlign="center" pt="10vh">
          Calendar Events
        </Heading>
        <Heading fontFamily="monospace" color="blue.800" fontSize="30" textAlign="center">
          Log in
        </Heading>
        <Flex pt="5vh" justifyContent="center">
          <Button justifyContent="center" colorScheme="twitter" onClick={() => login()}>
            Sign in with Google 🚀
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}

export default LoginPage;
