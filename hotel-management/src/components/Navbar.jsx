import { NavLink, Link } from "react-router-dom";
import { Hotel, LayoutDashboard, PlusCircle } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Hotel size={28} />
        <h2>
          Stay<span>Ease</span>
        </h2>
      </div>

      <div className="nav-links">
        <NavLink to="/" end>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/hotels">
          <Hotel size={18} />
          Hotels
        </NavLink>
      </div>

      <Link to="/add" className="add-hotel-btn">
        <PlusCircle size={18} />
        Add Hotel
      </Link>
    </nav>
  );
}

export default Navbar;
