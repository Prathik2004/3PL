import React from 'react'
import BasicInput from './ui/BasicInput'
import BasicButton from './ui/BasicButton'

const ResetPasswordCard = () => {
  return (
    <div className='shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] p-8 border border-[#E2E8F0] rounded-xl max-w-[30%] flex flex-col'>
        {/* HAEDING */}
      <div className='flex flex-col text-left mb-10'>
        <span className='text-[22px]/[28px] font-bold'>Reset Password</span>
        <span className='text-[14px]/[20px] text-[#64748B]'>Please enter your current password and choose a new secure one to protect your 3PL Walkwel account.</span>
      </div>
      <div className='flex flex-col gap-5 mb-5'>
        <BasicInput type="Password" text="Password" placeholder="Enter current password" />
        <BasicInput type="Password" text="New Password" placeholder="Minimum 8 characters" />
        <BasicInput type="Password" text="Confirm New Password" placeholder="Re-enter new password" />
      </div>
      <BasicButton text='Update Password' className='w-full bg-black text-white p-4 rounded-lg hover:bg-black/70 active:scale-95' />
    </div>
  )
}

export default ResetPasswordCard
