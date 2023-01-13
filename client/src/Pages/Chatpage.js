import { Box } from "@chakra-ui/react";
import { useContext } from "react";

import ChatBox from "../components/ChatBox";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";

import { ChatContext } from "../Context/ChatProvider";

const Chatpage = () => {
  const { user } = useContext(ChatContext);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        p="1"
        h="91vh"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chatpage;
