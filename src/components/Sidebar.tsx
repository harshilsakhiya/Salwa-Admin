import clsx from "clsx";
import { NavLink } from "react-router-dom";
import type { FC } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Analysis", href: "/dashboard", icon: "/theme-icons/analysis.png" },
  { label: "Services Dashboard", href: "/service-dashboard", icon: "/theme-icons/providers.png" },
  { label: "Reports", href: "/reports", icon: "/theme-icons/report.png" },
  { label: "Statement of All Wallet", href: "/statement-analysis", icon: "/theme-icons/wallet.png" },
  { label: "List of Subscribers", href: "/subscribers", icon: "/theme-icons/subscription-details.png" },
  { label: "List of Agents", href: "/agents", icon: "/theme-icons/employee-database.png" },
  { label: "Promocode Settings", href: "/promocode-settings", icon: "/theme-icons/invoice.png" },
  { label: "Non Medical Companies", href: "/non-medical-companies", icon: "/theme-icons/providers.png" },
  { label: "Subscription Settings", href: "/subscription-settings", icon: "/theme-icons/subscription-details.png" },
  { label: "Service Management", href: "/service-management", icon: "/theme-icons/orders-icon.png" },
  { label: "Supervisor / Employee Management", href: "/supervisor-management", icon: "/theme-icons/messages.png" },
  { label: "Employee & Category Assignment", href: "/employee-category", icon: "/theme-icons/requests.png" },
  { label: "Advanced Options", href: "/advanced-options", icon: "/theme-icons/settings.png" },
];

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[linear-gradient(180deg,#0D0D78_0%,#05055C_100%)] text-white transition-transform duration-300 ease-in-out shadow-[12px_0_40px_rgba(5,6,104,0.25)] lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-24 items-center px-6">
          <div className="w-full rounded-2xl bg-white/10 px-4 py-3 shadow-inner backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-primary">
                <img src="/theme-icons/salwa_icon.svg" alt="Salwa" className="h-8 w-8" />
              </div>
              <div>
                <p className="text-lg font-helveticaBold">Salwa</p>
                <p className="text-xs font-textMedium text-white/70">Control center</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="sidebar-scroll flex-1 overflow-y-auto px-4 pb-10">
          <ul className="space-y-1.5">
            {menuItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    clsx(
                      "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-textMedium transition",
                      "text-white/70 hover:bg-white/15 hover:text-white",
                      isActive && "bg-white text-primary"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={clsx(
                          "grid h-10 w-10 place-items-center rounded-xl border transition",
                          isActive ? "border-transparent bg-white" : "border-white/15 bg-white/15 group-hover:border-white/30 group-hover:bg-white"
                        )}
                      >
                        <img
                          src={item.icon}
                          alt=""
                          className={clsx(
                            "h-5 w-5 transition",
                            isActive ? "filter brightness-0" : ""
                          )}
                        />
                      </span>
                      <span className={clsx("transition", isActive ? "text-primary group-hover:text-white" : "text-white/70 group-hover:text-white")}>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
