import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { HashLink } from "react-router-hash-link";
import logo from "../../assets/HomeAssets/OrderUKLogo.png";
import locationIcon from "../../assets/HomeAssets/LocationIcon.png";
import basketIcon from "../../assets/HomeAssets/Full Shopping Basket.png";
import arrowDownIcon from "../../assets/HomeAssets/Forward Button.png";
import { Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Browse Menu", path: "/#menu" },
  { label: "Special Offers", path: "/offers" },
  { label: "Restaurants", path: "/restaurants" },
  { label: "Track Order", path: "/orders/track" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full block flex-none relative z-50">
      {/* ── Top promo / utility strip (Desktop Only) ─────────────────────────── */}
      <div
        className="hidden lg:block w-full mx-auto bg-brand-offwhite border-b border-x border-black/10 rounded-b-card overflow-hidden font-body text-black"
        style={{ maxWidth: "1528px" }}
      >
        <div className="h-auto lg:h-17.5 flex flex-col lg:flex-row lg:items-center lg:justify-between px-4 lg:px-34.25 py-3 lg:py-0 gap-2 lg:gap-0">
          {/* Promo text */}
          <div className="flex items-center gap-2 text-[13px] lg:text-[15px] font-medium">
            <span className="text-[20px] lg:text-[25px] leading-none">🌟</span>
            <p className="leading-snug">
              Get 5% Off your first order,{" "}
              <span className="text-brand-orange font-bold underline cursor-pointer">
                Promo: ORDER5
              </span>
            </p>
          </div>

          {/* Right side */}
          <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-9">
            <div className="hidden md:flex items-center gap-2 min-w-0">
              <img
                src={locationIcon}
                alt="Location Pin"
                className="w-[22px] h-[22px] lg:w-[25px] lg:h-[25px] object-contain shrink-0"
              />
              <span className="text-[13px] lg:text-[15px] font-medium text-brand-dark truncate max-w-[200px] lg:max-w-none">
                Regent Street, A4, A4201, London
              </span>
              <button className="text-[13px] lg:text-[14px] font-medium text-brand-orange underline hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap">
                Change Location
              </button>
            </div>

            {/* Basket */}
            <div className="flex items-center bg-brand-green border border-black/10 rounded-br-card lg:rounded-br-card text-white font-body h-[50px] lg:h-full lg:w-[378px] ml-auto lg:ml-0">
              <div className="flex items-center justify-center px-2 lg:flex-1">
                <img
                  src={basketIcon}
                  alt="Basket"
                  className="w-[30px] h-[30px] lg:w-[43px] lg:h-[43px] object-contain"
                />
              </div>

              <div className="hidden sm:block h-full w-px bg-white/30" />

              <div className="hidden sm:flex w-[90px] lg:w-[112px] items-center justify-center font-semibold text-[13px] lg:text-[16px]">
                23 Items
              </div>

              <div className="hidden sm:block h-full w-px bg-white/30" />

              <div className="flex items-center justify-center px-3 lg:w-[116px] font-semibold text-[13px] lg:text-[16px]">
                GBP 79.89
              </div>

              <div className="hidden lg:block h-full w-px bg-white/30" />

              <button className="hidden lg:flex flex-1 h-full items-center justify-center hover:bg-black/10 transition-colors cursor-pointer rounded-br-card">
                <img
                  src={arrowDownIcon}
                  alt="Go to checkout"
                  className="w-[38px] h-[38px] object-contain rotate-90"
                />
              </button>
            </div>

            <button
              className="lg:hidden shrink-0"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={28} className="text-brand-dark" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
      <div
        className="w-full mx-auto hidden lg:block"
        style={{ maxWidth: "1528px", marginTop: "38px" }}
      >
        <div className="px-6 flex items-center justify-between">
          <Link to="/">
            <img
              src={logo}
              alt="Order UK Logo"
              className="w-[180px] lg:w-[215px] h-auto object-contain"
            />
          </Link>

          <nav className="flex items-center gap-8 font-nav text-sm font-semibold">
            {navLinks.map((link) =>
              link.label === "Browse Menu" ? (
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
              ),
            )}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <Link
              to="/login"
              className="w-[234px] h-[61px] bg-brand-dark text-white rounded-pill flex items-center justify-center gap-3 font-nav text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <div className="w-[30px] h-[30px] bg-brand-orange rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z" />
                </svg>
              </div>

              <span>Login/Signup</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =======================================================
          PERFECTLY ALIGNED MOBILE NAVBAR (Login Only)
      ======================================================= */}
      {/* =======================================================
          PERFECTLY ALIGNED MOBILE NAVBAR
      ======================================================= */}
      <div className="lg:hidden w-full bg-white border-b border-gray-200 font-sans">
        {/* Top Panel: Logo (Left), Theme Toggle (Middle-Right), Hamburger Box (Right) */}
        <div className="flex h-20 border-b border-gray-100">
          <div className="flex-1 flex items-center pl-4 sm:pl-6">
            <Link to="/">
              <img
                src={logo}
                alt="Order UK Logo"
                className="w-[105px] h-auto object-contain"
              />
            </Link>
          </div>

          {/* Theme Toggle inserted right before the hamburger border */}
          <div className="flex items-center justify-center pr-4">
            <ThemeToggle />
          </div>

          {/* Hamburger Box */}
          <div className="w-20 sm:w-24 shrink-0 flex items-center justify-center border-l border-gray-200">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-4 text-black focus:outline-none hover:opacity-70 transition-opacity"
              aria-label="Toggle menu"
            >
              <Menu size={32} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Middle 50/50 Panel: Login & Basket Blocks */}
        <div className="grid grid-cols-2 h-16 text-sm sm:text-base font-bold">
          {/* Left Block: Login Button */}
          <Link
            to="/login"
            className="bg-[#FC8A06] text-black flex items-center justify-center gap-2 px-4 hover:bg-opacity-95 transition-all"
          >
            <div className="w-[22px] h-[22px] bg-black rounded-full flex items-center justify-center shrink-0">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z" />
              </svg>
            </div>
            <span className="tracking-tight">Login/Signup</span>
          </Link>

          {/* Right Block: Basket Pricing Status */}
          <div className="bg-[#008543] text-white flex items-center justify-center gap-2.5 px-4">
            <img
              src={basketIcon}
              alt="Basket"
              className="w-5 h-5 object-contain brightness-0 invert shrink-0"
            />
            <span className="tracking-tight">GBP 79.89</span>
          </div>
        </div>

        {/* Bottom Panel: Location/Address Bar */}
        <div className="flex items-center justify-end h-10 px-4 sm:px-6 bg-white text-brand-dark">
          <div className="flex items-center gap-2">
            <img
              src={locationIcon}
              alt="Location Pin"
              className="w-[14px] h-[18px] object-contain"
            />
            <span className="text-sm font-medium tracking-tight truncate max-w-[200px]">
              Lution Street, N4G-00...
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Wrapper */}
      {menuOpen && (
        <div className="lg:hidden w-full px-4 py-4 flex flex-col gap-4 bg-white border-b border-black/10 relative z-50">
          {navLinks.map((link) =>
            link.label === "Browse Menu" ? (
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
                  isActive
                    ? "text-brand-orange font-semibold"
                    : "text-brand-dark font-medium"
                }
              >
                {link.label}
              </NavLink>
            ),
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
