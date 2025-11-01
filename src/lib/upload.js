

const upload = async (file) => {
  if (!file) throw new Error("No file provided");

  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

  console.log("Cloud Name:", cloudName);
  console.log("Upload Preset:", uploadPreset);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset); // mandatory for unsigned uploads

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      return data.secure_url; // Cloudinary URL
    } else {
      console.error("Cloudinary upload error:", data);
      throw new Error(data.error?.message || "Upload failed");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Upload failed");
  }
};

export default upload;
