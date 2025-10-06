import DashboardLayout from "../layouts/DashboardLayout";

const rows = [
  { period: "Jan 2025", revenue: "240k SAR", expenses: "120k SAR", variance: "+120k SAR" },
  { period: "Feb 2025", revenue: "220k SAR", expenses: "130k SAR", variance: "+90k SAR" },
  { period: "Mar 2025", revenue: "260k SAR", expenses: "140k SAR", variance: "+120k SAR" },
];

const StatementAnalysis = () => (
  <DashboardLayout>
    <div className="mx-auto flex w-full  flex-col gap-8 pb-3">
      <Header />
      <section className="space-y-6 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
        <div className="rounded-[28px] border border-gray-200 bg-[#f6f7fb] px-6 py-10 text-center text-sm text-gray-500">
          Financial overview chart placeholder
        </div>
        <div className="overflow-hidden rounded-[28px] border border-gray-200">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#f7f8fd] text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              <tr>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Expenses</th>
                <th className="px-6 py-4">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {rows.map((row) => (
                <tr key={row.period}>
                  <td className="px-6 py-4 font-medium text-primary">{row.period}</td>
                  <td className="px-6 py-4">{row.revenue}</td>
                  <td className="px-6 py-4">{row.expenses}</td>
                  <td className="px-6 py-4 text-green-600">{row.variance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </DashboardLayout>
);

const Header = () => (
  <div className="flex items-center gap-4 rounded-[28px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
    <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className="h-10 w-10" fill="#050668">
        <path d="M18 48h6V24h-6Zm15 0h6V30h-6Zm15-24v24h6V24Z" />
      </svg>
    </div>
    <div>
      <h1 className="text-2xl font-semibold text-primary">Statement of Analysis</h1>
      <p className="text-sm text-gray-400">Compare revenue trends versus spending</p>
    </div>
  </div>
);

export default StatementAnalysis;
