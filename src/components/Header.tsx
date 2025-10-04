import { useEffect, useRef, useState, type FC } from "react";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenProfile: () => void;
}

const Header: FC<HeaderProps> = ({ onToggleSidebar, onOpenProfile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-gray-600 transition hover:border-primary hover:text-primary lg:hidden"
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div
                    className="w-fit ml-auto flex flex-wrap gap-5 max-[767px]:w-[100%] items-center">

                    <div className="w-[400px] max-[480px]:w-[100%] relative max-[767px]:w-[100%] ">
                        <input type="text" placeholder="Search here"
                            className="bg-[#ECF0F6] w-full outline-none font-medium text-[17px] px-[30px] py-[15px] rounded-full" />
                        <p
                            className="text-[#1B1787] flex w-fit h-fit items-center absolute top-0 bottom-0 right-6 m-auto text-[20px]"><i
                                className="fa-solid fa-magnifying-glass"></i></p>
                    </div>

                    <div className="w-[55px] h-[55px] rounded-[50px] bg-[#ECF0F6] relative">
                        <p className="flex items-center justify-center w-full h-full"><img
                                src="./img/header-noti.png"/></p>
                                <span className="absolute -top-1 -right-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                    </div>

                    <div className="relative inline-block text-left" ref={menuRef}>
                        <div>
                            <button type="button"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                                className="inline-flex gap-2 justify-center items-center w-full rounded-full border border-transparent shadow-sm px-4 py-2 bg-[#ECF0F6] font-medium text-[#1B1787] hover:bg-[#15159b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#15159b] hover:text-[#ffffff] transition duration-150 ease-in-out"
                                id="menu-button" aria-expanded="true" aria-haspopup="true">
                                <img src="./img/profile-ahemda.png"/>
                                Ahmed
                                <svg className="-mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                    fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
{isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            role="menu" aria-orientation="vertical" aria-labelledby="menu-button"
                            id="dropdown-menu">
                                <button onClick={() => {
                  setIsMenuOpen(false);
                  onOpenProfile();
                }} className="text-gray-700 flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                                    role="menuitem" id="menu-item-0"><ProfileIcon /> Profile</button>
                                    <button
                                    onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                                        className="text-gray-700 items-center gap-3 w-full text-left px-4 py-2 text-sm flex hover:bg-gray-100"
                                        role="menuitem" id="menu-item-3"><LogoutIcon /> Sign out</button>
                                        
                            </div>
          )}
                      </div>

                </div>

    </header>
  );
};

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 20a6 6 0 0 1 12 0" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7L3 12l5 5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4" />
  </svg>
);

export default Header;


