import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HashLink } from "react-router-hash-link";
import { useSelector, useDispatch } from "react-redux";
import { logout, openAuthModal } from "../../Redux/Slices/AuthSlice"; 
import logo from "../../assets/HomeAssets/OrderUKLogo.png";
import locationIcon from "../../assets/HomeAssets/LocationIcon.png";
import basketIcon from "../../assets/HomeAssets/Full Shopping Basket.png";
import arrowDownIcon from "../../assets/HomeAssets/Forward Button.png";
import { Menu, LogOut, User, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

import { getRestaurants } from "../../api/restaurantAPI"; 

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Browse Menu", path: "/#menu" },
  { label: "Special Offers", path: "/offers" },
  { label: "Restaurants", path: "#" }, 
  { label: "Order Tracking", path: "/orderTrack/:id" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // NEW: State for restaurants and dropdown toggles
  const [restaurants, setRestaurants] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // NEW: Fetch restaurants when Navbar loads
  useEffect(() => {
    const fetchRes = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data || []);
      } catch (error) {
        console.error("Failed to fetch restaurants for Navbar", error);
      }
    };
    fetchRes();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {/* ══════════════════════ DESKTOP ══════════════════════ */}
      <div className="hidden lg:block">
        {/* ── Top promo / utility strip ─────────────────────────── */}
        <div
          className="w-full mx-auto bg-brand-offwhite border-b border-x border-black/10 rounded-b-card overflow-hidden font-body text-black"
          style={{ maxWidth: "1528px" }}
        >
          <div className="h-[70px] flex items-center justify-between px-[137px] gap-0">
            {/* Promo text */}
            <div className="flex items-center gap-2 text-[15px] font-medium">
              <span className="text-[25px] leading-none">🌟</span>
              <p className="leading-snug">
                Get 5% Off your first order,{" "}
                <span className="text-brand-orange font-bold underline cursor-pointer">
                  Promo: ORDER5
                </span>
              </p>
            </div>

            {/* Right side */}
            <div className="flex items-center justify-end gap-9">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={locationIcon}
                  alt="Location Pin"
                  className="w-[25px] h-[25px] object-contain shrink-0"
                />
                <span className="text-[15px] font-medium text-brand-dark truncate">
                  Regent Street, A4, A4201, London
                </span>
                <button className="text-[14px] font-medium text-brand-orange underline hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap">
                  Change Location
                </button>
              </div>

              {/* Basket wrapper with redirect added */}
              <div 
                onClick={() => navigate('/cart')}
                className="flex items-center bg-brand-green border border-black/10 rounded-br-card text-white font-body h-full w-[378px] cursor-pointer hover:bg-opacity-95 transition-all select-none"
              >
                <div className="flex items-center justify-center px-2 flex-1">
                  <img
                    src={basketIcon}
                    alt="Basket"
                    className="w-[43px] h-[43px] object-contain"
                  />
                </div>

                <div className="h-full w-px bg-white/30" />

                <div className="w-[112px] flex items-center justify-center font-semibold text-[16px]">
                  23 Items
                </div>

                <div className="h-full w-px bg-white/30" />

                <div className="flex items-center justify-center w-[116px] font-semibold text-[16px]">
                  GBP 79.89
                </div>

                <div className="h-full w-px bg-white/30" />

                <div className="flex-1 h-full flex items-center justify-center hover:bg-black/10 transition-colors rounded-br-card">
                  <img
                    src={arrowDownIcon}
                    alt="Go to checkout"
                    className="w-[38px] h-[38px] object-contain rotate-90"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop nav row */}
        <div
          className="w-full mx-auto"
          style={{ maxWidth: "1528px", marginTop: "38px" }}
        >
          <div className="px-6 flex items-center justify-between">
            <Link to="/">
              <img
                src={logo}
                alt="Order UK Logo"
                className="w-[215px] h-auto object-contain"
              />
            </Link>

            <nav className="flex items-center gap-8 font-nav text-sm font-semibold">
              {navLinks.map((link) => {
                // NEW: Desktop Dropdown Intercept
                if (link.label === "Restaurants") {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setShowDropdown(true)}
                      onMouseLeave={() => setShowDropdown(false)}
                    >
                      <button className="h-[45px] text-brand-dark hover:text-brand-orange flex items-center justify-center gap-1 transition-colors duration-200 outline-none cursor-pointer">
                        Restaurants <ChevronDown size={16} className={`transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}/>
                      </button>

                      {/* Dropdown Menu */}
                      {showDropdown && (
                        <div className="absolute top-[45px] left-1/2 -translate-x-1/2 w-[220px] bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50 py-2">
                          {restaurants.length > 0 ? (
                            restaurants.map((res) => (
                              <Link
                                key={res.id}
                                to={`/restaurant/${res.id}`}
                                className="block px-4 py-2.5 text-brand-dark hover:bg-brand-orange hover:text-white transition-colors text-[14px]"
                                onClick={() => setShowDropdown(false)}
                              >
                                {res.name}
                              </Link>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-400 text-sm text-center">
                              Loading...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }

                return link.label === "Browse Menu" ? (
                  <HashLink
                    key={link.label}
                    smooth
                    to="/#menu"
                    className="w-[127px] h-[45px] text-brand-dark hover:text-brand-orange flex items-center justify-center transition-colors duration-200"
                  >
                    {link.label}
                  </HashLink>
                ) : (
                  <NavLink
                    key={link.label}
                    to={link.path}
                    end={link.path === "/"}
                    className={({ isActive }) =>
                      isActive
                        ? "w-[127px] h-[45px] bg-brand-orange text-white rounded-pill flex items-center justify-center transition-colors duration-200"
                        : "w-[127px] h-[45px] text-brand-dark hover:text-brand-orange flex items-center justify-center transition-colors duration-200"
                    }
                  >
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <ThemeToggle />

              {user ? (
                <div className="w-[234px] h-[61px] bg-brand-dark text-white rounded-pill flex items-center justify-between pl-3 pr-4 font-nav text-[14px] font-semibold shadow-md min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-[36px] h-[36px] bg-brand-orange rounded-full flex items-center justify-center shrink-0">
                      <User size={18} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="truncate text-left pr-1 block">
                      {user.username || 'User'}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="text-white/50 hover:text-brand-orange transition-colors shrink-0 ml-1"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => dispatch(openAuthModal())}
                  className="w-[234px] h-[61px] bg-brand-dark text-white rounded-pill flex items-center justify-center gap-3 font-nav text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <div className="w-[30px] h-[30px] bg-brand-orange rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span>Login/Signup</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════ MOBILE ══════════════════════ */}
      <div className="lg:hidden w-full relative">
        <div className="flex items-center justify-between px-4 pt-[27px] pb-[18px]">
          <Link to="/">
            <img src={logo} alt="Order UK Logo" className="w-[154px] h-[38px] object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <Menu size={32} className="text-brand-dark" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <div className="w-full h-[77px] flex items-center">
          {user ? (
            <div className="flex-1 h-full bg-brand-orange flex items-center justify-between px-4 min-w-0">
              <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
                <div className="w-[34px] h-[34px] bg-brand-dark rounded-full flex items-center justify-center shrink-0">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-[15px] font-bold text-brand-dark truncate pr-1">
                  {user.username || 'User'}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-brand-dark/60 hover:text-brand-dark transition-colors shrink-0 ml-1"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => dispatch(openAuthModal())}
              className="flex-1 h-full bg-brand-orange flex items-center gap-3 px-5 hover:bg-brand-orange/90 transition-colors"
            >
              <div className="w-[34px] h-[34px] bg-brand-dark rounded-full flex items-center justify-center shrink-0">
                <User size={16} className="text-white" />
              </div>
              <span className="text-[16px] font-bold text-brand-dark select-none whitespace-nowrap">
                Login/Signup
              </span>
            </button>
          )}

          <div 
            onClick={() => navigate('/cart')}
            className="flex items-center bg-brand-green h-full w-[180px] sm:w-[220px] justify-center gap-2 shrink-0 cursor-pointer hover:bg-opacity-95 transition-all select-none"
          >
            <img src={basketIcon} alt="Basket" className="w-[38px] h-[38px] object-contain" />
            <span className="text-white font-semibold text-[15px] sm:text-[16px]">GBP 79.89</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 pt-[15px] pb-[15px]">
          <img src={locationIcon} alt="Location Pin" className="w-[25px] h-[25px] object-contain shrink-0" />
          <span className="text-[14px] text-black truncate">Lution Street, N4G-00...</span>
        </div>

        {menuOpen && (
          <div className="w-full px-4 py-4 flex flex-col gap-4 bg-white border-b border-black/10">
            {navLinks.map((link) => {
              // NEW: Mobile Dropdown Intercept
              if (link.label === "Restaurants") {
                return (
                  <div key={link.label} className="flex flex-col">
                    <button
                      onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                      className="text-brand-dark font-medium flex items-center justify-between"
                    >
                      Restaurants
                      <ChevronDown size={18} className={`transition-transform duration-200 ${mobileDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    
                    {mobileDropdownOpen && (
                      <div className="flex flex-col pl-4 mt-3 gap-3 border-l-2 border-brand-orange/30">
                        {restaurants.length > 0 ? (
                          restaurants.map((res) => (
                            <Link
                              key={res.id}
                              to={`/restaurant/${res.id}`}
                              className="text-brand-dark/80 font-medium text-sm hover:text-brand-orange transition-colors"
                              onClick={() => {
                                setMenuOpen(false);
                                setMobileDropdownOpen(false);
                              }}
                            >
                              {res.name}
                            </Link>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">Loading...</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return link.label === "Browse Menu" ? (
                <HashLink
                  key={link.label}
                  smooth
                  to="/#menu"
                  onClick={() => setMenuOpen(false)}
                  className="text-brand-dark font-medium"
                >
                  {link.label}
                </HashLink>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.path}
                  end={link.path === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? "text-brand-orange font-semibold" : "text-brand-dark font-medium"
                  }
                >
                  {link.label}
                </NavLink>
              );
            })}
            
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="text-red-500 font-semibold text-left flex items-center gap-2 border-t pt-4 mt-2 border-black/5"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  dispatch(openAuthModal());
                }}
                className="text-brand-orange font-semibold text-left border-t pt-4 mt-2 border-black/5"
              >
                Login/Signup
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;