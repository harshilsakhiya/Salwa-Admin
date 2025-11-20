import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import ComanTable, {
  type TableColumn,
  type ActionButton,
  type SortState,
} from "../../components/common/ComanTable";
import MedicalLegalService from "../../services/MedicalLegalService";
import { useToast } from "../../components/ToastProvider";
import {
  getStatusBadgeClass,
  getStatusName,
  StatusEnum,
} from "../../utils/statusEnum";


interface RentalMedicalEquipmentRecord {
  requestId: number;
  requestNumber: string;
  orderTitle: string;
  businessName: string;
  contactPersonName: string;
  contactPersonEmail: string;
  address: string;
  city: string;
  district: string;
  region: string;
  country: string;
  nationalAddress: string;
  latitude: string;
  longitude: string;
  facilityType: number;
  facilityTypeName: string;
  providerType: number;
  providerTypeName: string;
  categoryId: number;
  serviceId: number;
  statusId: number;
  statusName: string;
  createdDate: string;
  rentPeriodId: number;
  rentPeriodName: string;
  rentValue: number;
  discountTypeId: number;
  discountValue: number;
  postValidityTimeId: number;
  postValidityTimeName: string;
  leftDays: string;
  fdaDeviceLicenseNumber: string;
  healthRegistrationNumber: string;
  mediaURL: string;
  otherTermsAndCondition: string;
  isTermCondition: boolean;
  locationId: number;
}

