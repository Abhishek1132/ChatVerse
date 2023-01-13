import {
  Box,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
  Icon,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Login from "../components/authorization/Login";
import Signup from "../components/authorization/Signup";

const colors = ["blue", "red"];

const Homepage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { colorMode, toggleColorMode } = useColorMode();

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <>
      {!JSON.parse(localStorage.getItem("userInfo")) ? (
        <>
          <Icon
            as={colorMode === "light" ? MoonIcon : SunIcon}
            position="absolute"
            right="3"
            padding="1.5"
            borderRadius="50%"
            top="3"
            size="lg"
            w={9}
            h={9}
            transition="all .3s ease-in-out"
            _hover={{
              cursor: "pointer",
              color: colorMode === "light" ? "white" : "black",
              bg: colorMode === "light" ? "blackAlpha.800" : "whiteAlpha.900",
            }}
            onClick={toggleColorMode}
          />
          <Container maxW="xl" centerContent>
            <Box
              d="flex"
              justifyContent="center"
              alignItems="center"
              p={3}
              w="100%"
              m="20px 0 15px 0"
            >
              <Heading
                fontSize="5xl"
                color={
                  colorMode === "dark" ? "whiteApha.900" : "blackAlpha.900"
                }
                fontFamily="Work Sans"
                textAlign="center"
                textShadow={
                  "1px 2px 2px " + (colorMode === "light" ? "gray" : "black")
                }
              >
                ChatVerse
              </Heading>
            </Box>
            <Box
              bg={colorMode === "dark" ? "blackAlpha.600" : "white"}
              w="100%"
              p={4}
              borderWidth="thin"
              borderRadius="lg"
              fontFamily="Work Sans"
              boxShadow="xl"
            >
              <Tabs
                isFitted
                variant="line"
                onChange={(index) => setTabIndex(index)}
                colorScheme={colors[tabIndex]}
              >
                <TabList mb=".5rem">
                  <Tab borderRadius="6px 6px 0 0" transition="all .2s ease">
                    Login
                  </Tab>
                  <Tab borderRadius="6px 6px 0 0" transition="all .2s ease">
                    Sign Up
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Login />
                  </TabPanel>
                  <TabPanel>
                    <Signup />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Container>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default Homepage;
