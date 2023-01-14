import { Avatar, Box, Text, Tooltip, useColorMode } from "@chakra-ui/react";
import { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import ProfileModal from "./miscellaneous/ProfileModal";
import {
  getTimeMS,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  isUpperUserSame,
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
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
              }}
              key={m._id}
            >
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <ProfileModal user={m.sender}>
                  <Tooltip
                    label={m.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mr={"-3.5"}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.profilePic}
                      userSelect="none"
                      mt={isUpperUserSame(messages, m, i) ? 2 : 6}
                    />
                  </Tooltip>
                </ProfileModal>
              )}
              <Box
                // display="flex"
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
                borderRadius="xl"
                maxWidth="75%"
                ml={isSameSenderMargin(messages, m, i, user._id)}
                mt={isUpperUserSame(messages, m, i) ? 1 : 5}
                mr={1}
              >
                <ProfileModal user={m.sender}>
                  <Text
                    fontWeight="bold"
                    fontFamily="Work Sans"
                    ml={"0.5"}
                    mb={1}
                    cursor="pointer"
                    userSelect="none"
                  >
                    {m.sender._id === user._id ? "You" : m.sender.name}
                  </Text>
                </ProfileModal>
                <Text fontFamily="Work Sans">{m.content}</Text>
                <Box
                  display="flex"
                  mt={2}
                  justifyContent="space-between"
                  flexDirection={
                    isSameUser(m, user._id) ? "row-reverse" : "row"
                  }
                  userSelect="none"
                  opacity={0.7}
                >
                  <Text fontSize="2xs" mx={1}>
                    {m.createdAt.split("T")[0]}
                  </Text>
                  <Text fontSize="2xs" mx={1}>
                    {getTimeMS(m.createdAt)}
                  </Text>
                </Box>
              </Box>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
