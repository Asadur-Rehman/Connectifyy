import { apiConnector } from "../apiconnector";
import { authEndpoints } from "../apis";

const { LOGIN_API, SIGNUP_API } = authEndpoints;

export const login = async (
  email,
  password,
  setLoading,
  setUser,
  navigate,
  toast
) => {
  setLoading(true);
  if (!email || !password) {
    toast({
      title: "Please Fill all the Feilds",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
    return;
  }
  try {
    const { data } = await apiConnector(
      "post",
      LOGIN_API,
      { email, password },
      { "Content-type": "application/json" }
    );
    toast({
      title: "Login Successful",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
    setLoading(false);
    navigate("/chats");
  } catch (error) {
    toast({
      title: "Error Occurred!",
      description: error.response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
  }
};

export const registerUser = async (
  name,
  email,
  password,
  confirmpassword,
  toast,
  navigate
) => {
  // setPicLoading(true);
  if (!name || !email || !password || !confirmpassword) {
    toast({
      title: "Please Fill all the Fields",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    // setPicLoading(false);
    return;
  }
  if (password !== confirmpassword) {
    toast({
      title: "Passwords Do Not Match",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }
  try {
    const { data } = await apiConnector(
      "post",
      SIGNUP_API,
      {
        name,
        email,
        password,
      },
      {
        "Content-type": "application/json",
      }
    );
    console.log(data);
    toast({
      title: "Registration Successful",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    // setPicLoading(false);
    navigate("/chats");
  } catch (error) {
    toast({
      title: "Error Occurred!",
      description: error.response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    // setPicLoading(false);
  }
};
