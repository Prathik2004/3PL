import Image from 'next/image'
import React from 'react'

const DeleteModal = () => {
  return (
    <div className='w-72.75 h-76 flex flex-col items-center justify-center bg-white rounded-xl'>
        <div className='w-16 h-16 rounded-full flex items-center justify-center bg-[#EE2B2B1A]'>
            <Image src="icons/redDelete.svg" alt="Delete" width={30} height={30} className='text-red-500' />
        </div>
        <span className='text-black text-[24px]/[32px] font-bold'>
            Delete Shipment
        </span>
        <span className='text-[14px]/[20px] text-[#64748B] text-center'>
            Are you sure you want to delete this shipment? This action cannot be undone.
        </span>

    </div>
  )
}

export default DeleteModal
