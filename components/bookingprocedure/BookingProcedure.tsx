import ClientDetails from './ClientDetails/ClientDetails'
import BookingCompletion from './BookingCompletion'
import ExtrasSelector from './Extra/ExtrasSelector'
import { toast } from '@/hooks/use-toast'
import { useBooking } from '@/hooks/useBooking';

export type SectionName = 'details' | 'extras' | 'completion' | 'none';

const BookingProcedure = () => {
    const {    
      handleBookingSubmit,
      handleToggleSection,
      handleCompleteClientDetails,
      handleCompleteExtras,
      completedExtras,
      activeSection,   
      clientDetailsValues,
      completedDetails,
    } = useBooking();

    const onFinalSubmit = () => {
      if (clientDetailsValues) {
        handleBookingSubmit();
      } else {
        toast({
          title: "Incomplete Information",
          description: "Please complete your details before submitting.",
        });
      }
    };

    return (
      <div className='space-y-5'>
            <ClientDetails 
                isOpen={activeSection === 'details'}
                onToggle={() => handleToggleSection('details')}
                onComplete={handleCompleteClientDetails} 
            />
            <ExtrasSelector 
                isOpen={activeSection === 'extras'}
                onToggle={() => handleToggleSection('extras')}
                onComplete={handleCompleteExtras} 
                completedPrev={completedDetails}
            />
            <BookingCompletion 
                isOpen={activeSection === 'completion'}
                onToggle={() => handleToggleSection('completion')}
                onSubmit={onFinalSubmit} 
                completedPrev={completedExtras}
            />
      </div>
    )
}

export default BookingProcedure;