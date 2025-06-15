import RoomTypeInBrief from '@/components/RoomTypeInBrief'
import { roomTypeInBrief } from '@/constants/roomTypeInBrief'
import React from 'react'

const Page = () => {
  return (
    <div className=''>
      <h1 className='text-center text-3xl py-6 playfair'>ROOM & SUITE</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4 mb-8">
          {roomTypeInBrief.map((item, index) => (
            <RoomTypeInBrief key={index} {...roomTypeInBrief[index]}/>
          ))}
      </div>
    </div>
  )
}

export default Page