import React from "react";
import { assets } from "../assets/assets";

const ResetPassword = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
    </div>
  );
};

export default ResetPassword;
