import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Box } from "@chakra-ui/react";

const Homepage = lazy(() => import("./Pages/Homepage"));
const Chatpage = lazy(() => import("./Pages/Chatpage"));

function App() {
  return (
    <div className="App">
      <Suspense
        fallback={
          <Box
            width={"100vw"}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            margin={"50px"}
            height={"100vh"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <div className="dots"></div>
          </Box>
        }
      >
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/chats" element={<Chatpage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
