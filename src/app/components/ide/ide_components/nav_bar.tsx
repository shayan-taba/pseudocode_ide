// components/NavBar.tsx
import React from "react";
import {
  HomeIcon,
  EyeSlashIcon,
  EyeIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const router = useRouter();
  return (
    <nav className="flex items-center justify-between text-white h-[2rem] mx-5 mt-5">
      <button
            onClick={() => router.push("/challenges")}
            className="nav-btns"
          >
            <HomeIcon className="nav-icons" />
          </button>
    </nav>
  );
};

export default Navbar;
