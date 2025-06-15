import { Mail, MessageSquare, Phone, Send } from 'lucide-react'
import { Popover } from '@radix-ui/react-popover'
import { PopoverContent, PopoverTrigger } from './ui/popover'

const FloatingChatButton = () => {
  return (
    <Popover>
        <PopoverTrigger>
            <div className='bg-[#C19C51] hover:bg-[#C19C51] rounded-full cursor-pointer p-5 min-w-12.5'>
                <MessageSquare className='scale-180 text-white'/>
            </div>
        </PopoverTrigger>
        <PopoverContent className='raleway max-w-40 space-y-4'>
            <div className='flex items-center gap-2'>
                <Mail className='text-orange-700'/>
                Email
            </div>
            <div className='flex items-center gap-2'>
                <Phone className='text-green-400'/>
                WhatsApp
            </div>
            <div className='flex items-center gap-2'>
                <Send className='text-blue-400'/>
                Chat now
            </div>
        </PopoverContent>
    </Popover>  
  )
}

export default FloatingChatButton