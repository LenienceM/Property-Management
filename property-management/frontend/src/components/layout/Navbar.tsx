import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../../api/auth";

export function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    auth.logout();
    setIsOpen(false);
    navigate("/properties");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = (
    <>
      <NavLink to="/properties" onClick={() => setIsOpen(false)}>
        Properties
      </NavLink>

      <NavLink to="/about" onClick={() => setIsOpen(false)}>
        About
      </NavLink>

      <NavLink to="/contact" onClick={() => setIsOpen(false)}>
        Contact
      </NavLink>

      
      {auth.isAdmin() && (
        <NavLink
          to="/properties/add"
          onClick={() => setIsOpen(false)}
          className="px-3 py-1 bg-[#C9A24D] text-black rounded font-semibold"
        >
          + Add Property
        </NavLink>
      )}

      {!auth.isAuthenticated() ? (
        <NavLink
          to="/login"
          onClick={() => setIsOpen(false)}
          className="px-3 py-1 border border-[#C9A24D] text-[#C9A24D] rounded"
        >
          Login
        </NavLink>
      ) : (
        <button
          onClick={handleLogout}
          className="px-3 py-1 border border-red-500 text-red-400 rounded"
        >
          Logout
        </button>
      )}
    </>
  );

  const Logo = () => (
    <div className="flex items-center gap-3">
      <img src="/logo.jpeg" className="h-8 object-contain" alt="Pelican Properties" />
      <span className="text-[#C9A24D] font-semibold tracking-wide">
        Pelican Properties
      </span>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0B]/90 backdrop-blur border-b border-[#C9A24D]/30">
      
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-[#B5B5B5]">
          {navLinks}
        </nav>

        {/* Mobile Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-[#C9A24D] relative w-6 h-6"
        >
          {/* Hamburger → X animation */}
          <span
            className={`absolute h-[2px] w-6 bg-[#C9A24D] transition-all duration-300 ${
              isOpen ? "rotate-45 top-3" : "top-1"
            }`}
          />
          <span
            className={`absolute h-[2px] w-6 bg-[#C9A24D] transition-all duration-300 ${
              isOpen ? "opacity-0" : "top-3"
            }`}
          />
          <span
            className={`absolute h-[2px] w-6 bg-[#C9A24D] transition-all duration-300 ${
              isOpen ? "-rotate-45 top-3" : "top-5"
            }`}
          />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 flex flex-col gap-4 text-sm uppercase tracking-widest text-[#B5B5B5]">
          {navLinks}
        </div>
      </div>
    </header>
  );
}