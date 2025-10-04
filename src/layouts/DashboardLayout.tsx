import { useState, type FC, type ReactNode } from "react";
import Header from "../components/Header";
import ProfileModal from "../components/ProfileModal";
import Sidebar from "../components/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[#f5f6fb] text-gray-900">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        <Header onToggleSidebar={toggleSidebar} onOpenProfile={() => setIsProfileOpen(true)} />
        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12">{children}</main>
      </div>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
