import { Avatar, Box, Flex, Heading, Menu, MenuButton, MenuItem, MenuList, Spinner } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { useAuth } from '../hooks/use-auth';

export default function Navbar({ children }: { children: ReactNode }) {
  const { handleLogout } = useAuth();

  const data = {
    fullName: 'Anto Avgustinovic',
  };

  return (
    <Box>
      <Flex justifyContent="space-between" backgroundColor="gray.700" p="16px 36px">
        <Heading size="lg" color="white" fontFamily="monospace">
          CALENDAR EVENTS
        </Heading>
        <Menu>
          <MenuButton>
            {data ? <Avatar name={data.fullName} /> : <Spinner color="white" height="48px" width="48px" />}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Box>{children}</Box>
    </Box>
  );
}
