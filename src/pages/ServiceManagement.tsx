import { useState, useCallback, useMemo, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ComanTable, {
  type TableColumn,
  type SortState,
} from "../components/common/ComanTable";
import NonMedicalServices from "../services/NonMedicalServices";
import { useToast } from "../components/ToastProvider";
import PrimaryButton from "../antd/PrimaryButton";

const ServiceManagement = () => {
  const { showToast } = useToast();

  // Menu data state
  const [menuData, setMenuData] = useState<any[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [menuTotalCount, setMenuTotalCount] = useState(0);
  const [menuTotalPages, setMenuTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortState, setSortState] = useState<SortState[]>([]);

  // Load menu data from API
  const loadMenuData = useCallback(
    async (page: number = 1, currentPageSize: number = pageSize) => {
      setMenuLoading(true);
      setMenuError(null);

      try {
        const response = await NonMedicalServices.GetAllBusinessUserMenu({
          pageNumber: page,
          pageSize: currentPageSize,
          sortColumn: "CategoryName",
          sortOrder: "ASC",
        });

        if (!response) {
          throw new Error("No response received from menu API");
        }

        if ((response as any)?.status !== 200) {
          const errorMessage =
            "message" in response
              ? response.message
              : "Failed to load menu data";
          throw new Error(errorMessage);
        }

        // Handle menu API response structure
        const responseData = (response as any).data;
        console.log("Menu API Response:", response);

        let records = [];
        let recordTotalCount = 0;

        if (responseData?.data) {
          records = responseData.data;
          recordTotalCount = responseData.totalRecords || records.length;
          console.log(
            "Using nested data structure for menu, totalRecords:",
            recordTotalCount
          );
        } else {
          records = [];
          recordTotalCount = 0;
          console.log("No valid data structure found for menu");
        }

        const recordTotalPages = Math.ceil(recordTotalCount / currentPageSize);

        console.log("records", records);
        console.log("recordTotalCount", recordTotalCount);
        console.log("recordTotalPages", recordTotalPages);

        setMenuData(records);
        setMenuTotalCount(recordTotalCount);
        setMenuTotalPages(recordTotalPages);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load menu data";
        setMenuError(errorMessage);
        showToast(errorMessage, "error");
        setMenuData([]);
      } finally {
        setMenuLoading(false);
      }
    },
    [showToast, pageSize]
  );

  // Table handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortState: SortState[]) => {
    setSortState(newSortState);
  };

  // Load menu data when component first mounts
  useEffect(() => {
    loadMenuData(1, pageSize);
  }, []); // Empty dependency array means this runs only once on mount

  // Load menu data when pagination changes
  useEffect(() => {
    loadMenuData(currentPage, pageSize);
  }, [currentPage, pageSize, loadMenuData]);

  // Menu table columns configuration
  const menuTableColumns: TableColumn<any>[] = useMemo(
    () => [
      {
        label: "Category Name",
        value: (row) => (
          <span className="text-gray-700">{row.categoryName || "N/A"}</span>
        ),
        sortKey: "categoryName",
        isSort: true,
      },
      {
        label: "Service Name",
        value: (row) => (
          <span className="text-gray-500">{row.serviceName || "N/A"}</span>
        ),
        sortKey: "serviceName",
        isSort: true,
      },
      {
        label: "Sub Service Name",
        value: (row) => (
          <span className="text-gray-500">{row.subServiceName || "N/A"}</span>
        ),
        sortKey: "subServiceName",
        isSort: true,
      },
    ],
    []
  );

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full  flex-col gap-8 pb-3">
        <Header />
        <section className="space-y-8 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="grid gap-2">
              <h2 className="text-2xl font-semibold text-primary">
                Service Management
              </h2>
              <p className="text-sm text-gray-400">
                Monitor categories, services, and activity states
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-md border border-gray-200 h-11 px-6 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary">
                Slide to shutdown salwa
              </button>
              <PrimaryButton children="Export" />
            </div>
          </div>

          <StatsRow />
          <ChartPlaceholder />

          {/* Menu Table with API Data */}

          {menuError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600">
              {menuError}
            </div>
          ) : (
            <ComanTable
              columns={menuTableColumns}
              data={menuData}
              page={currentPage}
              totalPages={menuTotalPages}
              totalCount={menuTotalCount}
              onPageChange={handlePageChange}
              sortState={sortState}
              onSortChange={handleSortChange}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              loading={menuLoading}
            />
          )}
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

const Header = () => (
  <div className="flex items-center gap-4 rounded-[28px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
    <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary">
      <Icon />
    </div>
    <div>
      <h1 className="text-2xl font-semibold text-primary">
        Service Management
      </h1>
      <p className="text-sm text-gray-400">
        Track service categories and performance
      </p>
    </div>
  </div>
);

const Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 72 72"
    className="h-10 w-10"
    fill="#050668"
  >
    <path d="M36 12a3 3 0 0 0-3 3v6h-6V15a3 3 0 0 0-6 0v12H9a3 3 0 0 0 0 6h12v12H9a3 3 0 0 0 0 6h12v12a3 3 0 0 0 6 0V45h12v12a3 3 0 0 0 6 0V45h12a3 3 0 0 0 0-6H45V27h12a3 3 0 0 0 0-6H45V15a3 3 0 0 0-6 0v6h-6V15a3 3 0 0 0-3-3Z" />
  </svg>
);

export default ServiceManagement;
