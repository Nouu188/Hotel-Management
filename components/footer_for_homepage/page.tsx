import React from 'react'
import ContactInfo from './ContactInfo'
import NavigationLinksFooter from './NavigationLinksFooter'

const Footer = () => {
  return (
    <div className='flex justify-center bg-[#081746]'>
        <div className='                
          flex flex-col lg:flex-row 
          justify-center items-start 
          gap-8 xl:gap-16
          p-8 
          w-full 
          max-w-[1210px] 
          container mx-auto'
        >
            <ContactInfo/>
            <NavigationLinksFooter/>
        </div>
    </div>
  )
}

export default Footer