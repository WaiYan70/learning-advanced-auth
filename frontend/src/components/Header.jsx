import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { AppContext } from "../context/AppContext.jsx";

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className="h-screen flex justify-center items-center">
      <div>
        <img
          src={assets.header_img}
          alt=""
          className="w-36 h-36 rounded-full mb-6"
        />
        <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
          Learning, Practising and Testing Authentication
        </h1>
        <p> Hey {userData ? userData.name : "Developer"}</p>
        <img src={assets.hand_wave} alt="" className="w-8 aspect-square" />
      </div>
    </div>
  );
};

export default Header;
