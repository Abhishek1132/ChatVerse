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
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";

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
    notification,
    setNotification,
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
                let noNoti = 0;
                notification.forEach((noti) => {
                  if (noti.chat._id === chat._id) {
                    noNoti = noNoti + 1;
                  }
                });
                return (
                  <Box
                    key={chat._id}
                    onClick={() => {
                      setSelectedChat(chat);
                      setNotification(
                        notification.filter((noti) => {
                          return noti.chat._id !== chat._id;
                        })
                      );
                    }}
                    bg={
                      colorMode === "light"
                        ? selectedChat && selectedChat._id === chat._id
                          ? "cyan.200"
                          : "blackAlpha.200"
                        : selectedChat && selectedChat._id === chat._id
                        ? "cyan.600"
                        : "whiteAlpha.300"
                    }
                    px={3}
                    py={2}
                    cursor="pointer"
                    borderRadius="lg"
                    fontFamily="Work Sans"
                  >
                    <Text display="flex" justifyContent="space-between">
                      <b>
                        {!chat.isGroupChat
                          ? getSender(user, chat.users)
                          : chat.chatName}
                      </b>
                      {noNoti > 0 && (
                        // <span
                        //   style={{
                        //     minWidth: "25px",
                        //     padding: "2px",
                        //     height: "25px",
                        //     borderRadius: "50%",
                        //     background: "red",
                        //     color: "white",
                        //     display: "flex",
                        //     justifyContent: "center",
                        //     alignItems: "center",
                        //     fontWeight: "bold",
                        //     fontFamily: "sans-serif",
                        //   }}
                        // >
                        //   {noNoti}
                        // </span>
                        <span
                          style={{
                            position: "absolute",
                            zIndex: "3",
                            fontFamily: "sans-serif",
                            marginLeft: "-4px",
                          }}
                        >
                          <NotificationBadge count={noNoti} />
                        </span>
                      )}
                    </Text>

                    {chat.latestMessage && (
                      <Text
                        fontSize="xs"
                        textOverflow="ellipsis"
                        overflow="hidden"
                        w="100%"
                        whiteSpace="nowrap"
                        opacity={0.7}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          {chat.latestMessage.sender._id === user._id
                            ? "You"
                            : chat.latestMessage.sender.name.split(" ")[0]}
                          :{" "}
                        </span>

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
