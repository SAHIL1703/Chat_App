import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../congif/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [messagesId , setMessagesId] = useState(null);
  const [message , setMessage] = useState([])
  const [chatUser , setChatUser] = useState(null)
  const [chatVisible , setChatVisible] = useState(false)

  // ✅ Load user data after login
  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        toast.error("User data not found!");
        return;
      }

      const user = userSnap.data();
      setUserData(user);
      console.log("User data loaded:", user);

      // Navigate based on profile completion
      if (user.avatar && user.name) {
        navigate("/chat");
      } else {
        navigate("/profile");
      }

      // Update last seen every 60 seconds
      await updateDoc(userRef, { lastSeen: Date.now() });
      const interval = setInterval(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await updateDoc(userRef, { lastSeen: Date.now() });
        }
      }, 60000);

      // Cleanup interval on logout/unmount
      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error(error.message);
    }
  };

  // ✅ Realtime chat listener
  useEffect(() => {
    if (!userData || !userData.id) return;

    console.log("Listening to chats for user:", userData.id);
    const chatRef = doc(db, "chats", userData.id);

    const unSub = onSnapshot(
      chatRef,
      async (res) => {
        try {
          if (!res.exists()) {
            console.log("No chat data found");
            setChatData([]);
            return;
          }

          const chatItem = res.data().chatData || [];
          const tempData = [];

          for (const item of chatItem) {
            const receiverId = item.rId || item.RId; // ✅ Handle both keys
            if (!receiverId) continue;

            const userRef = doc(db, "users", receiverId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const userInfo = userSnap.data();
              tempData.push({ ...item, userData: userInfo });
            }
          }

          // Sort chats by latest update
          tempData.sort(
            (a, b) =>
              (b.updatedAt?.toMillis?.() || b.updatedAt || 0) -
              (a.updatedAt?.toMillis?.() || a.updatedAt || 0)
          );

          setChatData(tempData);
          console.log("Updated chat data:", tempData);
        } catch (err) {
          console.error("Error fetching chat data:", err);
        }
      },
      (error) => {
        console.error("Snapshot listener error:", error);
        toast.error(error.message);
      }
    );

    return () => {
      console.log("Chat listener unsubscribed");
      unSub();
    };
  }, [userData]);

  // ✅ Context value
  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messagesId , setMessagesId,
    message , setMessage,
    chatUser , setChatUser,
    chatVisible , setChatVisible
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
