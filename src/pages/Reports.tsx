import DashboardLayout from "../layouts/DashboardLayout";

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M16 13a4 4 0 1 0-4 4 4 4 0 0 0 4-4Zm6-1v2h-2a6 6 0 0 1-12 0H6v-2h2a6 6 0 0 1 12 0Z" />
  </svg>
);

const AmountIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 3a9 9 0 1 0 9 9A9.01 9.01 0 0 0 12 3Zm1 12h-2v-2H8v-2h3V9h2v2h3v2h-3Z" />
  </svg>
);

const CommissionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M4 4h16v16H4Zm4 7h8v2H8Z" />
  </svg>
);

const GatewayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M3 5h18v2H3Zm2 4h14v10H5Zm4 2v6h6v-6Z" />
  </svg>
);

const filterOptions = {
  month: ["Jan", "Feb", "Mar"],
  year: ["2025", "2024", "2023"],
  category: ["Health", "Insurance", "Corporate"],
  service: ["Telehealth", "On-site", "Lab"],
  subservice: ["All", "Premium", "Basic"],
};

const summaryCards = [
  { label: "User Count", value: "700K", icon: <UsersIcon />, color: "bg-[#eef5ff]" },
  { label: "Amount", value: "400m SAR", icon: <AmountIcon />, color: "bg-[#e9fbf3]" },
  { label: "Commission", value: "290m SAR", icon: <CommissionIcon />, color: "bg-[#f4edff]" },
  { label: "Payment Gateway", value: "50m SAR", icon: <GatewayIcon />, color: "bg-[#eef4ff]" },
];

const tableRows = [
  {
    orderNo: "#0030",
    orderTitle: "Uniform",
    purchasedBy: "Ahmed Mohammed Alsalami",
    soldBy: "AHMED1234",
    amount: "400 SAR",
    discount: "400 SAR",
    salesCommission: "400 SAR",
    paymentGateway: "400 SAR",
  },
  {
    orderNo: "#0023",
    orderTitle: "Xray Machine",
    purchasedBy: "Ahmed Mohammed Alsalami",
    soldBy: "AHMED1234",
    amount: "0 SAR",
    discount: "0 SAR",
    salesCommission: "0 SAR",
    paymentGateway: "0 SAR",
  },
  {
    orderNo: "#0045",
    orderTitle: "Land",
    purchasedBy: "Ahmed Mohammed Alsalami",
    soldBy: "AHMED1234",
    amount: "50 SAR",
    discount: "50 SAR",
    salesCommission: "50 SAR",
    paymentGateway: "50 SAR",
  },
  {
    orderNo: "#0034",
    orderTitle: "Building",
    purchasedBy: "Ahmed Mohammed Alsalami",
    soldBy: "AHMED1234",
    amount: "100 SAR",
    discount: "100 SAR",
    salesCommission: "100 SAR",
    paymentGateway: "100 SAR",
  },
];

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-16">
        <Header />
        <section className="space-y-6 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-primary">
              <ArrowUpIcon />
              <h2 className="text-2xl font-semibold">Reports</h2>
            </div>
            <button className="rounded-full border border-gray-200 px-6 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:text-primary">
              Export
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Select label="Month" options={filterOptions.month} />
            <Select label="Year" options={filterOptions.year} />
            <Select label="Category" options={filterOptions.category} />
            <Select label="Service" options={filterOptions.service} />
            <Select label="Subservice" options={filterOptions.subservice} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className={`rounded-[28px] border border-gray-100 px-6 py-5 ${card.color}`}
              >
                <div className="flex items-center gap-3 text-primary">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/70 text-primary">
                    {card.icon}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                      {card.label}
                    </p>
                    <p className="pt-1 text-lg font-semibold text-primary">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded-[28px] border border-gray-100">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-[#f6f7fb] text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                <tr>
                  <th className="px-6 py-4">Order No</th>
                  <th className="px-6 py-4">Order Title</th>
                  <th className="px-6 py-4">Purchase By / Rented By</th>
                  <th className="px-6 py-4">Sold By</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Discount Amount</th>
                  <th className="px-6 py-4">Sales Commission</th>
                  <th className="px-6 py-4">Payment Gateway Charges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-sm">
                {tableRows.map((row) => (
                  <tr key={row.orderNo}>
                    <td className="px-6 py-4 font-semibold text-primary">{row.orderNo}</td>
                    <td className="px-6 py-4 text-gray-700">{row.orderTitle}</td>
                    <td className="px-6 py-4 text-gray-500">{row.purchasedBy}</td>
                    <td className="px-6 py-4 text-gray-500">{row.soldBy}</td>
                    <td className="px-6 py-4 font-medium text-primary">{row.amount}</td>
                    <td className="px-6 py-4 text-gray-500">{row.discount}</td>
                    <td className="px-6 py-4 text-gray-500">{row.salesCommission}</td>
                    <td className="px-6 py-4 text-gray-500">{row.paymentGateway}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

const Header = () => (
  <div className="flex items-center gap-4 rounded-[28px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
    <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary">
      <ReportsIcon />
    </div>
    <div>
      <h1 className="text-2xl font-semibold text-primary">Reports</h1>
      <p className="text-sm text-gray-400">Insights and performance overview</p>
    </div>
  </div>
);

const Select = ({ label, options }: { label: string; options: string[] }) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
      {label}
    </label>
    <div className="relative">
      <select className="w-full appearance-none rounded-full border border-gray-200 bg-white px-5 py-3 text-sm text-gray-600 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
        <ChevronDownIcon />
      </span>
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

const ArrowUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M12 5l6 6m0 0-6 6m6-6H6"
      stroke="#050668"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className="h-10 w-10" fill="#050668">
    <path d="M51 10H21a4 4 0 0 0-4 4v44a4 4 0 0 0 4 4h30a4 4 0 0 0 4-4V14a4 4 0 0 0-4-4Zm-4 32H25v-4h22Zm0-10H25v-4h22Zm0-10H25v-4h22Z" />
  </svg>
);

export default Reports;
