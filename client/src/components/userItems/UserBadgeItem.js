import { CloseIcon } from "@chakra-ui/icons";
import { Box, useColorMode } from "@chakra-ui/react";

const UserBadgeItem = ({ user, isAdmin, handleFunction }) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      fontSize={12}
      cursor="pointer"
      borderWidth="thin"
      bg={
        isAdmin
          ? "yellow.300"
          : colorMode === "light"
          ? "purple.100"
          : "purple.400"
      }
      onClick={handleFunction}
      color={isAdmin && "black"}
    >
      {user.name}
      <CloseIcon pl="1" />
    </Box>
  );
};

export default UserBadgeItem;
