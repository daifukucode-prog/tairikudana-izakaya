import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MenuSection from '@/components/MenuSection';
import CourseSection from '@/components/CourseSection';
import ShopInfo from '@/components/ShopInfo';
import ReservationSection from '@/components/ReservationSection';
import NewsSection from '@/components/NewsSection';
import FloatingReserveButton from '@/components/FloatingReserveButton';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MenuSection />
        <CourseSection />
        <ShopInfo />
        <ReservationSection />
        <NewsSection />
      </main>
      <Footer />
      <FloatingReserveButton />
    </>
  );
}
