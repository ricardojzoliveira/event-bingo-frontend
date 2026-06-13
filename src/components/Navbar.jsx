import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Headset,
  LogIn,
  User,
  Wallet,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useLogout } from "../hooks/use-auth";

export default function Navbar({ role }) {
  const logout = useLogout();

  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const btnStyle =
    "bg-bingo-red text-bingo-dark font-bold py-2 px-4 rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap w-full md:w-auto justify-center";

  return (
    <nav className="bg-bingo-dark text-white px-6 py-4 flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-b border-bingo-red/30 relative z-50">
      <div className="flex items-center gap-6">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-black flex items-center gap-2 hover:opacity-80 transition-opacity uppercase tracking-tighter"
        >
          <Trophy size={30} className="text-bingo-red" />
          <span>Event Bingo</span>
        </Link>
      </div>

      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={30} /> : <Menu size={30} />}
      </button>

      <ul
        className={`
                ${isOpen ? "flex" : "hidden"} 
                md:flex flex-col md:flex-row 
                absolute md:static 
                top-full left-0 w-full md:w-auto 
                bg-bingo-dark md:bg-transparent 
                p-6 md:p-0 
                space-y-4 md:space-y-0 md:space-x-4 
                items-center border-b-2 border-white md:border-none
                shadow-xl md:shadow-none
            `}
      >

        {!role && (
          <>
            {/*<li className="w-full md:w-auto">
              <Link to="/support" onClick={closeMenu} className={btnStyle}>
                <Headset size={20} /> Support
              </Link>
            </li>*/}
            <li className="w-full md:w-auto">
              <Link to="/login" onClick={closeMenu} className={btnStyle}>
                <LogIn size={20} />
                Login
              </Link>
            </li>
          </>
        )}

        {role === "user" && (
          <>
            <li className="w-full md:w-auto">
              <Link to="/profile" onClick={closeMenu} className={btnStyle}>
                <User size={20} /> Profile
              </Link>
            </li>
            <li className="w-full md:w-auto">
              <Link to="/wallet" onClick={closeMenu} className={btnStyle}>
                <Wallet size={20} /> Wallet
              </Link>
            </li>
            {/*<li className="w-full md:w-auto">
              <Link to="/support" onClick={closeMenu} className={btnStyle}>
                <Headset size={20} /> Support
              </Link>
            </li>*/}
            <li className="w-full md:w-auto">
              <button onClick={logout} className={btnStyle}>
                <LogOut size={20} /> Logout
              </button>
            </li>
          </>
        )}

        {role === "admin" && (
          <>
            <li className="w-full md:w-auto">
              <Link to="/admin" onClick={closeMenu} className={btnStyle}>
                <LayoutDashboard size={20} /> Admin Panel
              </Link>
            </li>
            <li className="w-full md:w-auto">
              <Link to="/profile" onClick={closeMenu} className={btnStyle}>
                <User size={20} /> Profile
              </Link>
            </li>
            <li className="w-full md:w-auto">
              <button onClick={logout} className={btnStyle}>
                <LogOut size={20} /> Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}