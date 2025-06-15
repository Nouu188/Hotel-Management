import Image from 'next/image'
import React from 'react'

const FooterForBooking = () => {
  return (
    <div className='container mx-auto py-4'>
        <div className='flex justify-between'>
            <section className='flex items-center text-sm'>
                <div className='raleway border-r-1 pr-2 text-gray-500'>
                    Copyright © 2025
                </div>
                <button className='pl-2 cursor-pointer'>
                    <p className='text-[#015979] font-semibold hover:border-b-1 hover:border-b-[#006e96] '>Cookie Setting</p>
                </button>
            </section>

            <section>
                <Image src="/images/pci.svg" width={90} height={90} alt='pci' />
            </section>
        </div>
    </div>
  )
}

export default FooterForBooking