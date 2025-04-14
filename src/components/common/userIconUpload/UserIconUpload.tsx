import React, { memo, useCallback } from "react";
import "./UserIconUpload.css";

interface UserIconUploadProps {
  userIcon?: string;
  onIconChange: (icon: string | undefined) => void;
}

const UserIconUpload: React.FC<UserIconUploadProps> = ({
  userIcon,
  onIconChange,
}) => {
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        alert("File size too large. Please choose an image under 1MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        // Now upload the file to ImgBB
        const apiKey = "34ab7cbb4b8c4abbcd6bafb086eaf841"; // Public demo key

        const formData = new FormData();
        formData.append("image", file);

        fetch(
          `https://api.imgbb.com/1/upload?expiration=8640000&key=${apiKey}&name=${Math.random()
            .toString()
            .slice(-2)}${file.name.lastIndexOf(".")}`,
          {
            method: "POST",
            body: formData,
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              // Get the URL and do something with it
              const imageUrl = data.data.url;
              onIconChange(imageUrl);
            } else {
              console.error("Upload failed:", data.error);
              alert("Failed to upload image.");
            }
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            alert("Error uploading image. Please try again.");
          });
      };
      reader.readAsDataURL(file);
    },
    [onIconChange]
  );

  const removeIcon = useCallback(() => {
    onIconChange(undefined);
  }, [onIconChange]);

  return (
    <div className="user-icon-upload">
      <label htmlFor="icon-upload">User Icon (Optional):</label>
      <input
        type="file"
        id="icon-upload"
        accept="image/*"
        onChange={handleFileUpload}
      />
      {userIcon && (
        <div className="icon-preview">
          <img src={userIcon} alt="User icon" height="50" />
          <button className="remove-icon" onClick={removeIcon}>
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(UserIconUpload);
