import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, Home as HomeIcon } from "lucide-react"; // import Home icon

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAccountClick = () => {
    navigate("/login");
  };

  const handleHomeClick = () => {
    navigate("/");
    setIsMobileMenuOpen(false); // close mobile menu if open
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? "bg-white shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center space-x-1">
              <div className="flex">
                <div className="h-8 w-4 bg-blue-600 rounded-l"></div>
                <div className="h-8 w-4 bg-blue-600 mx-0.5"></div>
                <div className="h-8 w-4 bg-orange-500 rounded-r"></div>
              </div>
              <span
                className={`font-bold text-xl ${
                  isScrolled || !isHomePage ? "text-blue-600" : "text-white"
                }`}
              >
                StayScape
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Home Button */}
            <button
              onClick={handleHomeClick}
              className={`flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 transition-colors ${
                isScrolled || !isHomePage
                  ? "text-gray-700"
                  : "text-white hover:text-gray-700"
              }`}
            >
              <HomeIcon size={20} />
              <span className="text-sm font-medium">Home</span>
            </button>

            {/* Account Button */}
            <button
              onClick={handleAccountClick}
              className={`flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 transition-colors ${
                isScrolled || !isHomePage
                  ? "text-gray-700"
                  : "text-white hover:text-gray-700"
              }`}
            >
              <User size={20} />
              <span className="text-sm font-medium">Account</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-full focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X
                size={24}
                className={
                  isScrolled || !isHomePage ? "text-gray-700" : "text-white"
                }
              />
            ) : (
              <Menu
                size={24}
                className={
                  isScrolled || !isHomePage ? "text-gray-700" : "text-white"
                }
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <button
              onClick={handleHomeClick}
              className="flex items-center space-x-2 py-2"
            >
              <HomeIcon size={20} className="text-gray-600" />
              <span className="text-gray-700 font-medium">Home</span>
            </button>
            <button
              onClick={handleAccountClick}
              className="flex items-center space-x-2 py-2"
            >
              <User size={20} className="text-gray-600" />
              <span className="text-gray-700 font-medium">Account</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
