import React, { useContext, useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { auth, db } from "../../congif/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { AppContext } from "../../context/AppContext";
const ProfileUpdate = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const {setUserData}  = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      // If no previous image and no new image selected, show error
      if (!prevImage && !image) {
        toast.error("Upload Profile Image");
        return;
      }

      const docRef = doc(db, "users", uid); // Firestore document reference
      let imgUrl = prevImage || null; // Default to previous image or null

      // If a new image is selected, upload it to Cloudinary
      if (image) {
        toast.info("Uploading image...");
        imgUrl = await upload(image); // call your Cloudinary upload function
        setPrevImage(imgUrl); // update preview immediately
      }

      // Prepare data for Firestore update
      const updateData = {
        bio: bio || "",
        name: name || "",
      };

      if (imgUrl) {
        updateData.avatar = imgUrl; // Only include avatar if it exists
      }

      // Update Firestore document
      await updateDoc(docRef, updateData);

      toast.success("Profile updated successfully!");
      // setImage(null); // Clear selected image after update

      const snap = getDoc(docRef)
      setUserData((await snap).data())
      navigate('/chat')
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. Try again.");
    }
  };

  //Load the User Data
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        console.log("Data :", data);
        if (data.name) {
          setName(data.name);
        }
        if (data.bio) {
          setBio(data.bio);
        }
        if (data.avatar) {
          setPrevImage(data.avatar);
        }
      } else {
        navigate("/");
      }
    });
  }, []);

  const handleOnChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  console.log(bio)

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              onChange={handleOnChange}
              type="file"
              id="avatar"
              accept=".png, .jpeg, .jpg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
            />
            Upload Profile Image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your Name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write Profile Bio"
            required
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          className="profile-pic"
          src={image ? URL.createObjectURL(image) : assets.logo_icon}
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
