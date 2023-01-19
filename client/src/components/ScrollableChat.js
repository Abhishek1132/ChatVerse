import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import ProfileModal from "./miscellaneous/ProfileModal";
import {
  getDateDMY,
  getTimeMS,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  isUpperUserSame,
} from "../config/ChatLogics";
import { ChatContext } from "../Context/ChatProvider";
import apiUrl from "../config/urlconfig";
import axios from "axios";
import { showError } from "../config/errors";

const ScrollableChat = ({ messages, setMessages }) => {
  const [messageHover, setMessageHover] = useState(null);
  const {
    user: { user, token },
    fetchAgain,
    setFetchAgain,
  } = useContext(ChatContext);

  const { colorMode } = useColorMode();
  const toast = useToast();

  const handleMessageMouseEnter = (m) => {
    setMessageHover(m);
  };

  const handleMessageMouseLeave = () => {
    setMessageHover(null);
  };

  const handleDeleteMessage = async (message) => {
    if (user._id !== message.sender._id) {
      return;
    }

    try {
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(
        apiUrl + "/messages/delete/" + message._id,
        config
      );
      console.log(
        "🚀 ~ file: ScrollableChat.js:55 ~ handleDeleteMessage ~ data",
        data
      );
      if (message._id === messages[messages.length - 1]._id) {
        setFetchAgain(!fetchAgain);
      }
      setMessages(messages.filter((msg) => msg._id !== data._id));
    } catch (error) {
      console.log(
        "🚀 ~ file: ScrollableChat.js:61 ~ handleDeleteMessage ~ error",
        error
      );
      showError(toast, error);
    }
  };

  const handleMessageCopy = (content) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Message Copied!",
      duration: 2000,
      status: "info",
    });
  };

  return (
    <ScrollableFeed style={{ overflowX: "hidden" }}>
      {messages &&
        messages.map((m, i) => {
          const mDate = new Date(m.createdAt);
          return (
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
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
                      mb={"-4"}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.profilePic}
                      borderWidth="thin"
                      userSelect="none"
                    />
                  </Tooltip>
                </ProfileModal>
              )}
              <Box
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
                onMouseEnter={() => handleMessageMouseEnter(m)}
                onMouseLeave={handleMessageMouseLeave}
              >
                <Menu>
                  <div
                    style={{
                      position: "relative",
                      height: 0,
                      width: 0,
                    }}
                  >
                    {messageHover != null && messageHover._id === m._id && (
                      <MenuButton position="absolute" top={1} right={0}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill={colorMode === "light" ? "black" : "white"}
                          className="bi bi-three-dots-vertical"
                          viewBox="0 0 16 16"
                        >
                          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                        </svg>
                      </MenuButton>
                    )}
                  </div>
                  <MenuList p={1}>
                    {isSameUser(m, user._id) && (
                      <MenuItem onClick={() => handleDeleteMessage(m)}>
                        Delete
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => handleMessageCopy(m.content)}>
                      Copy
                    </MenuItem>
                  </MenuList>
                </Menu>

                {!isUpperUserSame(messages, m, i) && (
                  <Text
                    fontWeight="bold"
                    fontFamily="Work Sans"
                    ml={"0.5"}
                    mb={1}
                    userSelect="none"
                  >
                    <ProfileModal user={m.sender}>
                      <span style={{ cursor: "pointer" }}>
                        {m.sender._id === user._id ? "You" : m.sender.name}
                      </span>
                    </ProfileModal>
                  </Text>
                )}

                <Text fontFamily="Work Sans" textAlign="justify">
                  {m.content}
                </Text>
                <Box
                  display="flex"
                  mt={2}
                  justifyContent="space-between"
                  flexDirection={
                    isSameUser(m, user._id) ? "row-reverse" : "row"
                  }
                  userSelect="none"
                  opacity={0.6}
                >
                  <Text fontSize="2xs" mx={1}>
                    {messageHover !== null &&
                      messageHover._id === m._id &&
                      getDateDMY(mDate)}
                  </Text>

                  <Text fontSize="2xs" mx={1}>
                    {getTimeMS(mDate)}
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
