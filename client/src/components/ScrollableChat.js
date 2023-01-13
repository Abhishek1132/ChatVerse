import { Avatar, Box, Tooltip, useColorMode } from "@chakra-ui/react";
import { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatContext } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const {
    user: { user },
  } = useContext(ChatContext);

  const { colorMode } = useColorMode();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          return (
            <div style={{ display: "flex", alignItems: "center" }} key={m._id}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.profilePic}
                    mt={isSameUser(messages, m, i, user._id) ? 1 : 5}
                  />
                </Tooltip>
              )}
              <Box
                display="flex"
                bg={
                  m.sender._id === user._id
                    ? colorMode === "light"
                      ? "green.200"
                      : "green.500"
                    : colorMode === "light"
                    ? "blackAlpha.200"
                    : "blackAlpha.500"
                }
                py="1.5"
                px={4}
                borderRadius="3xl"
                maxWidth="75%"
                ml={isSameSenderMargin(messages, m, i, user._id)}
                mt={isSameUser(messages, m, i, user._id) ? 1 : 5}
                mr={1}
              >
                {m.content}
              </Box>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
