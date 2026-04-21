import { useClerk, UserButton } from "@clerk/clerk-react";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useAppContext } from "../context/AppContext.jsx";

const BookIcon = () => (
  <svg
    className="w-4 h-4 text-gray-700"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
    />
  </svg>
);

// Hardcoded searchable pages/content — extend this list to match your actual routes/content
const SEARCH_DATA = [
  { title: "Home", path: "/", description: "Back to the homepage" },
  {
    title: "Hotels",
    path: "/rooms",
    description: "Browse all available rooms and hotels",
  },
  {
    title: "Experience",
    path: "/",
    description: "Explore curated experiences",
  },
  { title: "About", path: "/", description: "Learn more about us" },
  {
    title: "My Bookings",
    path: "/my-bookings",
    description: "View and manage your bookings",
  },
  {
    title: "Owner Dashboard",
    path: "/owner",
    description: "Manage your property listings",
  },
  {
    title: "Deluxe Suite",
    path: "/rooms",
    description: "Luxury suite with ocean view",
  },
  {
    title: "Standard Room",
    path: "/rooms",
    description: "Comfortable standard rooms",
  },
  {
    title: "Family Room",
    path: "/rooms",
    description: "Spacious rooms for families",
  },
  {
    title: "Beach Resort",
    path: "/rooms",
    description: "Rooms at beachside resorts",
  },
  {
    title: "Mountain Retreat",
    path: "/rooms",
    description: "Cozy mountain getaway rooms",
  },
  {
    title: "City Hotel",
    path: "/rooms",
    description: "Hotels in the city center",
  },
];

const SearchBar = ({ isScrolled, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-focus when search bar opens
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = SEARCH_DATA.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
    setResults(filtered);
  }, [query]);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && results.length > 0) {
      handleSelect(results[0].path);
    }
  };

  return (
    <div className="relative flex items-center" style={{ minWidth: "260px" }}>
      <div
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 transition-all duration-300 shadow-md ${
          isScrolled
            ? "bg-gray-100 border border-gray-200"
            : "bg-white/20 backdrop-blur border border-white/30"
        }`}
        style={{ minWidth: "260px" }}
      >
        {/* Search Icon inside bar */}
        <svg
          className={`w-5 h-5 flex-shrink-0 ${isScrolled ? "text-gray-500" : "text-white"}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search hotels, rooms..."
          className={`bg-transparent outline-none text-sm w-full ${
            isScrolled
              ? "text-gray-800 placeholder-gray-400"
              : "text-white placeholder-white/70"
          }`}
        />

        {/* Clear / Close button */}
        {query ? (
          <button
            onClick={() => setQuery("")}
            className={`flex-shrink-0 transition-opacity ${isScrolled ? "text-gray-400 hover:text-gray-700" : "text-white/70 hover:text-white"}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={onClose}
            className={`flex-shrink-0 transition-opacity ${isScrolled ? "text-gray-400 hover:text-gray-700" : "text-white/70 hover:text-white"}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {focused && results.length > 0 && (
        <div
          className="absolute top-full mt-2 left-0 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          style={{ minWidth: "300px" }}
        >
          {results.map((item, i) => (
            <button
              key={i}
              onMouseDown={() => handleSelect(item.path)}
              className="w-full flex flex-col px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <span className="text-sm font-medium text-gray-800">
                {item.title}
              </span>
              <span className="text-xs text-gray-400 mt-0.5">
                {item.description}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {focused && query.trim() !== "" && results.length === 0 && (
        <div
          className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 z-50"
          style={{ minWidth: "300px" }}
        >
          <p className="text-sm text-gray-400">No results for "{query}"</p>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Experience", path: "/" },
    { name: "About", path: "/" },
  ];

  const [isScrolledState, setIsScrolledState] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { openSignIn } = useClerk();
  const location = useLocation();

  const { user, navigate, isOwner, setShowHotelReg } = useAppContext();

  const isScrolled = location.pathname !== "/" || isScrolledState;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledState(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search on route change
  useEffect(() => {
    setIsSearchOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="header logo"
          className={`text-white h-9 ${isScrolled && "invert opacity-80"}`}
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {!isSearchOpen &&
          navLinks.map((link, i) => (
            <a
              key={i}
              href={link.path}
              className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}
            >
              {link.name}
              <div
                className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`}
              />
            </a>
          ))}

        {user && !isSearchOpen && (
          <button
            className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${
              isScrolled ? "text-black" : "text-white"
            } transition-all`}
            onClick={() =>
              isOwner ? navigate("/owner") : setShowHotelReg(true)
            }
          >
            {isOwner ? "Dashboard" : "List your Hotel"}
          </button>
        )}

        {/* Animated Search */}
        <div
          className={`transition-all duration-300 overflow-visible ${
            isSearchOpen
              ? "opacity-100 max-w-xs w-72"
              : "opacity-0 max-w-0 w-0 pointer-events-none"
          }`}
        >
          {isSearchOpen && (
            <SearchBar
              isScrolled={isScrolled}
              onClose={() => setIsSearchOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">
        {/* Search Icon toggle */}
        <button
          onClick={() => setIsSearchOpen((prev) => !prev)}
          className="focus:outline-none cursor-pointer"
          aria-label="Toggle search"
        >
          {isSearchOpen ? (
            <svg
              className={`h-6 w-6 transition-all duration-300 ${isScrolled ? "text-gray-700" : "text-white"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <img
              src={assets.searchIcon}
              alt="search icon"
              className={`${isScrolled && "invert"} h-8 w-8 transition-all duration-500`}
            />
          )}
        </button>

        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<BookIcon />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${
              isScrolled ? "text-white bg-black" : "bg-white text-black"
            } cursor-pointer`}
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        {user && (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<BookIcon />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
        <button
          onClick={() => setIsSearchOpen((prev) => !prev)}
          aria-label="Search"
          className="cursor-pointer"
        >
          <img
            src={assets.searchIcon}
            alt="search icon"
            className={`${isScrolled && "invert"} h-6 w-6`}
          />
        </button>
        <img
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          src={assets.menuIcon}
          alt="menu icon"
          className={`${isScrolled && "invert"} h-4`}
        />
      </div>

      <div
        className={`absolute top-full left-0 w-full px-4 md:hidden transition-all duration-300 ${
          isSearchOpen
            ? "opacity-100 translate-y-0 pointer-events-auto py-3 bg-white shadow-md"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {isSearchOpen && (
          <SearchBar isScrolled={true} onClose={() => setIsSearchOpen(false)} />
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="cross icon" className="h-6.5" />
        </button>

        {navLinks.map((link, i) => (
          <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </a>
        ))}

        {user && (
          <button
            className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
            onClick={() =>
              isOwner ? navigate("/owner") : setShowHotelReg(true)
            }
          >
            {isOwner ? "Dashboard" : "List your Hotel"}
          </button>
        )}

        {!user && (
          <button
            onClick={openSignIn}
            className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
