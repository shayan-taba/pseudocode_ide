import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, DocumentTextIcon, CircleStackIcon } from "@heroicons/react/24/solid";
import "./components_style.css";

const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/challenges", label: "Home", icon: <HomeIcon className="nav-icons" /> },
    { href: "/documentation", label: "Documentation", icon: <DocumentTextIcon className="nav-icons" /> },
    { href: "/data", label: "Manage Data", icon: <CircleStackIcon className="nav-icons" /> },
  ];

  return (
    <nav className="flex items-center gap-12 text-white h-[2rem] mx-5 mt-5 bg-slate-900 rounded-md outline outline-white p-6">
      {navItems.map((item) => (
        <Link
          href={item.href}
          key={item.href}
          className={`flex items-center gap-2 nav-btns ${
            pathname === item.href ? "underline underline-offset-4" : ""
          }`}
        >
          {item.icon} {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;

// add underline to current page. identify by slug or by param.

