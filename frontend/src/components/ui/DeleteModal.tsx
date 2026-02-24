"use client"
import Image from 'next/image'
import React, { useEffect } from 'react'
import BasicButton from './BasicButton'
import { ModalProps } from '@/src/types/types'
import { motion } from "motion/react"

const DeleteModal = ({onClose} : ModalProps) => {

    useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    // cleanup to avoid memory leaks
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);
  return (
    <div onClick={onClose} 

    className='fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50'>
    <motion.div onClick={(e) => e.stopPropagation()}
    style={{
        fontFamily: "Inter"
    }}
    initial={{
        opacity:0,
        filter: "blur(10px)",
        scale:1
      }} 
      animate={{
        opacity:1,
        filter: "blur(0px)",
        scale: [1.5, 1]
      }}
      exit={{
        opacity:0,
        scale:0,
        filter: "blur(10px)"
      }}
      transition={{
        type: "spring",
        duration:0.5,
        ease: "easeInOut"
      }}
    className='w-[30%] h-76 flex flex-col items-center justify-center bg-white border border-[#E2E8F0] rounded-xl gap-5 p-8 '>
        
        <div className='w-16 h-16 rounded-full flex items-center justify-center bg-[#EE2B2B1A]'>
            <Image src="icons/redDelete.svg" alt="Delete" width={30} height={30} className='text-red-500' />
        </div>
        <span className='text-black text-[24px]/[32px] font-bold'>
            Delete Shipment
        </span>
        <span className='text-[14px]/[20px] text-[#64748B] text-center'>
            Are you sure you want to delete this shipment? This action cannot be undone.
        </span>
        <div className='flex items-center justify-evenly gap-3'>
            <BasicButton onClick={onClose} text="Cancel" className='border border-[#E2E8F0] py-3 px-12 rounded-lg cursor-pointer active:scale-95 hover:bg-slate-200' />
            <BasicButton onClick={onClose} text="Delete" className='bg-red-500 hover:bg-red-400 active:scale-95 text-white py-3 px-12 rounded-lg cursor-pointer' />
        </div>
    </motion.div>
    </div>
  )
}

export default DeleteModal
