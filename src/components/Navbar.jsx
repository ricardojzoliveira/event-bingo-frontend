import { Link } from "react-router-dom";
import Trophy from '../assets/trophy.svg';
import Loginout from '../assets/loginout.svg';
import Support from '../assets/support.svg';
import AdminPanel from '../assets/adminpanel.svg';
import Profile from '../assets/profile.svg';
import Wallet from '../assets/wallet.svg';
import { useNavigate } from "react-router-dom";

export default function Navbar({ role, setRole }) {

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
                    <img src={Trophy} alt="Trophy" className="w-8 h-8" />
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
                                <img src={Support} alt="Support" className="w-6 h-6" />
                                Support
                            </Link>
                        </li>
                        <li>
                            <button onClick={() => setRole("user")} className={btnStyle}>
                                <img src={Loginout} alt="Loginout" className="w-6 h-6" />
                                Login
                            </button>
                        </li>
                    </>
                )}

                {role === "user" && (
                    <>
                        <li>
                            <Link to="/profile" className={btnStyle}>
                                <img src={Profile} alt="Profile" className="w-6 h-6" />
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/support" className={btnStyle}>
                                <img src={Support} alt="Support" className="w-6 h-6" />
                                Support
                            </Link>
                        </li>
                        <li>
                            <Link to="/wallet" className={btnStyle}>
                                <img src={Wallet} alt="Wallet" className="w-6 h-6" />
                                Wallet
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className={btnStyle}>
                                <img src={Loginout} alt="Loginout" className="w-6 h-6" />
                                Logout
                            </button>
                        </li>
                    </>
                )}

                {role === "admin" && (
                    <>
                        <li>
                            <Link to="/profile" className={btnStyle}>
                                <img src={Profile} alt="Profile" className="w-6 h-6" />
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin" className={btnStyle}>
                                <img src={AdminPanel} alt="AdminPanel" className="w-6 h-6" />
                                Admin Panel
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className={btnStyle}>
                                <img src={Loginout} alt="Loginout" className="w-6 h-6" />
                                Logout
                            </button>
                        </li>
                    </>
                )}

            </ul>
        </nav>
    );
}