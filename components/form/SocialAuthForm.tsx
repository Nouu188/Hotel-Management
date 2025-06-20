"use client";

import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { signIn } from 'next-auth/react'; 

const SocialAuthForm = () => {
  return (
    <div className='pt-4 mt-8 border-t-1 border-black'>
        <Button
            className='min-h-12 flex-1 bg-[#081746] rounded-sm hover:bg-[#0f225e] px-4 w-full py-3.5'
            onClick={() => {signIn("google", { callbackUrl: "/" })}}  
        >
            <Image
                src="/icons/google.svg"
                alt='Google Logo'
                width={20}
                height={20}
                className='invert-color mr-2.5 object-contain'
            />
            <span>Log in with Google</span>
        </Button>
    </div>
  )
}

export default SocialAuthForm