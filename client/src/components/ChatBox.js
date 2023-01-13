import { Box, useColorMode } from "@chakra-ui/react";
import { useContext } from "react";
import { ChatContext } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = () => {
  const { colorMode } = useColorMode();
  const { selectedChat } = useContext(ChatContext);

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      bg={colorMode === "light" ? "whiteAlpha.800" : "blackAlpha.400"}
      w={{ base: "100%", md: "61%", lg: "68%" }}
      alignItems="center"
      flexDirection="column"
      p={3}
      borderRadius="lg"
      borderWidth="thin"
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox;
