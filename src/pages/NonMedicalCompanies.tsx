import type { ReactNode } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

type CompanyRow = {
  id: string;
  name: string;
  subscription: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  amount: string;
  country: string;
  region: string;
  city: string;
  district: string;
  status: "Active" | "Inactive";
};

const stats = [
  { label: "Total Business", value: "244" },
  { label: "Total Unique B2B Query", value: "22" },
  { label: "Total B2B Query", value: "266" },
];

const rows: CompanyRow[] = [
  {
    id: "#0003",
    name: "Kings Hospital",
    subscription: "Free",
    subscriptionStart: "15/06/2025",
    subscriptionEnd: "15/06/2025",
    amount: "-",
    country: "Saudi Arabia",
    region: "Region 1",
    city: "City 1",
    district: "District 1",
    status: "Active",
  },
  {
    id: "#0023",
    name: "Kings Hospital",
    subscription: "1 Year",
    subscriptionStart: "15/06/2025",
    subscriptionEnd: "15/06/2026",
    amount: "2300",
    country: "Saudi Arabia",
    region: "Region 2",
    city: "City 2",
    district: "District 1",
    status: "Inactive",
  },
];

const NonMedicalCompanies = () => {
  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-16">
        <section className="space-y-8 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Services</p>
              <h1 className="text-3xl font-semibold text-primary">Non Medical Companies</h1>
            </div>
            <button className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#030447]">
              Export
            </button>
          </div>

          <div className="rounded-[28px] border border-gray-200 bg-[#f7f8fd] px-6 py-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-primary">Non Medical Companies</h2>
                <p className="text-sm text-gray-500">Overview of non-medical partners and their subscription details.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-white/60 bg-white px-6 py-6 text-center shadow">
                  <p className="text-3xl font-semibold text-primary">{item.value}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
            <ChartPlaceholder />
          </div>

          <div className="rounded-[28px] border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-[1180px] w-full text-left text-[11px] tracking-[0.18em] text-gray-600">
                <thead className="bg-[#f6f7fb] text-xs font-semibold uppercase text-gray-400">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">SO NO</th>
                    <th className="px-4 py-3 whitespace-nowrap">BUSINESS NAME</th>
                    <th className="px-4 py-3 whitespace-nowrap">SUBSCRIPTION</th>
                    <th className="px-4 py-3 whitespace-nowrap">SUBSCRIPTION START DATE</th>
                    <th className="px-4 py-3 whitespace-nowrap">SUBSCRIPTION END DATE</th>
                    <th className="px-4 py-3 whitespace-nowrap">SUBSCRIPTION AMOUNT</th>
                    <th className="px-4 py-3 whitespace-nowrap">COUNTRY</th>
                    <th className="px-4 py-3 whitespace-nowrap">REGION</th>
                    <th className="px-4 py-3 whitespace-nowrap">CITY</th>
                    <th className="px-4 py-3 whitespace-nowrap">DISTRICT</th>
                    <th className="px-4 py-3 whitespace-nowrap">STATUS</th>
                    <th className="px-4 py-3 whitespace-nowrap text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white text-sm tracking-normal">
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-primary">{row.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{row.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.subscription}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.subscriptionStart}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.subscriptionEnd}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.amount}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.country}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.region}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.city}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.district}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`rounded-full px-4 py-1 text-xs font-semibold shadow-sm ${
                            row.status === "Active" ? "bg-[#20c997] text-white" : "bg-[#ff4d4f] text-white"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-3">
                          <ActionButton label="View" variant="view">
                            <ViewIcon />
                          </ActionButton>
                          <ActionButton label="Edit" variant="edit">
                            <EditIcon />
                          </ActionButton>
                          <ActionButton label="Delete" variant="delete">
                            <DeleteIcon />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

const ChartPlaceholder = () => (
  <div className="mt-6 rounded-[24px] border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-sm text-gray-500">
    Analytics chart placeholder
  </div>
);

const ActionButton = ({ label, variant, children }: { label: string; variant: "view" | "edit" | "delete"; children: ReactNode }) => {
  const styles: Record<"view" | "edit" | "delete", string> = {
    view: "bg-[#eff2f9] text-[#1d1f2a] border border-transparent hover:bg-white hover:border-primary/40 hover:shadow-md",
    edit: "bg-white text-[#1d1f2a] border border-gray-200 hover:border-primary hover:text-primary",
    delete: "bg-[#ff4d4f] text-white border border-transparent hover:bg-[#e34040]",
  };

  return (
    <button
      type="button"
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 shadow-sm ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

const ViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" />
    <circle cx="12" cy="12" r="3.5" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h4l10.5-10.5a1.5 1.5 0 0 0-2.12-2.12L6 17.88V20Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 6.5l3 3" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7V5h6v2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
  </svg>
);

export default NonMedicalCompanies;
