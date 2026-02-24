"use client"
import { useState } from 'react'
import BasicInput from '../BasicInput'
import RoleSlider from './RoleSlider'
import BasicButton from '../BasicButton'
import { Roles } from '@/src/types/types'



const LoginCard = () => {
    const [selectedRole, setSelectedRole] = useState<Roles>("Viewer");
    const rolePlaceholder={
    "Viewer": "e12345@walkwel.com",
    "Admin" : "admin@walkwel.com",
    "Operations": "op1234@walkwel.com"
    }

  return (
    <div className='shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] p-8 border border-[#E2E8F0] rounded-xl flex flex-col'>
        {/* HEADING */}
      <div className='flex flex-col text-left mb-10'>
        <span className='text-[22px]/[28px] font-bold'>Welcome back</span>
        <span className='text-[14px]/[20px] text-[#64748B]'>Please enter your details to sign in</span>
      </div>
      {/* INPUTS AND SLIDER */}
      <div className='flex flex-col gap-5 mb-5'>
        <BasicInput text="Username/Email" placeholder={`e.g. ${rolePlaceholder[selectedRole]}`} />
        <BasicInput type="Password" text="Password" placeholder="•••••••••" />
        <RoleSlider selectedRole={selectedRole} setSelectedRole={setSelectedRole}  />
      </div>
      <BasicButton text='Sign In' className='w-full bg-black text-white p-4 rounded-lg hover:bg-black/70 active:scale-95' />
    </div>
  )
}

export default LoginCard
