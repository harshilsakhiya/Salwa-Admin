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
    <div
      className="w-full flex transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Mobile backdrop overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Sticky */}
      <div className="sticky top-0 !h-[calc(100vh-24px)] z-30 lg:m-3">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Right content area */}
      <div
        className="salva-right-desh-part-main w-full flex flex-col overflow-hidden"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Header section - Sticky */}
        <div className="sticky top-0 z-20 flex-shrink-0 p-2" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="lg:salva-right-desh-head-search-profile-and-noti ml-auto flex flex-wrap gap-2 sm:gap-3 lg:gap-4 max-[767px]:w-full mb-2 w-full">
            <Header
              onToggleSidebar={toggleSidebar}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          </div>
        </div>

        {/* Main content area - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden main-content-scroll px-2 sm:px-3 lg:px-3">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>

      {/* Profile modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
