import React from "react";
import { NavLink } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { FaWpforms } from "react-icons/fa";
import { FaRegListAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { LuFileUser } from "react-icons/lu";
import { MdOutlineReviews } from "react-icons/md";
import { SiCssdesignawards } from "react-icons/si";
import { BiBarcodeReader } from "react-icons/bi";
import { LiaAwardSolid } from "react-icons/lia";
import { assets } from "../assets/assets";

const Sidebar = ({ isOpen }) => {
  return (

    <div >
      <div className={`app-sidebar sticky top-0 left-0 h-screen bg-gray-700 text-white p-5 transition-all duration-300 ${isOpen ? "w-64" : "w-20"} z-50 `}>

        <div className={`flex items-center ${isOpen ? "justify-between" : "justify-center"} mb-4`}>
          {!isOpen && <img src={assets.logoSm} alt="" className="w-8" />}
          {isOpen && <img src={assets.logo} alt="" className="w-auto px-5 py-3" />}
        </div>

        <div className="space-y-4 flex-grow ">

          <NavLink to="/dashboards" className={`flex items-center gap-3 text-md ${!isOpen ? "justify-center" : ""}`}>
            <IoMdHome className="text-xl" />
            {isOpen && "Dashboards"}
          </NavLink>

          <NavLink to="/add" className={`flex items-center gap-3 text-md ${!isOpen ? "justify-center" : ""}`}>
            <FaWpforms className="text-xl" />
            {isOpen && "Product Form"}
          </NavLink>

          <NavLink to="/list" className={`flex items-center gap-3 text-md ${!isOpen ? "justify-center" : ""}`}>
            <FaRegListAlt className="text-xl" />
            {isOpen && "Product List"}
          </NavLink>

          <NavLink to="/client" className={`flex items-center gap-3 text-md ${!isOpen ? "justify-center" : ""}`}>
            <LuFileUser className="text-xl" />
            {isOpen && "Client Form"}
          </NavLink>

          <NavLink to="/clientList" className={`flex items-center gap-3 text-md ${!isOpen ? "justify-center" : ""}`}>
            <MdOutlineReviews className="text-xl" />
            {isOpen && "Client List"}
          </NavLink>

          <NavLink to="/awards" className={`flex items-center gap-3 text-md ${!isOpen ? "justify-center" : ""}`}>
            <SiCssdesignawards className="text-xl" />
            {isOpen && "Awards Form"}
          </NavLink>

          <NavLink to="/awardsList" className={`flex items-center gap-3 text-md ${!isOpen ? "justify-center" : ""}`}>
            <LiaAwardSolid className="text-xl" />
            {isOpen && "Awards List"}
          </NavLink>

          <NavLink to="/order" className={`flex items-center gap-3 text-md ${!isOpen ? "justify-center" : ""}`}>
            <BiBarcodeReader className="text-xl" />
            {isOpen && "Order List"}
          </NavLink>

          <NavLink to="/logs" className={`flex items-center gap-3 text-md ${!isOpen ? "justify-center" : ""}`}>
            <IoMdSettings className="text-xl" />
            {isOpen && "Amin Logs"}
          </NavLink>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;
