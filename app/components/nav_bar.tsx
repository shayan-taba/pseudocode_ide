import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  DocumentTextIcon,
  CircleStackIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import "./components_style.css";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Tracks mobile menu toggle

  const navItems = [
    { href: "/", label: "Home", icon: <HomeIcon className="nav-icons" /> },
    { href: "/documentation", label: "Documentation", icon: <DocumentTextIcon className="nav-icons" /> },
    { href: "/data", label: "Manage Data", icon: <CircleStackIcon className="nav-icons" /> },
  ]; // All pages

  return (
    <nav className="bg-slate-900 text-white rounded-md outline outline-white mx-5 mt-5 p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">Pseudocode Challenge</div>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className={`flex items-center gap-2 nav-btns ${
                pathname === item.href ? "underline underline-offset-4" : ""
              }`} // Underline the current page
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile nav menu */}
      {isOpen && (
        <div className="flex flex-col mt-4 gap-4 md:hidden">
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              onClick={() => setIsOpen(false)} // Close menu after clicking
              className={`flex items-center gap-2 nav-btns ${
                pathname === item.href ? "underline underline-offset-4" : ""
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
