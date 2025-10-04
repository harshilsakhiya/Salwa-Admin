import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useToast } from "../components/ToastProvider";
import { getSuperAdmins, softDeleteSuperAdmin, updateSuperAdminStatus } from "../services/superAdminService";
import type { SuperAdminRecord, SuperAdminStatusId } from "../services/superAdminService";

const PAGE_SIZE = 10;

const STATUS_BADGE_CLASSES: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-600",
  Inactive: "bg-rose-100 text-rose-600",
};

const TYPE_LABELS: Record<number, string> = {
  0: "Operational Supervisor",
  1: "Operational Employee",
  2: "Finance Supervisor",
  3: "Finance Employee",
  4: "IT Support Employee",
};

const SupervisorPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [records, setRecords] = useState<SuperAdminRecord[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const loadData = useCallback(
    async (page: number, query: string) => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const response = await getSuperAdmins({ pageNumber: page, pageSize: PAGE_SIZE, search: query || undefined });
        setRecords(response.records);
        setTotalCount(response.totalCount ?? response.records.length);
        setPageNumber(response.pageNumber ?? page);
      } catch (error) {
        console.error("Failed to fetch super admin list", error);
        const message = error instanceof Error ? error.message : "Unable to load records";
        setErrorMessage(message);
        showToast(message, "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    void loadData(pageNumber, searchTerm.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    void loadData(pageNumber, searchTerm.trim());
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPageNumber(1);
    void loadData(1, searchTerm.trim());
  };

  const handlePageChange = (direction: "prev" | "next") => {
    const nextPage = direction === "prev" ? Math.max(1, pageNumber - 1) : Math.min(totalPages, pageNumber + 1);
    setPageNumber(nextPage);
    void loadData(nextPage, searchTerm.trim());
  };

  const handleAdd = () => {
    navigate("/supervisor-management/add");
  };

  const handleView = (record: SuperAdminRecord) => {
    navigate(`/supervisor-management/${record.employeeId}?mode=view`);
  };

  const handleEdit = (record: SuperAdminRecord) => {
    navigate(`/supervisor-management/${record.employeeId}/edit`);
  };

  const handleStatusToggle = async (record: SuperAdminRecord) => {
    const currentStatus = record.statusId ?? (record.isActive ? 1 : 0);
    const nextStatus: SuperAdminStatusId = currentStatus === 1 ? 0 : 1;
    try {
      await updateSuperAdminStatus(record.employeeId, nextStatus);
      showToast(`Status updated to ${nextStatus === 1 ? "Active" : "Inactive"}.`, "success");
      setRecords((prev) =>
        prev.map((item) =>
          item.employeeId === record.employeeId
            ? { ...item, statusId: nextStatus, isActive: nextStatus === 1 }
            : item
        )
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update status";
      showToast(message, "error");
    }
  };

  const handleDelete = async (record: SuperAdminRecord) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${record.firstName} ${record.lastName}?`);
    if (!confirmed) {
      return;
    }
    try {
      await softDeleteSuperAdmin(record.employeeId);
      showToast("Profile removed successfully.", "success");
      setRecords((prev) => prev.filter((item) => item.employeeId !== record.employeeId));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete profile";
      showToast(message, "error");
    }
  };

  const stats = useMemo(() => {
    const total = totalCount || records.length;
    const active = records.filter((item) => (item.statusId ?? (item.isActive ? 1 : 0)) === 1).length;
    const inactive = total - active;
    return [
      { label: "Total Employee", value: total.toString() },
      { label: "Total Active Employee", value: active.toString() },
      { label: "Total Inactive", value: inactive.toString() },
    ];
  }, [records, totalCount]);

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-16">
        <Header onRefresh={handleRefresh} loading={loading} />
        <section className="space-y-6 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="grid gap-1 text-primary">
              <h2 className="text-2xl font-semibold">Supervisor / Employee Management</h2>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Overview</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#030447]"
                onClick={handleAdd}
              >
                Add
              </button>
              <button
                type="button"
                className="rounded-full border border-gray-200 px-6 py-2 text-sm font-semibold text-primary transition hover:border-primary"
                onClick={handleRefresh}
              >
                Refresh
              </button>
            </div>
          </div>

          <StatsRow stats={stats} />
          <ChartPlaceholder />

          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, ID, or email"
                className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 pl-12 text-sm text-gray-600 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-primary/60">
                <SearchIcon />
              </span>
            </div>
            <button
              type="submit"
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#030447]"
              disabled={loading}
            >
              Search
            </button>
          </form>

          <DataTable
            loading={loading}
            errorMessage={errorMessage}
            records={records}
            pageNumber={pageNumber}
            pageSize={PAGE_SIZE}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            onView={handleView}
            onEdit={handleEdit}
            onToggleStatus={handleStatusToggle}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </DashboardLayout>
  );
};

const Header = ({ onRefresh, loading }: { onRefresh: () => void; loading: boolean }) => (
  <div className="flex items-center gap-4 rounded-[28px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
    <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary">
      <HeaderIcon />
    </div>
    <div className="flex flex-1 items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Supervisor / Employee Management</h1>
        <p className="text-sm text-gray-400">Manage supervisors and employees</p>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="rounded-full border border-gray-200 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  </div>
);

const StatsRow = ({ stats }: { stats: Array<{ label: string; value: string }> }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {stats.map((item) => (
      <div key={item.label} className="rounded-[28px] border border-gray-100 bg-[#f7f8fd] px-6 py-8 text-center shadow-[0_20px_40px_rgba(5,6,104,0.08)]">
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

const DataTable = ({
  loading,
  errorMessage,
  records,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: {
  loading: boolean;
  errorMessage: string | null;
  records: SuperAdminRecord[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (direction: "prev" | "next") => void;
  onView: (record: SuperAdminRecord) => void;
  onEdit: (record: SuperAdminRecord) => void;
  onToggleStatus: (record: SuperAdminRecord) => void;
  onDelete: (record: SuperAdminRecord) => void;
}) => {
  if (errorMessage) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-[28px] border border-gray-100">
        <table className="w-full min-w-[900px] text-left text-sm text-gray-600">
          <thead className="bg-[#f6f7fb] text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            <tr>
              <th className="px-6 py-4">ID No</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">User Type</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Country</th>
              <th className="px-6 py-4">Region</th>
              <th className="px-6 py-4">City</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white text-sm">
            {loading ? (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-sm text-gray-500">
                  Loading supervisors...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-sm text-gray-500">
                  No supervisors found. Try adjusting your search.
                </td>
              </tr>
            ) : (
              records.map((row) => {
                const statusLabel = (row.statusId ?? (row.isActive ? 1 : 0)) === 1 ? "Active" : "Inactive";
                return (
                  <tr key={row.employeeId}>
                    <td className="px-6 py-4 font-semibold text-primary">{row.idNumber || `#${row.employeeId}`}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {[row.firstName, row.middleName, row.lastName].filter(Boolean).join(" ")}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{TYPE_LABELS[row.type] ?? "Unknown"}</td>
                    <td className="px-6 py-4 text-gray-500">{row.officialEmail}</td>
                    <td className="px-6 py-4 text-gray-500">{row.telephone || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-500">{row.country || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-500">{row.region || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-500">{row.city || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE_CLASSES[statusLabel] ?? "bg-gray-100 text-gray-500"}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <ActionButton label="View" onClick={() => onView(row)} />
                        <ActionButton label="Edit" variant="primary" onClick={() => onEdit(row)} />
                        <ActionButton
                          label={statusLabel === "Active" ? "Deactivate" : "Activate"}
                          variant="ghost"
                          onClick={() => onToggleStatus(row)}
                        />
                        <ActionButton label="Delete" variant="danger" onClick={() => onDelete(row)} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <p>
          Showing {records.length ? (pageNumber - 1) * pageSize + 1 : 0} to {Math.min(pageNumber * pageSize, totalCount)} of {totalCount} entries
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange("prev")}
            disabled={pageNumber === 1 || loading}
            className="rounded-full border border-gray-200 px-4 py-1 text-xs font-semibold text-gray-500 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-xs font-semibold text-primary">
            Page {pageNumber} of {Math.max(1, Math.ceil(totalCount / pageSize))}
          </span>
          <button
            type="button"
            onClick={() => onPageChange("next")}
            disabled={pageNumber >= Math.ceil(totalCount / pageSize) || loading}
            className="rounded-full border border-gray-200 px-4 py-1 text-xs font-semibold text-gray-500 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({
  label,
  onClick,
  variant = "ghost",
}: {
  label: string;
  onClick: () => void;
  variant?: "primary" | "danger" | "ghost";
}) => {
  const variants: Record<string, string> = {
    primary: "border-transparent bg-primary text-white hover:bg-[#030447]",
    danger: "border-rose-300 text-rose-600 hover:border-rose-500 hover:text-rose-700",
    ghost: "border-gray-200 text-primary hover:border-primary",
  };

  return (
    <button
      type="button"
      className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${variants[variant] ?? variants.ghost}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
    <circle cx="11" cy="11" r="6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 20l-2.6-2.6" />
  </svg>
);

const HeaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-10 w-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 20c0-3.3137 2.6863-6 6-6s6 2.6863 6 6" />
  </svg>
);

export default SupervisorPage;


