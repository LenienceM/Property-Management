import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../api/auth";

export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/properties");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0B]/90 backdrop-blur border-b border-[#C9A24D]/30">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            className="h-8 object-contain"
            alt="Pelican Properties"
          />
          <span className="text-[#C9A24D] font-semibold tracking-wide">
            Pelican Properties
          </span>
        </div>

        {/* Main navigation */}
        <nav className="flex items-center gap-8 text-sm uppercase tracking-widest">
          <NavLink to="/properties" className="text-[#B5B5B5] hover:text-[#C9A24D]">
            Properties
          </NavLink>

          <NavLink to="/about" className="text-[#B5B5B5] hover:text-[#C9A24D]">
            About
          </NavLink>

          <NavLink to="/contact" className="text-[#B5B5B5] hover:text-[#C9A24D]">
            Contact
          </NavLink>
          
          <NavLink
                to="/signup"
                className="px-3 py-1 border border-[#C9A24D] text-[#C9A24D] rounded"
              >
                Signup
          </NavLink>

          {auth.isAdmin() && (
            <NavLink
              to="/properties/add"
              className="px-3 py-1 bg-[#C9A24D] text-black rounded font-semibold"
            >
              + Add Property
            </NavLink>
          )}

          {!auth.isAuthenticated() ? (
            <NavLink
              to="/login"
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
        </nav>
      </div>
    </header>
  );
}
