// src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../Providers/AuthContext";
import useRole from "../Hooks/useRole";

/* --- Framer Motion variants --- */
const navVariants = {
    hidden: { opacity: 0, y: -12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 120, damping: 14, when: "beforeChildren" },
    },
};


const itemVariants = {
    hidden: { opacity: 0, y: -6 },
    visible: (i = 1) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } }),
};

const Navbar = () => {
    const navigate = useNavigate();
    const { user, LogOut } = useContext(AuthContext); 
    const [open, setOpen] = useState(false);
    const {role}=useRole()

    const navLinkClasses = ({ isActive }) =>
        `px-4 py-2 rounded-lg relative transition-all duration-300 overflow-hidden
      ${isActive ? "bg-primary text-white shadow-lg shadow-primary/50" : "text-base-content/80"}
      group`;

    const menuItems = [
        { to: "/", label: "Home" },
        { to: "/tutions", label: "Tutions" },
        { to: "/tutors", label: "Tutors" },
    ];


    const handleLogOut = async () => {
        try {
            await LogOut(); 
            navigate("/"); 
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <header className="w-full">
            {/* motion.nav with glass classes; we also add a custom class nav-glass for extra CSS animation */}
            <motion.nav
                initial="hidden"
                animate="visible"
                variants={navVariants}
                className={
                    "nav-glass mx-auto md:max-w-7xl rounded-2xl md:rounded-3xl mt-3 md:mt-5 px-4 py-3 flex items-center justify-between gap-4 backdrop-blur-xl bg-white/16 dark:bg-gray-800/28 border border-white/12 dark:border-gray-700/40 shadow-xl shadow-black/6 transition-all duration-500"
                }
            >
                {/* subtle moving gradient overlay (shimmer) is implemented via a child span */}
                <span aria-hidden className="glass-shimmer pointer-events-none" />

                {/* left: brand + mobile toggle */}
                <div className="flex items-center gap-3 relative z-10">
                    <button
                        onClick={() => setOpen((s) => !s)}
                        aria-label="menu"
                        className="lg:hidden btn btn-ghost btn-circle"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <Link to={'/'}>
                        <img
                            className="w-10 rounded-full shadow-lg"
                            src="https://images-platform.99static.com/DVETQ4KXxNUWF1Q-k4ASnnzl9LY=/112x112:2365x2365/fit-in/99designs-work-samples/work-sample-designs/1039810/842795fa-0320-4287-baac-22e221a46d34"
                            alt="Tutor OWL Logo"
                        /></Link>

                    <Link to="/" className="text font-black text-xl normal-case tracking-wider text-base-content/90">
                        Tutor <span className="text-primary">OWL</span>
                    </Link>
                </div>

                {/* center: desktop menu */}
                <div className="hidden lg:flex relative z-10">
                    <ul className="menu menu-horizontal px-1 gap-2 bg-transparent flex items-center">
                        {menuItems.map((item, idx) => (
                            <motion.li
                                key={item.to}
                                custom={idx}
                                initial="hidden"
                                animate="visible"
                                variants={itemVariants}
                                className="relative"
                            >
                                <NavLink to={item.to} className={navLinkClasses}>
                                    <motion.span className="relative z-10" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                                        {item.label}
                                    </motion.span>

                                    {/* animated subtle underline (scaleX on hover) */}
                                    <motion.span
                                        className="absolute left-0 bottom-0 h-0.5 w-full bg-white/20 rounded-sm"
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.35 }}
                                        style={{ transformOrigin: "left" }}
                                    />
                                </NavLink>
                            </motion.li>
                        ))}

                        {user && (
                            <motion.li initial="hidden" animate="visible" variants={itemVariants} className="relative">
                                <NavLink to="/dashboard/" className={navLinkClasses}>
                                    <span className="relative z-10">Dashboard</span>
                                </NavLink>
                            </motion.li>
                        )}



                        {user && role === "student" && (
                            <motion.li
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <NavLink
                                    to="/apply-tutor"
                                    className="block px-4 py-2 rounded-lg text-base-content/90"
                                    onClick={() => setOpen(false)}
                                >
                                    Be a Tutor
                                </NavLink>
                            </motion.li>
                        )}

                        
                    </ul>
                </div>

                {/* right: actions */}
                <div className="relative z-10">
                    {user ? (
                        /* User area: avatar + name + logout */
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">
                                <Link to={'/updateUserProfile'}>
                                    <img
                                        src={user.photoURL || "https://placehold.co/40x40?text=U"}
                                        alt={user.displayName || "User"}
                                        onError={(e) => (e.currentTarget.src = "https://placehold.co/40x40?text=U")}
                                        className="w-14 h-14 rounded-full object-cover border"
                                    />
                                </Link>
                                <div className="hidden sm:flex flex-col">
                                    <span className="text-sm font-medium">{user.displayName || (user.email ? user.email.split("@")[0] : "User")}</span>
                               
                                </div>
                            </div>

                            <motion.button
                                onClick={handleLogOut}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn btn-sm bg-red-600 text-white rounded-xl shadow-lg shadow-primary/30 transition-all duration-300"
                            >
                                Logout
                            </motion.button>

                        </div>
                    ) : (
                        <Link to={"/login"}>
                            <div className="flex items-center gap-3">
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn btn-sm btn-primary rounded-xl shadow-lg shadow-primary/30 transition-all duration-300">
                                    Login / Register
                                </motion.button>
                            </div>
                        </Link>
                    )}
                </div>
            </motion.nav>

            {/* mobile menu: animated drawer */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ type: "spring", stiffness: 260, damping: 28 }}
                        className="lg:hidden"
                    >
                        <div className="p-3 mt-2 mx-4 rounded-xl backdrop-blur-xl bg-white/40 dark:bg-gray-700/50 border border-white/50 dark:border-gray-500/60 shadow-lg">
                            <ul className="menu menu-compact flex flex-col gap-2">
                                {menuItems.map((item, idx) => (
                                    <motion.li key={item.to} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}>
                                        <NavLink
                                            to={item.to}
                                            className={({ isActive }) => `block px-4 py-2 rounded-lg transition-colors duration-200 ${isActive ? "bg-primary text-white" : "text-base-content/90"}`}
                                            onClick={() => setOpen(false)}
                                        >
                                            {item.label}
                                        </NavLink>
                                    </motion.li>

                                ))}

                                {user && (
                                    <motion.li initial="hidden" animate="visible" variants={itemVariants} className="relative">
                                        <NavLink to="/dashboard" className={navLinkClasses}>
                                            <span className="relative z-10">Dashboard</span>
                                        </NavLink>
                                    </motion.li>

                                )}
                                {user && role === "student" && (
                                    <motion.li
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <NavLink
                                            to="/apply-tutor"
                                            className={({ isActive }) =>
                                                `block px-4 py-2 rounded-lg transition-colors duration-200 ${isActive ? "bg-primary text-white" : "text-base-content/90"
                                                }`
                                            }
                                            onClick={() => setOpen(false)}
                                        >
                                            Be a Tutor
                                        </NavLink>
                                    </motion.li>
                                )}


                                
                                {/* add auth actions in mobile menu */}
                                <li className="mt-2">
                                    {user ? (
                                        <button onClick={handleLogOut} className="w-full btn btn-ghost">
                                            Logout
                                        </button>
                                    ) : (
                                        <NavLink to="/login" className="w-full btn btn-primary">
                                            Login / Register
                                        </NavLink>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Inline CSS for shimmer + subtle pulse. Move to global CSS if you prefer */}
            <style>{`
        /* glass container extra styling */
        .nav-glass {
          position: relative;
          overflow: visible;
        }

        /* moving gradient shimmer */
        .glass-shimmer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(120deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.00) 100%);
          transform: translateX(-40%);
          filter: blur(8px);
          opacity: 0.9;
          mix-blend-mode: overlay;
          animation: shimmer 6s linear infinite;
          border-radius: inherit;
        }

        @keyframes shimmer {
          0% { transform: translateX(-40%) scale(1.02); opacity: 0.6; }
          50% { transform: translateX(40%) scale(1.03); opacity: 0.85; }
          100% { transform: translateX(-40%) scale(1.02); opacity: 0.6; }
        }

        /* subtle pulse of border & shadow to give life */
        .nav-glass {
          animation: glassPulse 10s ease-in-out infinite;
        }

        @keyframes glassPulse {
          0% { box-shadow: 0 10px 30px rgba(2,6,23,0.06); border-color: rgba(255,255,255,0.10); }
          50% { box-shadow: 0 18px 50px rgba(2,6,23,0.08); border-color: rgba(255,255,255,0.08); }
          100% { box-shadow: 0 10px 30px rgba(2,6,23,0.06); border-color: rgba(255,255,255,0.10); }
        }

        /* make sure buttons and links sit above shimmer */
        .nav-glass > .relative,
        .nav-glass .btn,
        .nav-glass a,
        .nav-glass .menu {
          position: relative;
          z-index: 10;
        }

        /* tiny floating effect for desktop only (soft transform) */
        @media (min-width: 1024px) {
          .nav-glass {
            transform-origin: center;
            animation: glassPulse 10s ease-in-out infinite, floatY 8s ease-in-out infinite;
          }

          @keyframes floatY {
            0% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
            100% { transform: translateY(0); }
          }
        }
      `}</style>
        </header>
    );
};

export default Navbar;
