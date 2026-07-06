import Navbar from "../../components/Common/Navbar";
import Footer from "../../components/Common/Footer";
import AboutUs from "../../Components/Home/AboutUs";
import HeroBanner from "../../Components/Home/HeroBanner";
import DownloadBanner from "../../Components/Home/DownloadBanner";
import GetStarted from "../../Components/Home/GetStarted";
import DealsGrid from "../../Components/Menu/DealsGrid";
import CategoryGrid from "../../Components/Menu/CategoryGrid";
import RestaurantGrid from "../../Components/Menu/Restaurant.Grid";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroBanner />
      <DealsGrid />
      <CategoryGrid />
      <RestaurantGrid title="Popular Restaurants" />
      <div className="mx-auto max-w-10xl px-5 py-8 space-y-6 sm:px-8 md:px-20.5">
      <DownloadBanner />
      <GetStarted />
      </div>
      <AboutUs />
      <Footer />
    </>
  );
}