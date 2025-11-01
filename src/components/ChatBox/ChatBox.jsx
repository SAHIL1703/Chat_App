// import React, { useContext, useEffect, useState } from "react";
// import "./ChatBox.css";
// import assets from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";
// import {
//   arrayUnion,
//   doc,
//   getDoc,
//   onSnapshot,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "../../congif/firebase";
// import { toast } from "react-toastify";
// import upload from "../../lib/upload";
// const ChatBox = () => {
//   const { userData, messagesId, chatUser, message, setMessage } =
//     useContext(AppContext);
//   const [input, setinput] = useState("");

//   useEffect(() => {
//     if (messagesId) {
//       const unSub = onSnapshot(doc(db, "messages", messagesId), async (res) => {
//         if (res) {
//           setMessage(await res.data().messages.reverse());
//           console.log(res.data().messages.reverse());
//         }
//       });
//       return () => {
//         unSub();
//       };
//     }
//     console.log(messagesId);
//   }, [messagesId]);

//   const sendMessage = async () => {
//     try {
//       if (input && messagesId) {
//         await updateDoc(doc(db, "messages", messagesId), {
//           messages: arrayUnion({
//             sId: userData.id,
//             text: input,
//             createdAt: new Date(),
//           }),
//         });

//         const userIDs = [chatUser.rId, userData.id];
//         console.log("userIDs : ", userIDs);

//         userIDs.forEach(async (id) => {
//           const userChatsRef = doc(db, "chats", id);
//           const userChatsSnapshot = await getDoc(userChatsRef);

//           if (userChatsSnapshot.exists()) {
//             const userChatData = userChatsSnapshot.data();
//             const chatIndex = userChatData.chatData.findIndex(
//               (c) => c.messageId === messagesId
//             );
//             console.log("chatIndex : ", chatIndex);
//             userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30);
//             console.log(userChatData.chatData[chatIndex].lastMessage);
//             userChatData.chatData[chatIndex].updatedAt = Date.now();

//             if (userChatData.chatData[chatIndex].rId === userData.id) {
//               userChatData.chatData[chatIndex].messageSeen = false;
//             }
//             await updateDoc(userChatsRef, {
//               chatData: userChatData.chatData,
//             });
//           }
//         });
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//     setinput("");
//   };

//   const convertTimeStamp = (timestamp) => {
//     let date = new Date(timestamp);
//     const hour = date.getHours();
//     const minute = date.getMinutes();

//     if (hour > 12) {
//       return hour - 12 + ":" + minute + " PM";
//     } else {
//       return hour + ":" + minute + " PM";
//     }
//   };

//   const sendImage = async (e) => {
//     try {
//       const fileUrl = await upload(e.target.files[0]);

//       if (fileUrl && messagesId) {
//         await updateDoc(doc(db, "messages", messagesId), {
//           message: arrayUnion({
//             sId: userData.id,
//             image: fileUrl,
//             createdAt: new Date(),
//           }),
//         });

//         const userIDs = [chatUser.rId, userData.id];
//         console.log("userIDs : ", userIDs);

//         userIDs.forEach(async (id) => {
//           const userChatsRef = doc(db, "chats", id);
//           const userChatsSnapshot = await getDoc(userChatsRef);

//           if (userChatsSnapshot.exists()) {
//             const userChatData = userChatsSnapshot.data();
//             const chatIndex = userChatData.chatData.findIndex(
//               (c) => c.messageId === messagesId
//             );
//             console.log("chatIndex : ", chatIndex);
//             userChatData.chatData[chatIndex].lastMessage = "image";
//             console.log(userChatData.chatData[chatIndex].lastMessage);
//             userChatData.chatData[chatIndex].updatedAt = Date.now();

//             if (userChatData.chatData[chatIndex].rId === userData.id) {
//               userChatData.chatData[chatIndex].messageSeen = false;
//             }
//             await updateDoc(userChatsRef, {
//               chatData: userChatData.chatData,
//             });
//           }
//         });
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   console.log("Message : ",message)

//   return chatUser ? (
//     <div className="chat-box">
//       <div className="chat-user">
//         <img src={chatUser.userData.avatar} alt="" />
//         <p>
//           {chatUser.userData.username}{" "}
//           <img className="dot" src={assets.green_dot} alt="" />
//         </p>
//         <img src={assets.help_icon} className="help" alt="" />
//       </div>

//       <div className="chat-msg">
//         {message.map((msg, index) => (
//           <div
//             key={index}
//             className={msg.sId === userData.id ? "s-msg" : "r-msg"}
//           >
//             {msg.image ? (
//               <img className="msg-img" src={msg.image} alt="Sent image" />
//             ) : (
//               <p className="msg">{msg.text}</p>
//             )}

