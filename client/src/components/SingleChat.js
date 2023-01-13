import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import Lottie from "react-lottie";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import apiUrl, { ENDPOINT } from "../config/urlconfig";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { showError } from "../config/errors";
import { ChatContext } from "../Context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import typingAnimation from "../animations/typinganimation.json";
import typingAnimation2 from "../animations/typinganimation2.json";

let socket, selectedChatCompare;

const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [stopTypingTimeoutId, setStopTypingTimeoutId] = useState(null);

  const {
    user: { user, token },
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    fetchAgain,
    setFetchAgain,
  } = useContext(ChatContext);
  const toast = useToast();
  const { colorMode } = useColorMode();

  const lottieDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData: colorMode === "light" ? typingAnimation : typingAnimation2,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        apiUrl + "/messages/" + selectedChat._id,
        config
      );
      console.log("🚀 ~ file: SingleChat.js:49 ~ fetchMessages ~ data", data);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log("🚀 ~ file: SingleChat.js:49 ~ fetchMessages ~ error", error);
      showError(toast, error);
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          apiUrl + "/messages",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log("🚀 ~ file: SingleChat.js:51 ~ sendMessage ~ data", data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        console.log("🚀 ~ file: SingleChat.js:56 ~ sendMessage ~ error", error);
        showError(toast, error);
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", (room) => {
      if (selectedChatCompare._id !== room) {
        return;
      }
      setIsTyping(true);
    });
    socket.on("stop typing", (room) => {
      if (selectedChatCompare._id !== room) {
        return;
      }
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      // console.log(newMessageReceived);
      console.log("selectedChatCompare ", selectedChatCompare);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
        setFetchAgain(!fetchAgain);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) {
      return;
    }
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    clearTimeout(stopTypingTimeoutId);
    let lastTypingTime = new Date().getTime();
    const timerLength = 1500;
    const timeoutID = setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);

    setStopTypingTimeoutId(timeoutID);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "xl" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work Sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
            ></IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            bg={colorMode === "light" ? "blackAlpha.200" : "whiteAlpha.300"}
            p={2}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                overflowY="scroll"
                style={{
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping && (
                <div>
                  <Lottie
                    options={lottieDefaultOptions}
                    width={70}
                    style={{
                      marginBottom: 15,
                      marginLeft: 0,
                    }}
                  />
                </div>
              )}
              <Input
                bg="blackAlpha.100"
                placeholder="Type a message..."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work Sans">
            Select any user or chat to start chatting!
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
