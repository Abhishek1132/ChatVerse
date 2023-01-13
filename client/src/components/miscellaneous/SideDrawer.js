import {
  Box,
  Button,
  Text,
  Icon,
  Tooltip,
  useColorMode,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerHeader,
  DrawerContent,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useCallback, useContext, useState } from "react";

import { MoonIcon, Search2Icon, SunIcon, BellIcon } from "@chakra-ui/icons";
import { ChatContext } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import apiUrl from "../../config/urlconfig";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userItems/UserListItem";
import { showError } from "../../config/errors";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    user: { user, token },
    setSelectedChat,
    chats,
    setChats,
    handleLogout,
    notification,
    setNotification,
  } = useContext(ChatContext);

  const handleSearch = useCallback(async () => {
    if (!search) {
      toast({
        title: "Please Enter Something to Search!",
        duration: 3000,
        position: "top-left",
        status: "warning",
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(apiUrl + "/users?search=" + search, config);
      console.log(
        "🚀 ~ file: SideDrawer.js:74 ~ handleSearch ~ res.data.users",
        res.data.users
      );
      setLoading(false);
      setSearchResults(res.data.users);
    } catch (error) {
      console.log("🚀 ~ file: SideDrawer.js:78 ~ handleSearch ~ error", error);
      showError(toast, error);
      setLoading(false);
    }
  }, [search]);

  const accessChats = useCallback(
    async (userId) => {
      try {
        setLoadingChat(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        };

        const res = await axios.post(apiUrl + "/chats", { userId }, config);
        console.log("🚀 ~ file: SideDrawer.js:104 ~ res.data", res.data);

        let present = null;
        chats.forEach((c) => {
          if (c._id === res.data.chat._id) {
            present = c;
          }
        });

        if (!present) {
          setChats([res.data.chat, ...chats]);
          setSelectedChat(res.data.chat);
        } else {
          setSelectedChat(present);
        }

        setLoadingChat(false);
        onClose();
      } catch (error) {
        console.log("🚀 ~ file: SideDrawer.js:123 ~ error", error);
        showError(toast, error);
        setLoadingChat(false);
      }
    },
    [chats]
  );

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg={colorMode === "light" ? "whiteAlpha.800" : "blackAlpha.400"}
        w="100%"
        p="5px 10px"
        borderWidth="thin"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <Search2Icon fontSize="2xl" pr="2" />
            <Text display={{ base: "none", sm: "flex" }}>Search People</Text>
          </Button>
        </Tooltip>

        <Heading
          fontSize="2xl"
          fontFamily="sans-serif"
          display={{ base: "none", sm: "block" }}
        >
          ChatVerse
        </Heading>

        <div>
          <Tooltip label="Change Theme" hasArrow placement="bottom-end">
            <Icon
              as={colorMode === "light" ? MoonIcon : SunIcon}
              padding="1.5"
              borderRadius="50%"
              fontSize="3xl"
              transition="all .2s ease-in-out"
              _hover={{
                cursor: "pointer",
                color: colorMode === "light" ? "white" : "black",
                bg: colorMode === "light" ? "blackAlpha.800" : "whiteAlpha.900",
              }}
              onClick={toggleColorMode}
            />
          </Tooltip>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                style={{ zIndex: 2 }}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList px={2}>
              {notification.length === 0
                ? "No New Messages!"
                : notification.map((noti) => {
                    return (
                      <MenuItem
                        key={noti._id}
                        onClick={() => {
                          setSelectedChat(noti.chat);
                          setNotification(
                            notification.filter(
                              (n) => n.chat._id !== noti.chat._id
                            )
                          );
                        }}
                      >
                        {noti.chat.isGroupChat ? (
                          <span>
                            New Message in{" "}
                            <b>
                              <i>{noti.chat.chatName}</i>
                            </b>
                          </span>
                        ) : (
                          <span>
                            New Message from{" "}
                            <b>
                              <i>{getSender(user, noti.chat.users)}</i>
                            </b>
                          </span>
                        )}
                      </MenuItem>
                    );
                  })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.profilePic}
                borderColor="primary"
                borderWidth="thin"
              />
            </MenuButton>
            <MenuList p={0}>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <hr />
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={1}>Search People</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                mr={2}
                placeholder="Search by email or name"
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            <Box>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResults?.map((ruser) => {
                  return (
                    <UserListItem
                      key={ruser._id}
                      user={ruser}
                      handleFunction={() => accessChats(ruser._id)}
                    />
                  );
                })
              )}
            </Box>
            {loadingChat && <Spinner ml={"auto"} display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
