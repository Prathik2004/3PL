"use client"
import { motion } from "motion/react";
import { useState } from "react";

const POD: string[]=["No", "Done"]

const PODReceived = () => {
  const [pod, setPod]=useState<string | null>("No");

  return (
    <div>
      <div className="flex items-center justify-center gap-2">
        <div className="w-10 h-5 bg-[#64748B] rounded-full relative z-5 flex items-center justify-start">
          {POD.map((pay, idx)=>(
            <div key={pay} onClick={()=> setPod(pay)} className="flex-1 flex items-center justify-center relative z-10 text-xs">
              {pay === pod && (
                <motion.span layoutId="slider" className="w-5 h-5 rounded-full bg-white absolute z-10" />
              )}
              <span className="text-[1px]"> {pay} </span>
            </div>
          ))}
        </div>
        <span className="text-[12px] text-[#64748B]">POD Received</span>
      </div>
    </div>
  )
}

export default PODReceived
