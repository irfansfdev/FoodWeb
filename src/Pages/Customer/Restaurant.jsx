import Navbar from "../../Components/Common/Navbar";
import RestaurantHero from "../../Components/RestaurantDetails/RestaurantHero";
import MenuSection from "../../Components/RestaurantDetails/MenuSection";
import Location from "../../Components/RestaurantDetails/Location";
import Reviews from "../../Components/RestaurantDetails/Reviews";
import RestaurantGrid from "../../Components/Menu/Restaurant.Grid";
import Footer from "../../Components/Common/Footer";

export default function Restaurant() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Navbar />
      
      <RestaurantHero />
      
      <MenuSection />
      
      <Location />
      
      <Reviews />
      
      <div className="pt-22">
        <RestaurantGrid type="Similar" />
      </div>
      
      <Footer />
    </div>
  );
}