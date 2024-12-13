// components/NavBar.tsx
import React from "react";
import { HomeIcon, DocumentTextIcon, CircleStackIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import "./components_style.css";

const Navbar: React.FC = ({}) => {
  const router = useRouter();
  return (
    <nav className="flex items-center gap-12 text-white h-[2rem] mx-5 mt-5 bg-slate-900 rounded-md outline outline-white p-6">
      <button onClick={() => router.push("/challenges")} className="nav-btns">
        <HomeIcon className="nav-icons" /> Home
      </button>
      <button onClick={() => router.push("/challenges")} className="nav-btns">
        <DocumentTextIcon className="nav-icons" /> Documentation
      </button>
      <button onClick={() => router.push("/challenges")} className="nav-btns">
        <CircleStackIcon className="nav-icons" /> Manage Data
      </button>
    </nav>
  );
};

// add underline to current page. identify by slug or by param.

export default Navbar;
