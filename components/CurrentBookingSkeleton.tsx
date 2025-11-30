export const CurrentBookingSkeleton = () => {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
          <div className="flex-grow space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="mt-6 flex gap-4">
          <div className="w-[200px] h-[150px] bg-gray-200 rounded-lg"></div>
          <div className="w-[200px] h-[150px] bg-gray-200 rounded-lg"></div>
          <div className="w-[200px] h-[150px] bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  };