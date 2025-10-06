import { useMemo, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import NonMedicalServices from "../services/NonMedicalServices";
import { useToast } from "../components/ToastProvider";
import ComanTable, { type TableColumn, type ActionButton, type SortState } from "../components/common/ComanTable";

// NonMedical record interface
interface NonMedicalRecord {
  id: number;
  businessName: string;
  subscription: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  subscriptionAmount: number;
  country: string;
  region: string;
  city: string;
  district: string;
  status: "Active" | "Inactive";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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

type TabKey = "individual" | "business";
type FormMode = "create" | "edit" | "view";

interface FormState {
  id: string;
  businessName: string;
  subscription: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  subscriptionAmount: string;
  country: string;
  region: string;
  city: string;
  district: string;
  status: "Active" | "Inactive";
}

// Calculate real-time stats from API data
const calculateStats = (data: CompanyRow[]) => {
  const activeCount = data.filter(company => company.status === "Active").length;
  const inactiveCount = data.filter(company => company.status === "Inactive").length;
  const totalCount = data.length;

  return [
    { value: activeCount.toString(), title: "Active Companies" },
    { value: inactiveCount.toString(), title: "Inactive Companies" },
    { value: totalCount.toString(), title: "Total Companies" },
  ];
};

const statusStyles: Record<CompanyRow["status"], string> = {
  Active: "bg-[#e9fbf3] text-[#09a66d]",
  Inactive: "bg-[#fff1f0] text-[#e23939]",
};

const NonMedicalCompanies = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>("individual");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // API state
  const [companiesData, setCompaniesData] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortState, setSortState] = useState<SortState[]>([]);

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [formValues, setFormValues] = useState<FormState>({
    id: "",
    businessName: "",
    subscription: "",
    subscriptionStartDate: "",
    subscriptionEndDate: "",
    subscriptionAmount: "",
    country: "",
    region: "",
    city: "",
    district: "",
    status: "Active",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Always use API data if available, otherwise fall back to static data
  const rows = companiesData.length > 0 ? companiesData : [];

  // Calculate real-time stats from current data
  const currentStats = calculateStats(rows);

  // Map API data to CompanyRow format
  const mapNonMedicalToCompanyRow = useCallback((apiData: NonMedicalRecord): CompanyRow => {
    return {
      id: `#${apiData.id.toString().padStart(4, "0")}`,
      name: apiData.businessName,
      subscription: apiData.subscription,
      subscriptionStart: apiData.subscriptionStartDate,
      subscriptionEnd: apiData.subscriptionEndDate,
      amount: apiData.subscriptionAmount.toString(),
      country: apiData.country,
      region: apiData.region,
      city: apiData.city,
      district: apiData.district,
      status: apiData.status,
    };
  }, []);

  // Load companies data from API for both tabs
  const loadCompanies = useCallback(async (page: number = 1, search: string = "", currentPageSize: number = pageSize) => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (activeTab === "business") {
        response = await NonMedicalServices.GetAllBusinessUserNonMedical({
          pageNumber: page,
          pageSize: currentPageSize,
          searchTerm: search || undefined,
        });
      } else {
        response = await NonMedicalServices.GetAllIndividualUserNonMedical({
          pageNumber: page,
          pageSize: currentPageSize,
          searchTerm: search || undefined,
        });
      }

      // Handle the response structure
      if (!response) {
        throw new Error('No response received from API');
      }

      if (!response.success) {
        const errorMessage = 'message' in response ? response.message : `Failed to load ${activeTab} companies`;
        throw new Error(errorMessage);
      }

      // API response is a direct array
      const records = 'data' in response && response.data ? response.data : [];

      // For direct array response, calculate pagination info
      const recordTotalCount = records.length;
      const recordTotalPages = Math.ceil(recordTotalCount / currentPageSize);

      // Map the API data to CompanyRow format
      const mappedData = records.map(mapNonMedicalToCompanyRow);

      setCompaniesData(mappedData);
      setTotalCount(recordTotalCount);
      setTotalPages(recordTotalPages);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to load ${activeTab} companies`;
      setError(errorMessage);
      showToast(errorMessage, "error");
      setCompaniesData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, mapNonMedicalToCompanyRow, showToast, pageSize]);

  // Load data when tab changes or page changes
  useEffect(() => {
    void loadCompanies(currentPage, searchTerm, pageSize);
  }, [activeTab, currentPage, searchTerm, pageSize, loadCompanies]);

  // Update totalPages when totalCount or pageSize changes
  useEffect(() => {
    const calculatedPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 1;
    const finalPages = Math.max(1, calculatedPages);
    setTotalPages(finalPages);
  }, [totalCount, pageSize]);

  // For API data, use it directly (API handles pagination and search)
  // For static data, do client-side filtering and pagination
  const tableData = useMemo(() => {
    // If we have API data, return it as-is (API handles pagination and search)
    if (companiesData.length > 0) {
      return companiesData;
    }

    // For static data, do client-side filtering
    let filteredData = rows;
    if (searchTerm.trim()) {
      const query = searchTerm.trim().toLowerCase();
      filteredData = rows.filter((row) =>
        [row.id, row.name, row.subscription, row.country, row.city, row.region].some((field) =>
          field.toLowerCase().includes(query)
        )
      );
    }

    // For static data, do client-side pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [companiesData, rows, searchTerm, currentPage, pageSize]);

  // Use API pagination for API data, client-side pagination for static data
  const pageCount = companiesData.length > 0 ? totalPages : Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(currentPage, pageCount);
  const displayTotalCount = companiesData.length > 0 ? totalCount : rows.length;

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    void loadCompanies(1, value, pageSize);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    void loadCompanies(page, searchTerm, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    void loadCompanies(1, searchTerm, size);
  };

  const handleSortChange = (newSortState: SortState[]) => {
    setSortState(newSortState);
  };

  const handleView = (row: CompanyRow) => {
    setFormMode("view");
    setFormValues({
      id: row.id,
      businessName: row.name,
      subscription: row.subscription,
      subscriptionStartDate: row.subscriptionStart,
      subscriptionEndDate: row.subscriptionEnd,
      subscriptionAmount: row.amount,
      country: row.country,
      region: row.region,
      city: row.city,
      district: row.district,
      status: row.status,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (row: CompanyRow) => {
    setFormMode("edit");
    setFormValues({
      id: row.id,
      businessName: row.name,
      subscription: row.subscription,
      subscriptionStartDate: row.subscriptionStart,
      subscriptionEndDate: row.subscriptionEnd,
      subscriptionAmount: row.amount,
      country: row.country,
      region: row.region,
      city: row.city,
      district: row.district,
      status: row.status,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (_row: CompanyRow) => {
    // Implement delete functionality
  };

  const handleAddNew = () => {
    setFormMode("create");
    setFormValues({
      id: "",
      businessName: "",
      subscription: "",
      subscriptionStartDate: "",
      subscriptionEndDate: "",
      subscriptionAmount: "",
      country: "",
      region: "",
      city: "",
      district: "",
      status: "Active",
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async () => {
    setFormSubmitting(true);
    try {
      // Implement form submission logic here
      console.log("Form submitted:", formValues);
      showToast("Company saved successfully!", "success");
      setIsFormOpen(false);
      // Reload data
      void loadCompanies(currentPage, searchTerm, pageSize);
    } catch (error) {
      showToast("Failed to save company", "error");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Table columns configuration
  const tableColumns: TableColumn<CompanyRow>[] = useMemo(() => [
    {
      label: "SO NO",
      value: (row) => (
        <span className="font-helveticaBold text-primary">{row.id}</span>
      ),
      sortKey: "id",
      isSort: true,
    },
    {
      label: "Business Name",
      value: (row) => (
        <span className="text-gray-700">{row.name}</span>
      ),
      sortKey: "name",
      isSort: true,
    },
    {
      label: "Subscription",
      value: (row) => (
        <span className="text-gray-500">{row.subscription}</span>
      ),
      sortKey: "subscription",
      isSort: true,
    },
    {
      label: "Subscription Start Date",
      value: (row) => (
        <span className="text-gray-500">{row.subscriptionStart}</span>
      ),
      sortKey: "subscriptionStart",
      isSort: true,
    },
    {
      label: "Subscription End Date",
      value: (row) => (
        <span className="text-gray-500">{row.subscriptionEnd}</span>
      ),
      sortKey: "subscriptionEnd",
      isSort: true,
    },
    {
      label: "Subscription Amount",
      value: (row) => (
        <span className="text-gray-500">{row.amount}</span>
      ),
      sortKey: "amount",
      isSort: true,
    },
    {
      label: "Country",
      value: (row) => (
        <span className="text-gray-500">{row.country}</span>
      ),
      sortKey: "country",
      isSort: true,
    },
    {
      label: "Region",
      value: (row) => (
        <span className="text-gray-500">{row.region}</span>
      ),
      sortKey: "region",
      isSort: true,
    },
    {
      label: "City",
      value: (row) => (
        <span className="text-gray-500">{row.city}</span>
      ),
      sortKey: "city",
      isSort: true,
    },
    {
      label: "District",
      value: (row) => (
        <span className="text-gray-500">{row.district}</span>
      ),
      sortKey: "district",
      isSort: true,
    },
    {
      label: "Status",
      value: (row) => (
        <span className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-semibold ${statusStyles[row.status]}`}>
          {row.status}
        </span>
      ),
      sortKey: "status",
      isSort: true,
    },
  ], []);

  // Action buttons configuration
  const actionButtons: ActionButton<CompanyRow>[] = useMemo(() => [
    {
      label: "View",
      iconType: "view",
      onClick: handleView,
    },
    {
      label: "Edit",
      iconType: "edit",
      onClick: handleEdit,
    },
    {
      label: "Delete",
      iconType: "delete",
      onClick: handleDelete,
    },
  ], [handleView, handleEdit, handleDelete]);

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full  flex-col gap-8 pb-3">
        <section className="space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-primary">Non Medical Companies</h1>
              <p className="text-sm text-gray-500">Monitor non-medical companies and their subscription details.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddNew}
                className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#030447]"
              >
                Add New
              </button>
              <button className="rounded-full bg-gray-500 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-gray-600">
                Export
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 rounded-full bg-slate-100 p-1 text-sm font-textMedium text-gray-600">
              <TabButton label="Individual" isActive={activeTab === "individual"} onClick={() => handleTabChange("individual")} />
              <TabButton label="Business" isActive={activeTab === "business"} onClick={() => handleTabChange("business")} />
            </div>
            <div className="relative w-full max-w-xs">
              <input
                value={searchTerm}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search"
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 pl-11 text-sm text-gray-600 shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
                <SearchIcon />
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {currentStats.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-card">
                <p className="text-3xl font-helveticaBold text-primary">
                  {loading ? "..." : item.value}
                </p>
                <p className="mt-2 text-xs font-textMedium uppercase tracking-[0.18em] text-gray-500">{item.title}</p>
              </div>
            ))}
          </div>

          <ChartPlaceholder />

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600">
              {error}
            </div>
          ) : (
            <ComanTable
              columns={tableColumns}
              data={tableData}
              actions={actionButtons}
              page={safePage}
              totalPages={pageCount}
              totalCount={displayTotalCount}
              onPageChange={handlePageChange}
              sortState={sortState}
              onSortChange={handleSortChange}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              loading={loading}
            />
          )}

        </section>
      </div>

      {isFormOpen && (
        <ModalOverlay>
          <FormModal
            mode={formMode}
            values={formValues}
            onChange={setFormValues}
            onClose={() => {
              if (!formSubmitting) {
                setIsFormOpen(false);
              }
            }}
            onSubmit={handleFormSubmit}
            isSubmitting={formSubmitting}
            isLoading={false}
          />
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};

const TabButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${isActive ? "bg-white text-primary shadow" : "text-gray-400 hover:text-primary"
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

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 20l-3-3" />
  </svg>
);

const FormModal = ({
  mode,
  values,
  onChange,
  onClose,
  onSubmit,
  isSubmitting,
  isLoading,
}: {
  mode: FormMode;
  values: FormState;
  onChange: (next: FormState) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isLoading: boolean;
}) => {
  return (
    <ModalShell
      title={`${mode === "edit" ? "Edit" : mode === "view" ? "View" : "Add"} Non Medical Company`}
      onClose={onClose}
    >
      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-sm text-gray-500">
          Loading details...
        </div>
      ) : (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          {/* General Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold text-primary">General Information</h4>
              <ChevronIcon />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <LabeledInput
                label="Business Name"
                value={values.businessName}
                onChange={(e) => onChange({ ...values, businessName: e.target.value })}
                disabled={mode === "view"}
                required
              />
              <LabeledInput
                label="Subscription"
                value={values.subscription}
                onChange={(e) => onChange({ ...values, subscription: e.target.value })}
                disabled={mode === "view"}
                required
              />
              <LabeledInput
                label="Subscription Start Date"
                type="date"
                value={values.subscriptionStartDate}
                onChange={(e) => onChange({ ...values, subscriptionStartDate: e.target.value })}
                disabled={mode === "view"}
                required
              />
              <LabeledInput
                label="Subscription End Date"
                type="date"
                value={values.subscriptionEndDate}
                onChange={(e) => onChange({ ...values, subscriptionEndDate: e.target.value })}
                disabled={mode === "view"}
                required
              />
              <LabeledInput
                label="Subscription Amount"
                value={values.subscriptionAmount}
                onChange={(e) => onChange({ ...values, subscriptionAmount: e.target.value })}
                disabled={mode === "view"}
                required
              />
              <LabeledSelect
                label="Status"
                value={values.status}
                onChange={(e) => onChange({ ...values, status: e.target.value as "Active" | "Inactive" })}
                disabled={mode === "view"}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </LabeledSelect>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold text-primary">Location</h4>
              <ChevronIcon />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <LabeledInput
                label="Country"
                value={values.country}
                onChange={(e) => onChange({ ...values, country: e.target.value })}
                disabled={mode === "view"}
                required
              />
              <LabeledInput
                label="Region"
                value={values.region}
                onChange={(e) => onChange({ ...values, region: e.target.value })}
                disabled={mode === "view"}
                required
              />
              <LabeledInput
                label="City"
                value={values.city}
                onChange={(e) => onChange({ ...values, city: e.target.value })}
                disabled={mode === "view"}
                required
              />
              <LabeledInput
                label="District"
                value={values.district}
                onChange={(e) => onChange({ ...values, district: e.target.value })}
                disabled={mode === "view"}
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          {mode !== "view" && (
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-gray-100 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#030447] disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : mode === "edit" ? "Update" : "Create"}
              </button>
            </div>
          )}
        </form>
      )}
    </ModalShell>
  );
};

const LabeledInput = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  required = false,
  ...props
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 disabled:text-gray-500"
      {...props}
    />
  </div>
);

const LabeledSelect = ({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  children,
  ...props
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  children: ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 disabled:text-gray-500"
      {...props}
    >
      {children}
    </select>
  </div>
);

const ModalOverlay = ({ children }: { children: ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-[6px] px-4">
    {children}
  </div>
);

const ModalShell = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) => (
  <div className="w-full max-w-2xl rounded-[36px] bg-white px-8 py-10 shadow-[0_40px_90px_rgba(5,6,104,0.18)]">
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
      <button
        type="button"
        aria-label="Close"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7f8fd] text-gray-500 transition hover:bg-primary/10 hover:text-primary"
        onClick={onClose}
      >
        <CloseIcon />
      </button>
    </div>
    <div className="mt-8 space-y-6">{children}</div>
  </div>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-3 w-3">
    <path strokeLinecap="round" strokeLinejoin="round" d="m6 8 4 4 4-4" />
  </svg>
);

export default NonMedicalCompanies;
