import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider";
import { getSuperAdmins, softDeleteSuperAdmin, updateSuperAdminStatus } from "../services/superAdminService";
import type { SuperAdminRecord, SuperAdminStatusId } from "../services/superAdminService";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ProfileModal from "../components/ProfileModal";

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
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: 0,
    firstName: "",
    middleName: "",
    lastName: "",
    idNumber: "",
    idExpiryDate: "",
    dateOfBirth: "",
    graduationCertificate: "",
    acquiredLanguages: "",
    telephone: "",
    officialEmail: "",
    type: 0,
    country: "",
    region: "",
    city: "",
    nationalAddress: "",
    address: "",
    latitude: "",
    longitude: "",
    bankName: "",
    ibanNumber: "",
    password: "",
    otp: 0,
    isPasswordset: 0,
    isOtpVerify: 0,
    isMobileNoVerify: true,
    createdBy: 0,
    updatedBy: 0,
    isActive: true,
    statusId: 0
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
    setShowForm(true);
    setFormData({
      employeeId: 0,
      firstName: "",
      middleName: "",
      lastName: "",
      idNumber: "",
      idExpiryDate: "",
      dateOfBirth: "",
      graduationCertificate: "",
      acquiredLanguages: "",
      telephone: "",
      officialEmail: "",
      type: 0,
      country: "",
      region: "",
      city: "",
      nationalAddress: "",
      address: "",
      latitude: "",
      longitude: "",
      bankName: "",
      ibanNumber: "",
      password: "",
      otp: 0,
      isPasswordset: 0,
      isOtpVerify: 0,
      isMobileNoVerify: true,
      createdBy: 0,
      updatedBy: 0,
      isActive: true,
      statusId: 0
    });
    setFormErrors({});
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setFormData({
      employeeId: 0,
      firstName: "",
      middleName: "",
      lastName: "",
      idNumber: "",
      idExpiryDate: "",
      dateOfBirth: "",
      graduationCertificate: "",
      acquiredLanguages: "",
      telephone: "",
      officialEmail: "",
      type: 0,
      country: "",
      region: "",
      city: "",
      nationalAddress: "",
      address: "",
      latitude: "",
      longitude: "",
      bankName: "",
      ibanNumber: "",
      password: "",
      otp: 0,
      isPasswordset: 0,
      isOtpVerify: 0,
      isMobileNoVerify: true,
      createdBy: 0,
      updatedBy: 0,
      isActive: true,
      statusId: 0
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.idNumber.trim()) errors.idNumber = "ID Number is required";
    if (!formData.telephone.trim()) errors.telephone = "Telephone is required";
    if (!formData.officialEmail.trim()) errors.officialEmail = "Email is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    if (!formData.region.trim()) errors.region = "Region is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.bankName.trim()) errors.bankName = "Bank name is required";
    if (!formData.ibanNumber.trim()) errors.ibanNumber = "IBAN number is required";

    if (formData.officialEmail && !/\S+@\S+\.\S+/.test(formData.officialEmail)) {
      errors.officialEmail = "Please enter a valid email";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Here you would call your API endpoint
      // await upsertSuperAdmin(formData);
      showToast("Supervisor saved successfully!", "success");
      setShowForm(false);
      void loadData(pageNumber, searchTerm.trim());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save supervisor";
      showToast(message, "error");
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
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

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="salva-main-desh p-5 w-full mx-auto flex bg-[#f2f2f2] h-screen">
      {/* Mobile backdrop overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className="sticky top-0 h-screen z-30">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Right content area */}
      <div className="salva-right-desh-part-main w-full flex flex-col h-screen overflow-hidden">
        {/* Header section */}
        <div className="sticky top-0 z-20 flex-shrink-0 p-2 sm:p-3 lg:p-5" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="salva-right-desh-head-search-profile-and-noti w-fit ml-auto flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8 max-[767px]:w-full">
            <Header
              onToggleSidebar={toggleSidebar}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden main-content-scroll px-2 sm:px-3 lg:px-5">
          <div className="w-full">
            {!showForm ? (
              <div className="flex-1 space-y-6 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
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
              </div>
            ) : (
              <SupervisorForm
                formData={formData}
                formErrors={formErrors}
                onInputChange={handleInputChange}
                onSubmit={handleFormSubmit}
                onCancel={handleCancelForm}
              />
            )}
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


const SupervisorForm = ({
  formData,
  formErrors,
  onInputChange,
  onSubmit,
  onCancel,
}: {
  formData: any;
  formErrors: Record<string, string>;
  onInputChange: (field: string, value: string | number | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}) => {
  return (
    <div className="flex-1 bg-white rounded-[32px] p-8 shadow-sm overflow-y-auto">
      <div className=" mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Add New Supervisor</h2>
            <p className="text-sm text-gray-500">Fill in the details below to add a new supervisor</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          {/* General Information Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => onInputChange("firstName", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter first name"
                />
                {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => onInputChange("middleName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter middle name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => onInputChange("lastName", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter last name"
                />
                {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Number / IQAMA Number *</label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => onInputChange("idNumber", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.idNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter ID number"
                />
                {formErrors.idNumber && <p className="text-red-500 text-xs mt-1">{formErrors.idNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Expiry Date</label>
                <input
                  type="date"
                  value={formData.idExpiryDate}
                  onChange={(e) => onInputChange("idExpiryDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => onInputChange("dateOfBirth", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Certificate</label>
                <input
                  type="text"
                  value={formData.graduationCertificate}
                  onChange={(e) => onInputChange("graduationCertificate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter graduation certificate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Acquired Languages</label>
                <input
                  type="text"
                  value={formData.acquiredLanguages}
                  onChange={(e) => onInputChange("acquiredLanguages", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter languages"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telephone *</label>
                <div className="flex">
                  <select className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>+966</option>
                    <option>+1</option>
                    <option>+44</option>
                  </select>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => onInputChange("telephone", e.target.value)}
                    className={`flex-1 px-3 py-2 border border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.telephone ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="566 645 122"
                  />
                </div>
                {formErrors.telephone && <p className="text-red-500 text-xs mt-1">{formErrors.telephone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Official Email *</label>
                <input
                  type="email"
                  value={formData.officialEmail}
                  onChange={(e) => onInputChange("officialEmail", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.officialEmail ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter email address"
                />
                {formErrors.officialEmail && <p className="text-red-500 text-xs mt-1">{formErrors.officialEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => onInputChange("type", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Operational Supervisor</option>
                  <option value={1}>Operational Employee</option>
                  <option value={2}>Finance Supervisor</option>
                  <option value={3}>Finance Employee</option>
                  <option value={4}>IT Support Employee</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => onInputChange("country", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.country ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter country"
                />
                {formErrors.country && <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region *</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => onInputChange("region", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.region ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter region"
                />
                {formErrors.region && <p className="text-red-500 text-xs mt-1">{formErrors.region}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => onInputChange("city", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter city"
                />
                {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">National Address - SPL</label>
                <input
                  type="text"
                  value={formData.nationalAddress}
                  onChange={(e) => onInputChange("nationalAddress", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="YADD3344"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => onInputChange("address", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.address ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Idara St, King Abdul Aziz University, Jeddah"
                />
                {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-6">
              <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-2"></div>
                  <p className="text-gray-500">Map Component</p>
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 bg-black text-white rounded-md text-sm"
                  >
                    Get Direction
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Information Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Bank Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => onInputChange("bankName", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.bankName ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter bank name"
                />
                {formErrors.bankName && <p className="text-red-500 text-xs mt-1">{formErrors.bankName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IBAN Number *</label>
                <input
                  type="text"
                  value={formData.ibanNumber}
                  onChange={(e) => onInputChange("ibanNumber", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.ibanNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter IBAN number"
                />
                {formErrors.ibanNumber && <p className="text-red-500 text-xs mt-1">{formErrors.ibanNumber}</p>}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="px-8 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupervisorPage;


