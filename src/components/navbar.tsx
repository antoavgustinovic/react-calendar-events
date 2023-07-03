import { Button, HStack } from '@chakra-ui/react';

import DisplayTimeRange from '../enums/events';

const styleOnFocus = { fontWeight: 'bold', color: 'green.600' };

interface NavbarProps {
  onDisplayTimeRange: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onNewEventOpen: () => void;
}

function Navbar({ onDisplayTimeRange, onNewEventOpen }: NavbarProps) {
  return (
    <HStack justifyContent="center" spacing="2vh" mb="20px">
      <Button variant="link" onClick={onDisplayTimeRange} name={DisplayTimeRange.NEXT_24H} _focus={styleOnFocus}>
        Next 24 Hours
      </Button>
      <Button variant="link" onClick={onDisplayTimeRange} name={DisplayTimeRange.NEXT_7_DAYS} _focus={styleOnFocus}>
        Next 7 days
      </Button>
      <Button variant="link" onClick={onDisplayTimeRange} name={DisplayTimeRange.NEXT_30_DAYS} _focus={styleOnFocus}>
        Next 30 days
      </Button>
      <Button colorScheme="blue" position="absolute" right="30px" mt="18px" onClick={onNewEventOpen}>
        New Event
      </Button>
    </HStack>
  );
}

export default Navbar;
