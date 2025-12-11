import React from "react";
import { NavLink } from "react-router"; // তুমি আগে react-router ব্যবহার করোলে ঠিক আছে

const Navbar = () => {
    const menuItems = (
        <>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-colors duration-200 ${isActive ? "bg-primary text-white shadow-md" : "text-base-content/90"
                        }`
                    }
                >
                    Home
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-colors duration-200 ${isActive ? "bg-primary text-white shadow-md" : "text-base-content/90"
                        }`
                    }
                >
                    About
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg transition-colors duration-200 ${isActive ? "bg-primary text-white shadow-md" : "text-base-content/90"
                        }`
                    }
                >
                    Contact
                </NavLink>
            </li>
        </>
    );

    return (
        <header className="w-full">
            <nav
                className="
          mx-auto md:max-w-7xl
          rounded-2xl md:rounded-4xl
          mt-2 md:mt-4
          px-4 py-3
          flex items-center justify-between gap-4
          backdrop-blur-lg bg-white/40 dark:bg-gray-400
          border border-white/10 dark:border-gray-700/40
          shadow
          transition-all duration-300
        "
            >
                <div className="flex items-center gap-3">
                    <div className="lg:hidden">
                        <label htmlFor="nav-toggle" className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>
                    </div>

                    <a className="text-lg font-bold btn btn-ghost normal-case">MyGlassSite</a>
                </div>

                <div className="hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-2 bg-transparent">{menuItems}</ul>
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn btn-sm btn-primary rounded-lg">Login</button>
                </div>
            </nav>

            <input type="checkbox" id="nav-toggle" className="hidden" />
            <div className="lg:hidden">
                <div
                    className="
            p-3 mt-2 mx-4 rounded-xl
            backdrop-blur-lg bg-white/35 dark:bg-gray-900/25
            border border-white/10 dark:border-gray-700/40
            shadow-inner
          "
                >
                    <ul className="menu menu-compact">{menuItems}</ul>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
