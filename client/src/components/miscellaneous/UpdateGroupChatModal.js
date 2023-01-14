import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import apiUrl from "../../config/urlconfig";
import { showError } from "../../config/errors";
import { ChatContext } from "../../Context/ChatProvider";
import UserBadgeItem from "../userItems/UserBadgeItem";
import UserListItem from "../userItems/UserListItem";

const UpdateGroupChatModal = () => {
  const {
    user: { user, token },
    selectedChat,
    setSelectedChat,
    fetchAgain,
    setFetchAgain,
  } = useContext(ChatContext);

  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleRemove = async (ruser) => {
    if (
      selectedChat.groupAdmin._id !== user.userid &&
      user.userid !== ruser._id
    ) {
      return toast({
        title: "Only group admins can remove someone",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.patch(
        apiUrl + "/chats/groupremove",
        {
          chatId: selectedChat._id,
          userId: ruser._id,
        },
        config
      );

      ruser._id === user.userid
        ? setSelectedChat(null)
        : setSelectedChat(data.chat);
      setLoading(false);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(
        "🚀 ~ file: UpdateGroupChatModal.js:78 ~ handleRemove ~ error",
        error
      );
      showError(toast, error);
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
      return toast({
        title: "Group name cannot be empty!",
        duration: 3000,
        status: "warning",
      });
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.patch(
        apiUrl + "/chats/grouprename",
        {
          chatId: selectedChat._id,
          name: groupChatName,
        },
        config
      );
      setRenameLoading(false);
      setSelectedChat(data.chat);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(
        "🚀 ~ file: UpdateGroupChatModal.js:113 ~ handleRename ~ error",
        error
      );
      showError(toast, error);
      setRenameLoading(false);
    }
  };

  const handleSearch = useCallback(async (query) => {
    if (!query) {
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
        apiUrl + "/users?search=" + query,
        config
      );
      console.log(
        "🚀 ~ file: UpdateGroupChatModal.js:135 ~ handleSearch ~ data",
        data
      );
      setLoading(false);
      setSearchResult(data.users);
    } catch (error) {
      console.log(
        "🚀 ~ file: UpdateGroupChatModal.js:139 ~ handleSearch ~ error",
        error
      );
      setLoading(false);
      showError(toast, error);
    }
  }, []);

  const handleAddUser = async (ruser) => {
    if (selectedChat.users.find((u) => u._id === ruser._id)) {
      return toast({
        title: "User Already in Group",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }

    if (selectedChat.groupAdmin._id !== user.userid) {
      return toast({
        title: "Only group admins can add someone!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.patch(
        apiUrl + "/chats/groupadd",
        {
          chatId: selectedChat._id,
          userId: ruser._id,
        },
        config
      );

      setLoading(false);
      setSelectedChat(data.chat);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(
        "🚀 ~ file: UpdateGroupChatModal.js:184 ~ handleAddUser ~ error",
        error
      );
      showError(toast, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setGroupChatName(selectedChat.chatName);
    setSearchResult([]);
  }, [selectedChat]);

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        bg="none"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-people-fill"
            viewBox="0 0 16 16"
          >
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
          </svg>
        }
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent width={{ base: "95%" }}>
          <ModalHeader
            fontSize="xx-large"
            fontFamily="Work Sans"
            display="flex"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => {
                return (
                  <UserBadgeItem
                    key={u._id}
                    isAdmin={u._id === selectedChat.groupAdmin._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                );
              })}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Rename
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner ml={"auto"} display="flex" />
            ) : (
              searchResult?.slice(0, 5).map((ruser) => {
                return (
                  <UserListItem
                    key={ruser._id}
                    user={ruser}
                    handleFunction={() => handleAddUser(ruser)}
                  />
                );
              })
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
