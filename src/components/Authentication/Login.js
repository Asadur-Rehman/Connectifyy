import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { login } from "../../Services/Operations/authAPI";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formdata;
  console.log("formdata", formdata);
  
  const navigate = useNavigate();
    const { setUser } = ChatState();


  
  const handleClick = () => setShow(!show);

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGuestCredentials = () => {
    setFormData({
      ...formdata,
      email: "guest@example.com",
      password: "123456",
    });
  };

  const submitHandler = async() => {
    login(email, password, setLoading, setUser, navigate, toast); // Use the login function
  };

  return (
    <VStack spacing="10px">
      <FormControl id="Login email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          name="email"
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={handleOnChange}
        />
      </FormControl>
      <FormControl id="Login password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            name="password"
            value={password}
            onChange={handleOnChange}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={handleGuestCredentials}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
