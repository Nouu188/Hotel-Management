import React from 'react';

const SkeletonItem = () => (
  <div className="max-w-[695px] w-full flex flex-col border-1 border-gray-200 bg-white rounded-sm shadow overflow-hidden">
    <div className="border-b-1 border-gray-200 pb-4 flex gap-3 max-md:flex-col">
      {/* Skeleton cho ảnh */}
      <div className="lg:w-[300px] lg:h-[200px] md:w-[260px] md:h-[180px] max-md:h-[180px] w-full relative shrink-0">
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
      </div>
      
      <div className='flex flex-col space-y-3 p-4 md:p-0 md:pt-2 flex-grow md:pr-[62px]'>
        {/* Tên phòng */}
        <div className="h-6 w-3/4 bg-gray-300 animate-pulse rounded-md"></div>
        
        {/* Các icon thông số */}
        <div className='flex gap-4'>
          <div className='h-5 w-20 bg-gray-200 animate-pulse rounded-md'></div>
          <div className='h-5 w-28 bg-gray-200 animate-pulse rounded-md'></div>
          <div className='h-5 w-24 bg-gray-200 animate-pulse rounded-md'></div>
        </div>

        {/* Mô tả phòng */}
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md"></div>
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md"></div>
          <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </div>
    </div>

    {/* Phần dưới: Ưu đãi, giá và nút bấm */}
    <div className="justify-between p-4 flex animate-pulse">
      {/* Skeleton cho các ưu đãi */}
      <div className="flex-grow space-y-2 pr-4">
        <div className="h-5 w-1/2 bg-gray-300 rounded-md"></div>
        <div className="h-4 w-full bg-gray-200 rounded-md"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded-md"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
      </div>
      
      <div className='flex flex-col justify-end items-end'>
        <div className='flex max-md:flex-col md:gap-4 gap-2 items-end max-md:items-stretch'>
          {/* Skeleton cho giá */}
          <div className="flex flex-col items-end space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
            <div className="h-7 w-32 bg-gray-300 rounded-md"></div>
          </div>
          {/* Skeleton cho nút bấm */}
          <div className='bg-gray-300 rounded-sm h-[46px] w-[90px] max-md:w-full'></div> 
        </div>
      </div>
    </div>
  </div>
);


export const HotelBranchRoomTypeFilterSectionSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="flex raleway flex-col gap-4 max-md:mx-2">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </div>
  );
};