import { apiConnector } from "../apiconnector";
import { chatEndpoints } from "../apis";
const { FETCHCHATS_API } = chatEndpoints;
export const fetchChatsData = async (user, setChats, toast) => {
  // console.log(user._id);
  try {
    console.log("user", user);
    const { data } = await apiConnector("get", FETCHCHATS_API, null, {
      Authorization: `Bearer ${user.token}`,
    });
    setChats(data);
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: "Failed to Load the chats",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};
