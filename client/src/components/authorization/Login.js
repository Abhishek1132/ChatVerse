import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiUrl from "../../config/urlconfig";
import { showError } from "../../config/errors";

const showButtonHoverStyle = {
  opacity: 0.9,
  cursor: "pointer",
};

const Login = () => {
  const [showpass, setShowpass] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleShowpass = () => setShowpass(!showpass);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        apiUrl + "/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("🚀 ~ file: Login.js:54 ~ handleSubmit ~ res.data", res.data);
      setLoading(false);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      navigate("/chats");
      toast({
        title: `Log In Successful!`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log("🚀 ~ file: Login.js:66 ~ handleSubmit ~ error", error);
      setLoading(false);
      showError(toast, error);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        apiUrl + "/auth/login",
        {
          email: "guest@gmail.com",
          password: "guest@123",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      navigate("/chats");
      toast({
        title: `Guest Login Successful!`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log("🚀 ~ file: Login.js:98 ~ handleGuestLogin ~ error", error);
      setLoading(false);
      showError(toast, error);
    }
  };

  return (
    <form>
      <VStack gap=".3rem">
        <FormControl isRequired>
          <FormLabel>Email Address</FormLabel>
          <InputGroup>
            <Input
              type="email"
              placeholder="Enter Email Address"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="true"
              value={email}
              isRequired
            />
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={showpass ? "text" : "password"}
              placeholder="Enter Password"
              autoComplete="true"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <InputRightElement width="3rem" px="4px">
              <Icon
                as={showpass ? ViewIcon : ViewOffIcon}
                h="1.75rem"
                size="sm"
                onClick={handleShowpass}
                _hover={showButtonHoverStyle}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormHelperText textAlign="left">
            <Text color="red.300">* Required</Text>
          </FormHelperText>
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 20 }}
          onClick={handleSubmit}
          isLoading={loading}
        >
          Log In
        </Button>
        <Button
          // colorScheme="green"
          width="100%"
          onClick={handleGuestLogin}
          isLoading={loading}
        >
          Login as Guest
        </Button>
      </VStack>
    </form>
  );
};

export default Login;
