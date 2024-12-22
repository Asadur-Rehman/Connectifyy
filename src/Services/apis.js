const BASE_URL = process.env.REACT_APP_BASE_URL;
console.log(BASE_URL);

// AUTH ENDPOINTS
export const authEndpoints = {
  SIGNUP_API: BASE_URL + "/api/user",
  ALLUSERS_API: BASE_URL + "/api/user",
  LOGIN_API: BASE_URL + "/api/user/login",
};

// CHAT ENDPOINTS
export const chatEndpoints = {
  ACCESSCHAT_API: BASE_URL + "/api/chat",
  FETCHCHATS_API: BASE_URL + "/api/chat",
  CREATEGROUP_API: BASE_URL + "/api/chat/group",
  RENAMEGROUP_API: BASE_URL + "/api/chat/rename",
  REMOVEFROMGROUP_API: BASE_URL + "/api/chat/groupremove",
  ADDTOGROUP_API: BASE_URL + "/api/chat/groupadd",
};

// message ENDPOINTS
export const messageEndpoints = {
  SENDMESSAGE_API: BASE_URL + "/api/message",
  ALLMESSAGE_API: BASE_URL + "/api/message",
};
