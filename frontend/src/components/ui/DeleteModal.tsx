"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import BasicButton from './BasicButton'
import { shipmentService } from '@/src/services/shipmentService'
import { motion } from "motion/react"

interface DeleteModalProps {
  shipmentId: string;
  onClose: () => void;
}

const DeleteModal = ({ shipmentId, onClose }: DeleteModalProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await shipmentService.cancelShipment(shipmentId);
      onClose();
      // Optional: show success message or refresh table
    } catch (err: any) {
      setError(err.message || "Failed to delete shipment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div onClick={onClose}

      className='fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50'>
      <motion.div onClick={(e) => e.stopPropagation()}
        style={{
          fontFamily: "Inter"
        }}
        initial={{
          opacity: 0,
          filter: "blur(10px)",
          scale: 1
        }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
          scale: [1.5, 1]
        }}
        exit={{
          opacity: 0,
          scale: 0,
          filter: "blur(10px)"
        }}
        transition={{
          type: "spring",
          duration: 0.5,
          ease: "easeInOut"
        }}
        className='w-[30%] h-76 flex flex-col items-center justify-center bg-white border border-[#E2E8F0] rounded-xl gap-5 p-8 '>

        <div className='w-16 h-16 rounded-full flex items-center justify-center bg-[#EE2B2B1A]'>
          <Image src="/icons/redDelete.svg" alt="Delete" width={30} height={30} className='text-red-500' />
        </div>
        <span className='text-black text-[24px]/[32px] font-bold'>
          Delete Shipment
        </span>
        <span className='text-[14px]/[20px] text-[#64748B] text-center'>
          Are you sure you want to cancel {shipmentId}? This action will mark it as Cancelled.
        </span>
        {error && <span className="text-[12px] text-red-500 text-center">{error}</span>}
        <div className='flex items-center justify-evenly gap-3'>
          <BasicButton onClick={onClose} text="Cancel" className='border border-[#E2E8F0] py-3 px-12 rounded-lg cursor-pointer active:scale-95 hover:bg-slate-200' />
          <BasicButton
            onClick={handleDelete}
            text={isDeleting ? "Deleting..." : "Delete"}
            disabled={isDeleting}
            className='bg-red-500 hover:bg-red-400 active:scale-95 text-white py-3 px-12 rounded-lg cursor-pointer disabled:opacity-50'
          />
        </div>
      </motion.div>
    </div>
  )
}

export default DeleteModal
