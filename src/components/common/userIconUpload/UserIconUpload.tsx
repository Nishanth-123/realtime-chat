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
        onIconChange(reader.result as string);
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
