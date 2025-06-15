import FooterForBooking from "@/components/footer_for_booking/page";
import ClientNavBar from "@/components/navbar/navbar_for_booking/ClientNavbarForBooking";

export default function BookDirectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ClientNavBar />
      <main>{children}</main>
      <FooterForBooking/>
    </div>
  );
}