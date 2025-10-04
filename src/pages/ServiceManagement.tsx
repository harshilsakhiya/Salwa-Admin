import DashboardLayout from "../layouts/DashboardLayout";

const ServiceManagement = () => {
  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-16">
        <Header />
        <section className="space-y-8 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="grid gap-2">
              <h2 className="text-2xl font-semibold text-primary">Service Management</h2>
              <p className="text-sm text-gray-400">Monitor categories, services, and activity states</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-gray-200 px-6 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary">
                Slide to shutdown salwa
              </button>
              <button className="rounded-full bg-primary px-8 py-2 text-sm font-semibold text-white shadow hover:bg-[#030447]">
                Export
              </button>
            </div>
          </div>

          <StatsRow />
          <ChartPlaceholder />
          <ServiceTable />
        </section>
      </div>
    </DashboardLayout>
  );
};

const stats = [
  { label: "Total Business", value: "244" },
  { label: "Total Unique B2B Query", value: "22" },
  { label: "Total B2B Query", value: "266" },
];

const rows = [
  { category: "Insurance Services", service: "Evaluate Insurance Medical Network", subService: "-", status: "Active" },
  { category: "Rental Services", service: "Rent Medical Equipment and Facilities", subService: "-", status: "Inactive" },
  { category: "Rental Services", service: "Clinic Rental", subService: "-", status: "Active" },
  { category: "Sell Services", service: "Used Medical Devices", subService: "-", status: "Active" },
  { category: "Medical Legal Services", service: "Medical Yearly Contracts", subService: "-", status: "Active" },
  { category: "Medical Staff Services", service: "Medical Recruitment", subService: "-", status: "Inactive" },
  { category: "Health Market Place Services", service: "Office Stationary Sector", subService: "-", status: "Inactive" },
  { category: "Health Market Place Services", service: "Hygiene Sector", subService: "-", status: "Active" },
  { category: "Health Market Place Services", service: "Uniform Clothing Sector", subService: "-", status: "Inactive" },
  { category: "Medical Real Estate Services", service: "Clinic on Work Site", subService: "Commercial Towers", status: "Inactive" },
  { category: "Medical Real Estate Services", service: "Clinic on Work Site", subService: "Construction Site", status: "Active" },
  { category: "Medical Real Estate Services", service: "Clinic on Work Site", subService: "Malls", status: "Active" },
  { category: "Medical Real Estate Services", service: "Medical Warehouses", subService: "-", status: "Active" },
  { category: "Medical Real Estate Services", service: "Rent and Sell", subService: "-", status: "Active" },
  { category: "General Services", service: "Medical Waste", subService: "-", status: "Active" },
  { category: "General Services", service: "Medical Factories", subService: "-", status: "Active" },
  { category: "General Services", service: "Medical Reports Translation", subService: "-", status: "Inactive" },
  { category: "Food Services", service: "Food Supplies", subService: "-", status: "Inactive" },
];

const StatsRow = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {stats.map((item) => (
      <div
        key={item.label}
        className="rounded-[28px] border border-gray-200 bg-[#f7f8fd] px-6 py-8 text-center shadow-[0_20px_40px_rgba(5,6,104,0.08)]"
      >
        <p className="text-4xl font-semibold text-primary">{item.value}</p>
        <p className="mt-2 text-sm text-gray-500">{item.label}</p>
      </div>
    ))}
  </div>
);

const ChartPlaceholder = () => (
  <div className="rounded-[28px] border border-gray-200 bg-[#f6f7fb] px-6 py-10 text-center text-sm text-gray-500">
    Analytics chart placeholder
  </div>
);

const ServiceTable = () => (
  <div className="overflow-hidden rounded-[28px] border border-gray-200">
    <table className="w-full text-left text-sm text-gray-600">
      <thead className="bg-[#f6f7fb] text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
        <tr>
          <th className="px-6 py-4">Categories</th>
          <th className="px-6 py-4">Service</th>
          <th className="px-6 py-4">Sub-Service</th>
          <th className="px-6 py-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        {rows.map((row) => (
          <tr key={`${row.category}-${row.service}`}>
            <td className="px-6 py-4 font-semibold text-primary">{row.category}</td>
            <td className="px-6 py-4 text-gray-700">{row.service}</td>
            <td className="px-6 py-4 text-gray-500">{row.subService}</td>
            <td className="px-6 py-4">
              <span
                className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-semibold ${
                  row.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {row.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Header = () => (
  <div className="flex items-center gap-4 rounded-[28px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
    <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary">
      <Icon />
    </div>
    <div>
      <h1 className="text-2xl font-semibold text-primary">Service Management</h1>
      <p className="text-sm text-gray-400">Track service categories and performance</p>
    </div>
  </div>
);

const Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className="h-10 w-10" fill="#050668">
    <path d="M36 12a3 3 0 0 0-3 3v6h-6V15a3 3 0 0 0-6 0v12H9a3 3 0 0 0 0 6h12v12H9a3 3 0 0 0 0 6h12v12a3 3 0 0 0 6 0V45h12v12a3 3 0 0 0 6 0V45h12a3 3 0 0 0 0-6H45V27h12a3 3 0 0 0 0-6H45V15a3 3 0 0 0-6 0v6h-6V15a3 3 0 0 0-3-3Z" />
  </svg>
);

export default ServiceManagement;
