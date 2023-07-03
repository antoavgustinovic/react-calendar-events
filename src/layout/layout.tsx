import { Avatar, Box, Flex, Heading, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { useAuth } from '../hooks/use-auth';

export default function Layout({ children }: { children: ReactNode }) {
  const { handleLogout } = useAuth();

  return (
    <Box>
      <Flex justifyContent="space-between" backgroundColor="gray.700" p="16px 36px">
        <Heading size="lg" color="white" fontFamily="monospace">
          CALENDAR EVENTS
        </Heading>
        <Menu>
          <MenuButton>
            <Avatar />
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
