import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Stack,
  Text,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { useCallback, useContext, useEffect } from "react";
import apiUrl from "../config/urlconfig";
import { getSender } from "../config/ChatLogics";
import { showError } from "../config/errors";
import { ChatContext } from "../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = () => {
  const toast = useToast();
  const { colorMode } = useColorMode();

  const {
    user: { user, token },
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    fetchAgain,
    handleLogout,
  } = useContext(ChatContext);

  const fetchChats = useCallback(async () => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(apiUrl + "/chats", config);
      console.log("🚀 ~ file: MyChats.js:41 ~ fetchChats ~ data", data);
      setChats(data.chats);
    } catch (error) {
      console.log("🚀 ~ file: MyChats.js:44 ~ fetchChats ~ error", error);
      showError(toast, error);
      if (error instanceof AxiosError && error.code === "ERR_BAD_REQUEST") {
        if (error.response.status === 401) {
          handleLogout();
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg={colorMode === "light" ? "whiteAlpha.800" : "blackAlpha.400"}
      w={{ base: "100%", md: "38%", lg: "31%" }}
      borderRadius="lg"
      borderWidth="thin"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "xl" }}
        fontFamily="Work Sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "xs" }}
            rightIcon={<AddIcon />}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          chats.length === 0 ? (
            <Text fontFamily="Work Sans">
              No chats yet! search users to start chatting.
            </Text>
          ) : (
            <Stack overflowY="scroll" pr={1}>
              {chats.map((chat) => {
                return (
                  <Box
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    bg={
                      colorMode === "light"
                        ? selectedChat && selectedChat._id === chat._id
                          ? "green.100"
                          : "blackAlpha.200"
                        : selectedChat && selectedChat._id === chat._id
                        ? "green.400"
                        : "whiteAlpha.300"
                    }
                    px={3}
                    py={2}
                    cursor="pointer"
                    borderRadius="lg"
                  >
                    <Text>
                      <b>
                        {!chat.isGroupChat
                          ? getSender(user, chat.users)
                          : chat.chatName}
                      </b>
                    </Text>
                    {chat.latestMessage && (
                      <Text
                        fontSize="xs"
                        textOverflow="ellipsis"
                        overflow="hidden"
                        w="100%"
                        whiteSpace="nowrap"
                      >
                        <i style={{ color: "green" }}>
                          {chat.latestMessage.sender.name}:{" "}
                        </i>

                        {chat.latestMessage.content}
                      </Text>
                    )}
                  </Box>
                );
              })}
            </Stack>
          )
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