const Service41Dashboard = () => {
  const { subserviceIndex } = useParams<{
    subserviceIndex?: string;
  }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [medicalLegalServiceRecords, setMedicalLegalServiceRecords] = useState<
    RentalMedicalEquipmentRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortState, setSortState] = useState<SortState[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMedicalLegalServiceDataFromAPI = async (): Promise<
    RentalMedicalEquipmentRecord[]
  > => {
    try {
      const response = await MedicalLegalService.GetAllMedicalLegalServices({
        pageNumber: pageNumber,
        pageSize: pageSize,
        orderByColumn: sortState.length > 0 ? sortState[0].key : "CreatedDate",
        orderDirection:
          sortState.length > 0 ? sortState[0].order.toUpperCase() : "DESC",
      });

      if (response && response.success) {
        const responseData = (response as any).data;
        const totalCount = responseData?.totalCount || 0;
        const apiTotalPages = responseData?.totalPages;

        const calculatedTotalPages =
          apiTotalPages || Math.ceil(totalCount / pageSize) || 1;

        setTotalCount(totalCount);
        setTotalPages(calculatedTotalPages);

        return responseData || [];
      } else {
        throw new Error(
          (response as any)?.message || "Failed to fetch rental medical equipment data"
        );
      }
    } catch (error) {
      console.error("Error fetching rental medical equipment data from API:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiData = await fetchMedicalLegalServiceDataFromAPI();
        setMedicalLegalServiceRecords(apiData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subserviceIndex, pageNumber, pageSize, sortState]);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handleSortChange = (newSortState: SortState[]) => {
    setSortState(newSortState);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageNumber(1);
  };

  const handlePublishMedicalLegalServiceAction = async (row: RentalMedicalEquipmentRecord) => {
    try {
      setLoading(true);

      const response =
        await MedicalLegalService.MedicalLegalServicesApproveRejectByAdmin({
          id: row.requestId,
          newStatusId: StatusEnum.PUBLISHED,
          requestNumber: (row.requestId).toString(),
          reason: "Medical legal service published by admin",
        });

      if (response && response.success) {
        const apiData = await fetchMedicalLegalServiceDataFromAPI();
        setMedicalLegalServiceRecords(apiData);

        showToast(
          `Medical legal service ${row.requestId} has been published successfully!`,
          "success"
        );
      } else {
        throw new Error(
          (response as any)?.message ||
          "Failed to publish rental medical equipment"
        );
      }
    } catch (error) {
      console.error("Error publishing rental medical equipment:", error);
      showToast(
        `Failed to publish medical legal service ${row.requestNumber}. Please try again.`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const rentalMedicalEquipmentTableColumns: TableColumn<RentalMedicalEquipmentRecord>[] = [
    {
      label: "ID No",
      value: (row) => (
        <span className="font-semibold text-primary">#{row.requestId.toString().padStart(4, '0')}</span>
      ),
      sortKey: "requestId",
      isSort: true,
    },
    {
      label: "Order Title",
      value: (row) => <span className="text-gray-700">{row.orderTitle}</span>,
      sortKey: "orderTitle",
      isSort: true,
    },
    {
      label: "Health Registration Number",
      value: (row) => <span className="text-gray-500">{row.healthRegistrationNumber}</span>,
      sortKey: "healthRegistrationNumber",
      isSort: true,
    },
    {
      label: "FDA Number",
      value: (row) => <span className="text-gray-500">{row.fdaDeviceLicenseNumber}</span>,
      sortKey: "fdaDeviceLicenseNumber",
      isSort: true,
    },
    {
      label: "Facility Type",
      value: (row) => (
        <span className="text-gray-500">{row.facilityTypeName}</span>
      ),
      sortKey: "facilityTypeName",
      isSort: true,
    },
    {
      label: "Rend Period",
      value: (row) => (
        <span className="text-gray-500">{row.rentValue + " Months"}</span>
      ),
      sortKey: "rentValue" + "",
      isSort: true,
    },
    {
      label: "Email",
      value: (row) => (
        <span className="text-gray-500">{row.contactPersonEmail}</span>
      ),
      sortKey: "contactPersonEmail",
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
      value: (row) => <span className="text-gray-500">{row.region}</span>,
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
      label: "Upload Date",
      value: (row) => (
        <span className="text-gray-500">
          {new Date(row.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
      sortKey: "createdDate",
      isSort: true,
    },
    {
      label: "Status",
      value: (row) => {
        return (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
              row.statusId
            )}`}
          >
            {getStatusName(row.statusId)}
          </span>
        );
      },
      sortKey: "statusName",
      isSort: true,
    },
  ];

  const medicalLegalServiceActionButtons: ActionButton<RentalMedicalEquipmentRecord>[] = [
    {
      label: "View",
      iconType: "view",
      onClick: (row: any) => {
        navigate(`/service4-1/${row.requestNumber}`);
      },
      isVisible: () => true,
    },
    {
      label: "Publish",
      iconType: "publish",
      onClick: (row) => handlePublishMedicalLegalServiceAction(row),
      isVisible: (row) => row.statusId === StatusEnum.APPROVED,
    },
  ];

  // Separate render functions for each table type to handle TypeScript properly

  const renderMedicalLegalServiceTable = () => (
    <ComanTable
      columns={rentalMedicalEquipmentTableColumns}
      data={medicalLegalServiceRecords}
      actions={medicalLegalServiceActionButtons}
      page={pageNumber}
      totalPages={totalPages}
      totalCount={totalCount}
      onPageChange={handlePageChange}
      sortState={sortState}
      onSortChange={handleSortChange}
      pageSize={pageSize}
      onPageSizeChange={handlePageSizeChange}
      loading={loading}
    />
  );

  if (loading && medicalLegalServiceRecords.length === 0) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && medicalLegalServiceRecords.length === 0) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/service-dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Back to Service Category
                </span>
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Medical Legal Services Dashboard
              </h1>

              {/* Tab Navigation */}
            </div>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-[28px] border border-gray-200 bg-[#f7f8fd] px-6 py-8 text-center shadow-[0_20px_40px_rgba(5,6,104,0.08)]">
            <h3 className="mb-2 text-4xl font-bold text-gray-900">244</h3>
            <p className="text-sm text-gray-600">Total Approved</p>
          </div>
          <div className="rounded-[28px] border border-gray-200 bg-[#f7f8fd] px-6 py-8 text-center shadow-[0_20px_40px_rgba(5,6,104,0.08)]">
            <h3 className="mb-2 text-4xl font-bold text-gray-900">22</h3>
            <p className="text-sm text-gray-600">Total Rejected</p>
          </div>
          <div className="rounded-[28px] border border-gray-200 bg-[#f7f8fd] px-6 py-8 text-center shadow-[0_20px_40px_rgba(5,6,104,0.08)]">
            <h3 className="mb-2 text-4xl font-bold text-gray-900">266</h3>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_20px_40px_rgba(5,6,104,0.08)]">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Report By Month
            </h3>
            <div className="h-64">
              <div className="flex h-full items-end justify-between gap-2">
                {[
                  { month: "Jan", value: 45 },
                  { month: "Feb", value: 67 },
                  { month: "March", value: 117 },
                  { month: "Apr", value: 89 },
                  { month: "May", value: 34 },
                  { month: "June", value: 22 },
                  { month: "July", value: 78 },
                  { month: "Aug", value: 56 },
                  { month: "Sept", value: 91 },
                  { month: "Oct", value: 43 },
                  { month: "Nov", value: 65 },
                  { month: "Dec", value: 38 },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div
                      className="w-8 bg-gray-800 rounded-t"
                      style={{ height: `${(item.value / 120) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-600">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {renderMedicalLegalServiceTable()}
      </div>
    </DashboardLayout>
  );
};

export default Service41Dashboard;
