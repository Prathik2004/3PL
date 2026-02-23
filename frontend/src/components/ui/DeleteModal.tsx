import Image from 'next/image'
import React from 'react'
import BasicButton from './BasicButton'

const DeleteModal = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50'>
    <div 
    style={{
        fontFamily: "Inter"
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
            <BasicButton text="Cancel" className='border border-[#E2E8F0]' />
            <BasicButton text="Delete" className='bg-red-500 text-white' />
        </div>
    </div>
    </div>
  )
}

export default DeleteModal
