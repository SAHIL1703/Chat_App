import React, { useEffect, useState } from "react";
import "./LeftSideBar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { logout } from "../../congif/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../congif/firebase";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
const LeftSideBar = () => {
  const navigate = useNavigate();
  const {
    userData,
    chatData,
    setChatUser,
    setMessagesId,
    messageId,
    chatVisible,
    setChatVisible,
    chatUser,
  } = useContext(AppContext);
  const [users, setUsers] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const handleLogoOut = async () => {
    logout();
  };

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        //Make a user reference
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        console.log(querySnap.docs);

        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExists = false;
          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExists = true;
            }
          });
          if (!userExists) {
            setUsers(querySnap.docs[0].data());
          }
        } else {
          setUsers(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addChat = async () => {
    const messageRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messageRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatsRef, users.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: users.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      const unSub = await getDoc(doc(db, "users", users.id));
      const uData = unSub.data();
      setChat({
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: users.id,
        updatedAt: Date.now(),
        messageSeen: true,
        userData: uData,
      });
      setShowSearch(false);
      setChatVisible(true);
    } catch (err) {
      console.log(err);
      toast.error(err.messsage);
    }
  };

  useEffect(() => {
    const updateChatUserData = async () => {
      if (chatUser) {
        const userRef = doc(db, "users", chatUser.userData.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        setChatUser((prev) => ({
          ...prev,
          userData: userData,
        }));
      }
    };

    updateChatUserData();
  }, [chatData]);

  const setChat = async (item) => {
    try {
      setMessagesId(item.messageId);
      setChatUser(item);

      const userChatsRef = doc(db, "chats", userData.id);
      const userChatsSnapshot = await getDoc(userChatsRef);
      const userChatsData = userChatsSnapshot.data();
      const chatIndex = userChatsData.chatData.findIndex(
        (chat) => chat.messageId === item.messageId
      );
      userChatsData.chatData[chatIndex].messageSeen = true;

      await updateDoc(userChatsRef, {
        chatData: userChatsData.chatData,
      });
      setChatVisible(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  console.log("User Data : ", userData);
  console.log("Chat Data :", chatData[0]?.lastMessage);
  console.log("Chat Visible : ", chatVisible);

  return (
    <div className={`ls ${chatVisible ? "hidden" : ""}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p onClick={handleLogoOut}>Logout</p>
            </div>
          </div>
        </div>

        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search Here...."
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && users ? (
          <div onClick={addChat} className="friends add-user">
            <img src={users.avatar} alt="" />
            <div className="list-info">
              <p>{users.username}</p>
              <span>{users.bio}</span>
            </div>
          </div>
        ) : (
          chatData.map((ele, index) => (
            <div
              onClick={() => {
                setChat(ele);
              }}
              key={index}
              className={`friends  ${
                ele.messageSeen || ele.messageId === messageId ? "" : "border"
              }`}
            >
              <img src={ele.userData.avatar} alt="" />
              <div className="list-info">
                <p>{ele.userData.username}</p>
                <span>{ele.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
