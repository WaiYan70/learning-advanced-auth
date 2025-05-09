import React from "react";
import { assets } from "../assets/assets.js";

const Header = () => {
  return (
    <div>
      <img
        src={assets.header_img}
        alt=""
        className="w-36 h-36 rounded-full mb-6"
      />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Learning, Practising and Testing Authentication
        <img src={assets.hand_wave} alt="" className="w-8 aspect-square" />
      </h1>
    </div>
  );
};

export default Header;
