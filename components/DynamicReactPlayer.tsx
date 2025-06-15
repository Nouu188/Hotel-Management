import dynamic from 'next/dynamic';
import React from 'react'

const DynamicReactPlayer = dynamic(() => import('react-player/lazy'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '752px', 
      height: '423px', 
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0.75rem' 
    }}>
    </div>
  )
}); 

export default DynamicReactPlayer