// app/(main)/profile/ProfileSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSkeleton = () => {
  return (
    <div className='pb-8 pt-4 px-8 rounded-sm w-full bg-white'>
      {/* --- Skeleton cho Header --- */}
      <section className='py-4 border-b'>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </section>

      {/* --- Skeleton cho Form chính --- */}
      <section className='flex py-8 w-full'>
        <div className='flex flex-col md:flex-row gap-8 w-full'>
          {/* --- Cột bên trái: Các trường thông tin --- */}
          <div className="space-y-8 pr-7 flex-grow">
            
            {/* Skeleton cho trường Username */}
            <div className='flex items-center gap-4'>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 flex-1" />
            </div>

            {/* Skeleton cho trường Email */}
            <div className='flex items-center gap-4'>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-48" />
            </div>

            {/* Skeleton cho trường Phone */}
            <div className='flex items-center gap-4'>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>

            {/* Skeleton cho GenderSelector */}
            <div className='flex items-center gap-4'>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-40" />
            </div>

            {/* Skeleton cho BirthdaySelector */}
            <div className='flex items-center gap-4'>
              <Skeleton className="h-5 w-24" />
              <div className="flex flex-1 space-x-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>
          </div>

          {/* --- Cột bên phải: Avatar --- */}
          <div className='flex-1 flex flex-col justify-center items-center border-l-0 md:border-l pt-8 md:pt-0'>
            <Skeleton className="h-28 w-28 rounded-full mb-4" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </section>

      {/* --- Skeleton cho nút Save --- */}
      <section>
        <Skeleton className="h-12 w-32" />
      </section>
    </div>
  );
};