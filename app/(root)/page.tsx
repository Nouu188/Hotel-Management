import ImagesCarousel from '@/components/ImagesCarousel'
import RoomsCheck from '@/components/RoomsCheck'

import React from 'react'

const HomePage = () => {
  return (
    <div className='flex flex-col'>
        <ImagesCarousel/>
        
        <section className='mt-180 z-100'>
          <RoomsCheck/>
        </section>
    </div>
  )
}

export default HomePage