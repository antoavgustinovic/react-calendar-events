import { Box, Button, Spinner } from '@chakra-ui/react';

import { useAuth } from '../../hooks/use-auth';

function HomePage() {
  const { user, handleLogout } = useAuth();

  return (
    <Box>
      {user?.name ? <h1>Welcome {user?.name}! </h1> : <Spinner />}
      <p>
        <Button type="button" onClick={() => handleLogout()} colorScheme="red">
          Sign out
        </Button>
      </p>
      <h1>I am Home Page</h1>
    </Box>
  );
}

export default HomePage;
