import DashboardLayout from "../layouts/DashboardLayout";

const subscribers = Array.from({ length: 12 }, (_, index) => ({
  id: `SUB-${1000 + index}`,
  name: index % 2 === 0 ? "Noor Abdullah" : "Khalid Saad",
  email: `user${index + 1}@salwa.sa`,
  plan: index % 3 === 0 ? "Premium" : index % 3 === 1 ? "Standard" : "Basic",
  status: index % 4 === 0 ? "Suspended" : "Active",
  joined: "12 Feb 2025",
}));

const ListSubscribers = () => (
  <DashboardLayout>
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-16">
      <Header />
      <section className="space-y-6 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input
            placeholder="Search subscribers"
            className="w-full max-w-sm rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button className="rounded-full border border-gray-200 px-6 py-2 text-sm font-semibold text-primary hover:border-primary">
            Export
          </button>
        </div>
        <div className="overflow-hidden rounded-[28px] border border-gray-200">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#f6f7fb] text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              <tr>
                <th className="px-6 py-4">Subscriber ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-6 py-4 font-semibold text-primary">{subscriber.id}</td>
                  <td className="px-6 py-4 text-gray-700">{subscriber.name}</td>
                  <td className="px-6 py-4 text-gray-500">{subscriber.email}</td>
                  <td className="px-6 py-4">{subscriber.plan}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-4 py-1 text-xs font-semibold ${
                        subscriber.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {subscriber.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{subscriber.joined}</td>
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
        <path d="M36 36a8 8 0 1 0-8-8 8 8 0 0 0 8 8Zm0 6c-8.84 0-24 4.62-24 13.5V60h48v-4.5C60 46.62 44.84 42 36 42Z" />
      </svg>
    </div>
    <div>
      <h1 className="text-2xl font-semibold text-primary">List of Subscribers</h1>
      <p className="text-sm text-gray-400">View members and their subscription plans</p>
    </div>
  </div>
);

export default ListSubscribers;
