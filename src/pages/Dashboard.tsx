import type { ReactNode } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const CurrencyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M11 4a1 1 0 1 1 2 0v1h3a1 1 0 1 1 0 2h-3v3h3a1 1 0 1 1 0 2h-3v3h3a1 1 0 1 1 0 2h-3v1a1 1 0 1 1-2 0v-1H8a1 1 0 1 1 0-2h3v-3H8a1 1 0 1 1 0-2h3V7H8a1 1 0 1 1 0-2h3V4Z" />
  </svg>
);

const PendingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 11h-3a1 1 0 0 1 0-2h2V7a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1Z" />
  </svg>
);

type FilterConfig = {
  label: string;
  options: string[];
};

type StatCard = {
  title: string;
  value: string;
  icon?: ReactNode;
};

const subscriptionFilters: FilterConfig[] = [
  { label: "User Type", options: ["All", "Individual", "Corporate"] },
  { label: "Month", options: ["Jan", "Feb", "Mar"] },
  { label: "Year", options: ["2025", "2024", "2023"] },
];

const userFilters: FilterConfig[] = [
  { label: "User Type", options: ["All", "New", "Returning"] },
  { label: "Month", options: ["Jan", "Feb", "Mar"] },
  { label: "Year", options: ["2025", "2024", "2023"] },
];

const serviceFilters: FilterConfig[] = [
  { label: "Insurance Type", options: ["All", "Premium", "Basic"] },
  { label: "Service", options: ["All", "Telehealth", "On-site"] },
  { label: "Sub-type", options: ["All", "Standard", "Custom"] },
  { label: "Branch", options: ["All", "Riyadh", "Jeddah"] },
  { label: "Year", options: ["2025", "2024"] },
];

const subscriptionCards: StatCard[] = [
  { title: "Number of Active Users", value: "244" },
  { title: "Number of Active Subscribers", value: "22" },
  { title: "Total Subscription Revenue", value: "266", icon: <CurrencyIcon /> },
];

const userCards: StatCard[] = [
  { title: "Number of New Users", value: "244" },
  { title: "Number of Active Users", value: "22" },
  { title: "Number of Pending Users", value: "266", icon: <PendingIcon /> },
];

const serviceCards: StatCard[] = [
  { title: "Number of Orders", value: "244" },
  { title: "Number of Completed Orders", value: "22" },
  { title: "Number of Pending Orders", value: "266" },
  { title: "Total Revenue Amount", value: "244", icon: <CurrencyIcon /> },
  { title: "Total Commission Amount", value: "22", icon: <CurrencyIcon /> },
  { title: "Total Payment Gateway Amount", value: "266", icon: <CurrencyIcon /> },
];

const insuranceFilters: FilterConfig[] = [
  { label: "Month", options: ["Jan", "Feb", "Mar"] },
  { label: "Year", options: ["2025", "2024", "2023"] },
];

const insuranceCards: StatCard[] = [
  { title: "Total Appointment Booked", value: "244" },
  { title: "Total Insurance", value: "22" },
  { title: "Total Successful Bookings", value: "266" },
  { title: "Total Cancel Appointment", value: "244" },
  { title: "Total Insurance Claimed", value: "22" },
  { title: "Total Unpaid Deductions", value: "164" },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-16">
        <AnalysisHero />
        <Section title="Subscription Statistics" filters={subscriptionFilters} cards={subscriptionCards} />
        <Section title="User Statistics" filters={userFilters} cards={userCards} />
        <Section title="Service Statistics" filters={serviceFilters} cards={serviceCards} />
        <Section
          title="Insurance Statistics"
          filters={insuranceFilters}
          cards={insuranceCards}
          footer={
            <div className="rounded-[28px] border border-dashed border-gray-300 bg-[#f6f7fb] px-6 py-12 text-center text-sm text-gray-500">
              Analytics chart placeholder
            </div>
          }
        />
      </div>
    </DashboardLayout>
  );
};

interface SectionProps {
  title: string;
  filters: FilterConfig[];
  cards: StatCard[];
  footer?: ReactNode;
}

const Section = ({ title, filters, cards, footer }: SectionProps) => {
  return (
    <section className="space-y-6 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
        <button
          type="button"
          className="rounded-full border border-gray-200 px-6 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:text-primary"
        >
          Export
        </button>
      </header>
      {filters.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filters.map((filter) => (
            <div key={filter.label} className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                {filter.label}
              </label>
              <div className="relative">
                <select className="w-full appearance-none rounded-full border border-gray-200 bg-white px-5 py-3 text-sm text-gray-600 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {filter.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-gray-100 bg-[#f7f8fd] px-6 py-8 text-center shadow-[0_20px_40px_rgba(5,6,104,0.08)]"
          >
            {card.icon && <span className="text-primary">{card.icon}</span>}
            <p className="text-4xl font-semibold text-primary">{card.value}</p>
            <p className="text-sm text-gray-500">{card.title}</p>
          </article>
        ))}
      </div>
      {footer}
    </section>
  );
};

const AnalysisHero = () => (
  <div className="flex items-center gap-4 rounded-[28px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
    <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className="h-10 w-10">
        <path
          d="M52.5 10a13.5 13.5 0 0 0-10.1 4.6L36 22.1l-6.4-7.5A13.5 13.5 0 0 0 9.5 29.3c0 12 11.7 21.2 24.6 32.5l1.9 1.7 1.9-1.7c12.9-11.3 24.6-20.5 24.6-32.5A13.5 13.5 0 0 0 52.5 10Z"
          fill="#050668"
        />
        <path d="M31.1 37.6 26 32.4l3.1-3.1 2.1 2.1 7.4-7.4 3.1 3.1-9.5 10.5Z" fill="#ffffff" />
      </svg>
    </div>
    <div>
      <h1 className="text-2xl font-semibold text-primary">Analysis</h1>
      <p className="text-sm text-gray-400">Overview dashboard</p>
    </div>
  </div>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.171l3.71-3.94a.75.75 0 0 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

export default Dashboard;
