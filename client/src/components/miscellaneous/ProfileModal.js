import {
  Avatar,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          bg="none"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-person-fill"
              viewBox="0 0 16 16"
            >
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            </svg>
          }
          onClick={onOpen}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent width={{ base: "95%" }}>
          <ModalHeader
            fontSize="xx-large"
            fontFamily="Work Sans"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            {/* <Image
              borderRadius="full"
              boxSize="150px"
              src={user.profilePic}
              alt={user.name}
              borderWidth="thin"
              borderStyle="solid"
              borderColor="primary"
            /> */}
            <Avatar
              size="2xl"
              cursor="pointer"
              name={user.name}
              src={user.profilePic}
              borderColor="primary"
              borderWidth="thin"
            />
            <Text
              fontSize="large"
              my="3"
              textAlign="center"
              fontFamily="Work Sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