//             <div>
//               <img
//                 src={
//                   msg.sId === userData.id
//                     ? userData.avatar
//                     : chatUser.userData.avatar
//                 }
//                 alt=""
//               />
//               <p>{convertTimeStamp(msg.createdAt)}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="chat-input">
//         <input
//           onChange={(e) => {
//             setinput(e.target.value);
//             console.log(input);
//           }}
//           value={input}
//           type="text"
//           placeholder="Send a message"
//         />
//         <input
//           onChange={sendImage}
//           type="file"
//           id="image"
//           accept="image/png, image/jpeg"
//           hidden
//         />
//         <label htmlFor="image">
//           <img src={assets.gallery_icon} alt="" />
//         </label>
//         <img onChange={sendMessage} src={assets.send_button} alt="" />
//       </div>
//     </div>
//   ) : (
//     <div className="chat-welcome">
//       <img src={assets.logo_icon} />
//       <p>Chat anytime , anywhere</p>
//     </div>
//   );
// };

// export default ChatBox;


import React, { useContext, useEffect, useState } from "react";
import "./ChatBox.css";
import assets from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
// import { db } from "../../config/firebase"; // ✅ corrected path (was "congif")
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { db } from "../../congif/firebase";

const ChatBox = () => {
  const { userData, messagesId, chatUser, message, setMessage , chatVisible , setChatVisible } =
    useContext(AppContext);
  const [input, setInput] = useState("");

  // 🔁 Listen for new messages in Firestore
  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        if (res.exists()) {
          const msgs = res.data().messages ? res.data().messages.reverse() : [];
          setMessage(msgs);
          console.log("Messages:", msgs);
        }
      });
      return () => unSub();
    }
  }, [messagesId, setMessage]);

  // 📨 Send text message
  const sendMessage = async () => {
    if (!input.trim() || !messagesId) return;

    try {
      await updateDoc(doc(db, "messages", messagesId), {
        messages: arrayUnion({
          sId: userData.id,
          text: input,
          createdAt: Date.now(), // ✅ correct timestamp
        }),
      });

      const userIDs = [chatUser.rId, userData.id];

      for (const id of userIDs) {
        const userChatsRef = doc(db, "chats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatData = userChatsSnapshot.data();
          const chatIndex = userChatData.chatData.findIndex(
            (c) => c.messageId === messagesId
          );

          if (chatIndex !== -1) {
            userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatData[chatIndex].rId === userData.id) {
              userChatData.chatData[chatIndex].messageSeen = false;
            }

            await updateDoc(userChatsRef, {
              chatData: userChatData.chatData,
            });
          }
        }
      }

      setInput("");
    } catch (error) {
      toast.error("Error sending message: " + error.message);
    }
  };

  // 📸 Send image message
  const sendImage = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const fileUrl = await upload(file);
      if (!fileUrl || !messagesId) return;

      await updateDoc(doc(db, "messages", messagesId), {
        messages: arrayUnion({
          sId: userData.id,
          image: fileUrl,
          createdAt: Date.now(),
        }),
      });

      const userIDs = [chatUser.rId, userData.id];

      for (const id of userIDs) {
        const userChatsRef = doc(db, "chats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatData = userChatsSnapshot.data();
          const chatIndex = userChatData.chatData.findIndex(
            (c) => c.messageId === messagesId
          );

          if (chatIndex !== -1) {
            userChatData.chatData[chatIndex].lastMessage = "📷 Image";
            userChatData.chatData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatData[chatIndex].rId === userData.id) {
              userChatData.chatData[chatIndex].messageSeen = false;
            }

            await updateDoc(userChatsRef, {
              chatData: userChatData.chatData,
            });
          }
        }
      }

      toast.success("Image sent successfully!");
    } catch (error) {
      toast.error("Error sending image: " + error.message);
    }
  };

  // 🕒 Convert timestamp to readable time
  const convertTimeStamp = (timestamp) => {
    const date = new Date(timestamp);
    let hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, "0");
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  console.log("Messages:", message);
  console.log("Chat Visible : " , chatVisible)

  return chatUser ? (
    <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
      {/* Chat Header */}
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="User Avatar" />
        <p>
          {chatUser.userData.username}{" "}
          <img className="dot" src={assets.green_dot} alt="Online" />
        </p>
        <img src={assets.help_icon} className="help" alt="Help" />
        <img src={assets.arrow_icon} className="arrow" onClick={()=>setChatVisible(false)}/>
      </div>

      {/* Messages Display */}
      <div className="chat-msg">
        {message.map((msg, index) => (
          <div
            key={index}
            className={msg.sId === userData.id ? "s-msg" : "r-msg"}
          >
            {msg.image ? (
              <img className="msg-img" src={msg.image} alt="Sent" />
            ) : (
              <p className="msg">{msg.text}</p>
            )}
            <div className="msg-info">
              <img
                src={
                  msg.sId === userData.id
                    ? userData.avatar
                    : chatUser.userData.avatar
                }
                alt="Avatar"
              />
              <p>{convertTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Send a message"
        />

        {/* Hidden image upload input */}
        <input
          onChange={sendImage}
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
        />

        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="Upload" />
        </label>

        {/* Fixed send message click handler */}
        <img onClick={sendMessage} src={assets.send_button} alt="Send" />
      </div>
    </div>
  ) : (
    <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
      <img src={assets.logo_icon} alt="Logo" />
      <p>Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatBox;
