import React from "react";
import Modal from "react-modal";
import ReactDOM from "react-dom";
import { useTheme } from "../../Context/ThemeContext";
import Switch from "react-switch";

const CustomStyles = {
  content: {
    width: "250px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Settings = (props) => {
  const { modalIsOpen, closeModal } = props;
  const { themeMode, toggleTheme } = useTheme();

  console.log(themeMode, toggleTheme);
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={CustomStyles}
      contentLabel="Example Modal"
    >
      <b>Settings</b>
      <br></br>
      <br></br>
      <div
        style={{
          display: "flex",
          textDecoration: "underline",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "10px",
        }}
      >
        Dark theme
        <div>
          <Switch
            height={20}
            width={50}
            onChange={toggleTheme}
            checked={themeMode === "dark"}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          textDecoration: "underline",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "10px",
        }}
      >
        Language
        <div>
          {/* <Switch
            height={20}
            width={50}
            onChange={toggleTheme}
            checked={themeMode === "dark"}
          /> */}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          textDecoration: "underline",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "10px",
        }}
      >
        Speech recognition
        <div>
          {/* <Switch
            height={20}
            width={50}
            onChange={toggleTheme}
            checked={themeMode === "dark"}
          /> */}
        </div>
      </div>
    </Modal>
  );
};

export default Settings;
