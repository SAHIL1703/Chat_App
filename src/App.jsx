import React, { useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat";
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";
import NotFound from "./NotFound";
import { ToastContainer, } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./congif/firebase";
import { AppContext } from "./context/AppContext";
const App = () => {
  const navigate = useNavigate();
  const { loadUserData } = useContext(AppContext);

  // useEffect(() => {
  //   onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       navigate("/chat");
  //       await loadUserData(user.uid);
  //     } else {
  //       navigate("/");
  //     }
  //   });
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserData(user.uid);
        // Only redirect to /chat if we are on the login page
        if (window.location.pathname === "/") {
          navigate("/chat");
        }
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
