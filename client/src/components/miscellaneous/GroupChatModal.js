import {
  Box,
  Button,
  FormControl,
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
import React, { useCallback, useContext, useState } from "react";
import apiUrl from "../../config/urlconfig";
import { showError } from "../../config/errors";
import { ChatContext } from "../../Context/ChatProvider";
import UserBadgeItem from "../userItems/UserBadgeItem";
import UserListItem from "../userItems/UserListItem";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user: { token },
    chats,
    setChats,
    setSelectedChat,
  } = useContext(ChatContext);

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
        "🚀 ~ file: GroupChatModal.js:55 ~ handleSearch ~ data",
        data
      );
      setLoading(false);
      setSearchResult(data.users);
    } catch (error) {
      console.log(
        "🚀 ~ file: GroupChatModal.js:59 ~ handleSearch ~ error",
        error
      );
      setLoading(false);
      showError(toast, error);
    }
  }, []);

  const handleAddUser = (ruser) => {
    if (selectedUsers.includes(ruser)) {
      return toast({
        title: "User already added!",
        duration: 3000,
        status: "warning",
        isClosable: true,
        position: "top",
      });
    }
    setSelectedUsers([...selectedUsers, ruser]);
  };

  const handleDelete = (ruser) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== ruser._id));
  };

  const handleSubmit = useCallback(async () => {
    if (!groupChatName || !selectedUsers) {
      return toast({
        title: "Provide Group Name and its' Users!",
        duration: 3000,
        status: "warning",
        isClosable: true,
        position: "top",
      });
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        apiUrl + "/chats/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      console.log(
        "🚀 ~ file: GroupChatModal.js:118 ~ handleSubmit ~ data.chat",
        data.chat
      );
      setChats([data.chat, ...chats]);
      setSelectedChat(data.chat);
      setGroupChatName("");
      setSelectedUsers([]);
      setSearchResult([]);
      onClose();
    } catch (error) {
      console.log(
        "🚀 ~ file: GroupChatModal.js:126 ~ handleSubmit ~ error",
        error
      );
      showError(toast, error);
    }
  }, [groupChatName, selectedUsers]);

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent width={{ base: "95%" }}>
          <ModalHeader display="flex" fontFamily="Work Sans" fontSize="2xl">
            Create Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Group Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Select Users"
                mb={2}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => {
                return (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                );
              })}
            </Box>
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
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
