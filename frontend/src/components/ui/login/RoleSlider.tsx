"use client"
import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { Roles } from "@/src/types/types";


interface RoleSliderProps{
  selectedRole: Roles;
  setSelectedRole:  React.Dispatch<React.SetStateAction<Roles>>;
}

const roles: Roles[]=["Viewer", "Operations", "Admin"];

const RoleSlider = ({selectedRole, setSelectedRole}: RoleSliderProps) => {

  return (
    <div 
    style={{
      fontFamily: "Inter"
    }}>
      <span className="text-[14px] text-[#4A5B81] font-bold">
        Access Role
      </span>
    <div className="flex items-center justify-center rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] cursor-pointer">
      {roles.map((role, idx)=>(
        <span 
        onClick={()=>{
          setSelectedRole(role)
        }}
        key={idx} 
        className="relative p-7">
          {
            selectedRole === role && (
              <motion.span 
              layoutId="selected" 
              className="absolute inset-0 bg-white z-5 rounded-lg border-2 border-[#E2E8F0] shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] m-px" />
            )
          }
          <span className="relative z-10 flex flex-col items-center justify-center gap-1">
            <Image src={`/icons/${role.toLowerCase()}.svg`} alt={`${role} `} width={15} height={15} />
            <span className={` ${selectedRole===role ? "text-black" : "text-[#64748B]"} text-[12px]/[15px] font-semibold `}> {role} </span>
          </span>
        </span>
      ))}
    </div>
    </div>
  )
}

export default RoleSlider
