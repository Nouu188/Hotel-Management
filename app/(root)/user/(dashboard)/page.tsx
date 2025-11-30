import CurrentBookingCard from "@/components/CurrentBookingCard";
import HistoryBooking from "@/components/history-booking/HistoryBooking";
import UserProfileCard from "@/components/UserProfileCard";

export default function DashboardPage() {
  return (
    <div className="space-y-6 py-6 container mx-auto xl:px-35">
      <div className="container mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                  <UserProfileCard />
              </div>
              <div className="lg:col-span-2">
                  <CurrentBookingCard />
              </div>
          </div>
      </div>
      <div>
        <HistoryBooking />
      </div>
    </div>
  );
}