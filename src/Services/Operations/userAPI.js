import { apiConnector } from "../apiconnector";
import { authEndpoints, chatEndpoints } from "../apis";
const { ALLUSERS_API } = authEndpoints;
const { ACCESSCHAT_API } = chatEndpoints;

export const handleUserSearch = async (
  search,
  setLoading,
  user,
  setSearchResult,
  toast
) => {
  if (!search) {
    toast({
      title: "Please Enter something in search",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
    return;
  }

  try {
    setLoading(true);

    const { data } = await apiConnector(
      "get",
      ALLUSERS_API+`?search=${search}`,
      null,
      {
        Authorization: `Bearer ${user.token}`,
      }
    );

    setLoading(false);
    setSearchResult(data);
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: "Failed to Load the Search Results",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};

export const accessChatApi = async (
  userId,
  setLoadingChat,
  user,
  chats,
  setChats,
  setSelectedChat,
  onClose,
  toast
) => {
  console.log(userId);

  try {
    setLoadingChat(true);

    const { data } = await apiConnector(
      "post",
      ACCESSCHAT_API,
      { userId },
      {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      }
    );

    if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
    setSelectedChat(data);
    setLoadingChat(false);
    onClose();
  } catch (error) {
    toast({
      title: "Error fetching the chat",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};
