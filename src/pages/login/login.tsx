/* eslint-disable no-alert */
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/use-auth';
import { UserType } from '../../types/user-types';

function LoginPage() {
  const navigate = useNavigate();
  const { user, handleLogin, setUserProfile } = useAuth();

  const googleLogin = useGoogleLogin({
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSuccess: async (tokenResponse) => {
      handleLogin(tokenResponse.access_token);
      try {
        const userInfo = await axios.get<UserType>('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        setUserProfile(userInfo.data);
      } catch (error) {
        const err = error as Error;
        alert(`Couldn't fetch the User Profile Data. Error: ${err.message}`);
      }
    },
    onError: (errorResponse) => {
      alert(errorResponse);
      // eslint-disable-next-line no-console
      console.log(errorResponse);
    },
    scope: 'profile email https://www.googleapis.com/auth/calendar',
  });

  if (user?.accessToken) {
    navigate('/');
  }

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
          <Button justifyContent="center" colorScheme="twitter" onClick={() => googleLogin()}>
            Sign in with Google 🚀
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}

export default LoginPage;
