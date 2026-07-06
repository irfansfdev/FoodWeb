import { useEffect, useState } from "react";
import Navbar from "../../Components/Common/Navbar";
import RestaurantHero from "../../Components/RestaurantDetails/RestaurantHero";
import Footer from "../../Components/Common/Footer";
import RestaurantOffersHeader from "../../Components/RestaurantDetails/RestaurantOffersHeader";
import OfferCategoryTabs from "../../Components/RestaurantDetails/OfferCategoryTab";
import OffersGrid from "../../Components/RestaurantDetails/OffersGrid";
import Card from "../../Components/RestaurantDetails/Cards";
import { data } from "../../Components/Utils/dummyData";

export default function Restaurant() {
  const [activeCategory, setActiveCategory] = useState("Offers");
  const [userCart, setUserCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("UserCart")) || [];
    setUserCart(storedCart);
  }, []);

  const handleAddToCard = (item) => {
    const updatedCart = [...userCart, item];

    setUserCart(updatedCart);

    setTimeout(() => {
      localStorage.setItem("UserCart", JSON.stringify(updatedCart));
      window.alert("Cart Updated");
    }, 3000);
  };

  return (
    <>
      <Navbar />

      <RestaurantHero />

      <RestaurantOffersHeader restaurantName="McDolands" />

      <OfferCategoryTabs
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <OffersGrid />

      <div className="mx-auto space-y-2 px-20">
        <div className="space-y-14">
        </div>

        {/* Restaurant Categories With Items */}
        <div className="space-y-14">
          {data
            // Remove this filter if you don't want category filtering
            .filter(
              (category) =>
                activeCategory === "Offers" ||
                category.name === activeCategory
            )
            .map((category) => (
              <section key={category.id}>
                <h2 className="mb-6 text-[32px] font-bold text-[#03081F]">
                  {category.name}
                </h2>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
                  {category.items.map((item) => (
                    <Card
                      key={item.id}
                      data={item}
                      onBtnClick={() => handleAddToCard(item)}
                    />
                  ))}
                </div>
              </section>
            ))}
        </div>
      </div>

      <Footer />
    </>
  );
}