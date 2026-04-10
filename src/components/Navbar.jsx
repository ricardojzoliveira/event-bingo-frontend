import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Trophy, Headset, LogIn, User, Wallet, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
    const [role, setRole] = useState(null);

    const navigate = useNavigate();

    const toggleRole = () => {
        if (role === null) setRole("user");
        else if (role === "user") setRole("admin");
        else setRole(null);
    };

    const handleLogout = () => {
        setRole(null);
        navigate('/');
    };
        

    const btnStyle = "bg-bingo-red text-bingo-dark font-bold py-2 px-4 rounded-lg hover:brightness-110 flex items-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap";

    return (
        <nav className="bg-bingo-dark text-white px-6 py-4 flex justify-between items-center shadow-md border-b-2 border-white">

            <div className="flex items-center gap-6">
                <Link
                    to="/"
                    className="text-2xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <Trophy size={30} className="text-bingo-red"/>
                    <span>Event Bingo</span>
                </Link>

                <button
                    onClick={toggleRole}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-600 text-slate-400 uppercase tracking-wider"
                >
                    Estado: <span className="text-yellow-400 font-mono">{role || "Visitante"}</span>
                </button>
            </div>

            <ul className="hidden md:flex space-x-4 items-center">

                {!role && (
                    <>
                        <li>
                            <Link to="/support" className={btnStyle}>
                                <Headset size={20} />
                                Support
                            </Link>
                        </li>
                        <li>
                            <button onClick={() => setRole("user")} className={btnStyle}>
                                <LogIn size={20} />
                                Login
                            </button>
                        </li>
                    </>
                )}

                {role === "user" && (
                    <>
                        <li>
                            <Link to="/profile" className={btnStyle}>
                                <User size={20} />
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/support" className={btnStyle}>
                                <Headset size={20} />
                                Support
                            </Link>
                        </li>
                        <li>
                            <Link to="/wallet" className={btnStyle}>
                                <Wallet size={20} />
                                Wallet
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className={btnStyle}>
                                <LogOut size={20} />
                                Logout
                            </button>
                        </li>
                    </>
                )}

                {role === "admin" && (
                    <>
                        <li>
                            <Link to="/profile" className={btnStyle}>
                                <User size={20} />
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin" className={btnStyle}>
                                <LayoutDashboard size={20} />
                                Admin Panel
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className={btnStyle}>
                                <LogOut size={20} />
                                Logout
                            </button>
                        </li>
                    </>
                )}

            </ul>
        </nav>
    );
}