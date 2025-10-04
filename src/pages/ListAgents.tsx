import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import type { AgentRow, TabKey } from "../data/agents";
import { businessAgents, individualAgents } from "../data/agents";

const stats: Record<TabKey, { value: string; title: string }[]> = {
  individual: [
    { value: "244", title: "Active Agents" },
    { value: "22", title: "Inactive Agents" },
    { value: "266", title: "Total Salwa Agents" },
  ],
  business: [
    { value: "310", title: "Active Agents" },
    { value: "18", title: "Inactive Agents" },
    { value: "328", title: "Total Salwa Agents" },
  ],
};

const statusStyles: Record<AgentRow["status"], string> = {
  Active: "bg-[#e9fbf3] text-[#09a66d]",
  Inactive: "bg-[#fff1f0] text-[#e23939]",
  "On Hold": "bg-[#fff7e6] text-[#b46a02]",
};

const data: Record<TabKey, AgentRow[]> = {
  individual: individualAgents,
  business: businessAgents,
};

const pageSize = 10;

const ListAgents = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("individual");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rows = data[activeTab];

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const query = searchTerm.trim().toLowerCase();
    return rows.filter((row) =>
      [row.id, row.name, row.code, row.email, row.city, row.region].some((field) =>
        field.toLowerCase().includes(query)
      )
    );
  }, [rows, searchTerm]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, pageCount);
  const paginatedRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handleView = (row: AgentRow) => {
    const slug = encodeURIComponent(row.id.replace(/#/g, ""));
    navigate(`/agents/${activeTab}/${slug}`);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-16">
        <section className="space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-primary">List of Agents</h1>
              <p className="text-sm text-gray-500">Monitor field agents performance and availability.</p>
            </div>
            <button className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#030447]">
              Export
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 rounded-full bg-slate-100 p-1 text-sm font-textMedium text-gray-600">
              <TabButton label="Individual" isActive={activeTab === "individual"} onClick={() => handleTabChange("individual")}
              />
              <TabButton label="Business" isActive={activeTab === "business"} onClick={() => handleTabChange("business")} />
            </div>
            <div className="relative w-full max-w-xs">
              <input
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search"
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 pl-11 text-sm text-gray-600 shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
                <SearchIcon />
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats[activeTab].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-card">
                <p className="text-3xl font-helveticaBold text-primary">{item.value}</p>
                <p className="mt-2 text-xs font-textMedium uppercase tracking-[0.18em] text-gray-500">{item.title}</p>
              </div>
            ))}
          </div>

          <ChartPlaceholder />

          <div className="rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-[1180px] w-full text-left text-sm text-gray-600">
                <thead className="bg-slate-100 text-xs font-textMedium uppercase tracking-[0.18em] text-gray-500">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">ID No</th>
                    <th className="px-4 py-3 whitespace-nowrap">Agent Name</th>
                    <th className="px-4 py-3 whitespace-nowrap">Agent Code</th>
                    <th className="px-4 py-3 whitespace-nowrap">Email</th>
                    <th className="px-4 py-3 whitespace-nowrap">Phone Number</th>
                    <th className="px-4 py-3 whitespace-nowrap">Country</th>
                    <th className="px-4 py-3 whitespace-nowrap">Region</th>
                    <th className="px-4 py-3 whitespace-nowrap">City</th>
                    <th className="px-4 py-3 whitespace-nowrap text-center">Status</th>
                    <th className="px-4 py-3 whitespace-nowrap text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {paginatedRows.map((row) => (
                    <tr key={`${activeTab}-${row.id}`}>
                      <td className="px-4 py-3 whitespace-nowrap font-helveticaBold text-primary">{row.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{row.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.code}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.country}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.region}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">{row.city}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-semibold ${statusStyles[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-3">
                          <ActionButton label="View" variant="view" onClick={() => handleView(row)}>
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

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
            <p>
              Showing data {filteredRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1} to {Math.min(safePage * pageSize, filteredRows.length)} of {filteredRows.length} entries
            </p>
            <div className="flex items-center gap-2">
              <PaginationButton disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>
                Previous
              </PaginationButton>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                <PaginationButton key={page} isActive={page === safePage} onClick={() => setCurrentPage(page)}>
                  {page}
                </PaginationButton>
              ))}
              <PaginationButton disabled={safePage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}>
                Next
              </PaginationButton>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

const TabButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
      isActive ? "bg-white text-primary shadow" : "text-gray-400 hover:text-primary"
    }`}
  >
    {label}
  </button>
);

const ChartPlaceholder = () => (
  <div className="rounded-[24px] border border-gray-200 bg-[#f6f7fb] px-6 py-10 text-center text-sm text-gray-500">
    Analytics chart placeholder
  </div>
);

const ActionButton = ({ label, variant, children, onClick }: { label: string; variant: "view" | "edit" | "delete"; children: ReactNode; onClick?: () => void }) => {
  const styles: Record<"view" | "edit" | "delete", string> = {
    view: "bg-[#eff2f9] text-[#1d1f2a] border border-transparent hover:bg-white hover:border-primary/40 hover:shadow-md",
    edit: "bg-white text-[#1d1f2a] border border-gray-200 hover:border-primary hover:text-primary",
    delete: "bg-[#ff4d4f] text-white border border-transparent hover:bg-[#e34040]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 shadow-sm ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

const PaginationButton = ({ children, isActive, disabled, onClick }: { children: ReactNode; isActive?: boolean; disabled?: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`min-w-[40px] rounded-full border px-3 py-1 text-sm font-semibold transition ${
      disabled
        ? "cursor-not-allowed border-gray-200 text-gray-300"
        : isActive
        ? "border-primary bg-primary text-white"
        : "border-gray-200 text-gray-500 hover:border-primary hover:text-primary"
    }`}
  >
    {children}
  </button>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 20l-3-3" />
  </svg>
);

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

export default ListAgents;



