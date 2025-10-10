import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import ComanTable, {
  type TableColumn,
  type ActionButton,
  type SortState,
} from "../../components/common/ComanTable";
import IndividualClinicService from "../../services/IndividualClinicService";
import MedicalLegalServices from "../../services/MedicalLegalServices";
import { useToast } from "../../components/ToastProvider";
import {
  getStatusBadgeClass,
  getStatusName,
  StatusEnum,
} from "../../utils/statusEnum";

interface DashboardRecord {
  RequestId: number;
  RequestNumber: string;
  OrderTitle: string;
  BuildingLicenseNumber: string;
  MedicalLicenseNumber: string;
  WorkingEmp: number;
  ContactPersonName: string;
  ContactEmail: string;
  ClinicHours: string;
  RentPeriod: number;
  RentPeriodType: string;
  ServiceType: string;
  ProvideWith: string;
  StatusId: number;
  StatusName: string;
  CreatedDate: string;
  UpdatedDate: string;
  CreatedBy: number;
  UpdatedBy: number;
  ClinicSiteId: number;
  CategoryId: number;
  SerevieceId: number;
  ConfirmedFlag: boolean;
  IsActive: boolean;
  IsAdminApprove: boolean;
  SterilizationEquipmentFlag: boolean;
  OtherTermsAndCon: string;
  Reason: string;
  Media: string;
  ValidityTime: number;
  TransactionId: string | null;
  Quotation: string | null;
  DeletedBy: number | null;
  DeletedDate: string | null;
  RowNum: number;
}

interface MedicalLegalRecord {
  id: number;
  requestNumber: string;
  requestTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  legalCaseType: string;
  caseDescription: string;
  urgencyLevel: string;
  estimatedDuration: string;
  budgetRange: string;
  preferredLanguage: string;
  statusId: number;
  statusName: string;
  createdDate: string;
  updatedDate: string;
  createdBy: number;
  updatedBy: number;
  isActive: boolean;
  isApproved: boolean;
  notes?: string;
  assignedLawyer?: string;
  caseFileNumber?: string;
}

const Service41Dashboard = () => {
  const { subserviceIndex } = useParams<{
    subserviceIndex?: string;
  }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [records, setRecords] = useState<DashboardRecord[]>([]);
  const [medicalLegalRecords, setMedicalLegalRecords] = useState<MedicalLegalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortState, setSortState] = useState<SortState[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<'clinic' | 'medical-legal'>('clinic');

  const fetchDataFromAPI = async (): Promise<DashboardRecord[]> => {
    try {
      const response =
        await IndividualClinicService.GetAllForAdminIndividualClinicServiceRequests(
          {
            clinicSiteId: subserviceIndex
              ? parseInt(subserviceIndex)
              : undefined,
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortColumn: sortState.length > 0 ? sortState[0].key : "CreatedDate",
            sortDirection:
              sortState.length > 0 ? sortState[0].order.toUpperCase() : "DESC",
          }
        );

      if (response && response.success) {
        const responseData = (response as any).data;
        const totalCount = responseData?.totalCount || 0;
        const apiTotalPages = responseData?.totalPages;

        const calculatedTotalPages =
          apiTotalPages || Math.ceil(totalCount / pageSize) || 1;

        setTotalCount(totalCount);
        setTotalPages(calculatedTotalPages);

        return responseData?.data || [];
      } else {
        throw new Error((response as any)?.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
      throw error;
    }
  };

  const fetchMedicalLegalDataFromAPI = async (): Promise<MedicalLegalRecord[]> => {
    try {
      const response = await MedicalLegalServices.GetAllMedicalLegalServices({
        searchText: "",
        pageNumber: pageNumber,
        pageSize: pageSize,
        orderByColumn: sortState.length > 0 ? sortState[0].key : "CreatedDate",
        orderDirection: sortState.length > 0 ? sortState[0].order.toUpperCase() : "DESC",
      });

      if (response && response.success) {
        const responseData = (response as any).data;
        const totalCount = responseData?.totalCount || 0;
        const apiTotalPages = responseData?.totalPages;

        const calculatedTotalPages =
          apiTotalPages || Math.ceil(totalCount / pageSize) || 1;

        setTotalCount(totalCount);
        setTotalPages(calculatedTotalPages);

        return responseData?.data || [];
      } else {
        throw new Error((response as any)?.message || "Failed to fetch medical legal data");
      }
    } catch (error) {
      console.error("Error fetching medical legal data from API:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === 'clinic') {
          const apiData = await fetchDataFromAPI();
          setRecords(apiData);
        } else {
          const apiData = await fetchMedicalLegalDataFromAPI();
          setMedicalLegalRecords(apiData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subserviceIndex, pageNumber, pageSize, sortState, activeTab]);

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



  const handlePublishMedicalLegalAction = async (row: MedicalLegalRecord) => {


    try {
      setLoading(true);

      const response = await MedicalLegalServices.UpdateMedicalLegalServiceStatus({
        serviceId: row.id,
        statusId: StatusEnum.PUBLISHED,
        reason: "Medical legal service published by admin",
      });

      if (response && response.success) {
        await fetchMedicalLegalDataFromAPI();

        showToast(
          `Medical legal service ${row.requestNumber} has been published successfully!`,
          "success"
        );
      } else {
        throw new Error(
          (response as any)?.message || "Failed to publish medical legal service"
        );
      }
    } catch (error) {
      console.error("Error publishing medical legal service:", error);
      showToast(
        `Failed to publish medical legal service ${row.requestNumber}. Please try again.`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const tableColumns: TableColumn<DashboardRecord>[] = [
    {
      label: "ID No",
      value: (row) => (
        <span className="font-semibold text-primary">#{row.RequestId}</span>
      ),
      sortKey: "RequestId",
      isSort: true,
    },
    {
      label: "Order Title",
      value: (row) => <span className="text-gray-700">{row.OrderTitle}</span>,
      sortKey: "OrderTitle",
      isSort: true,
    },
    {
      label: "Health Registration Number",
      value: (row) => (
        <span className="text-gray-500">{row.BuildingLicenseNumber}</span>
      ),
      sortKey: "BuildingLicenseNumber",
      isSort: true,
    },
    {
      label: "FDA Number",
      value: (row) => (
        <span className="text-gray-500">{row.MedicalLicenseNumber}</span>
      ),
      sortKey: "MedicalLicenseNumber",
      isSort: true,
    },
    {
      label: "Facility Type",
      value: (row) => <span className="text-gray-500">{row.ServiceType}</span>,
      sortKey: "ServiceType",
      isSort: true,
    },
    {
      label: "Rent Period",
      value: (row) => (
        <span className="text-gray-500">{row.RentPeriod} {row.RentPeriodType}</span>
      ),
      sortKey: "RentPeriod",
      isSort: true,
    },
    {
      label: "Email",
      value: (row) => <span className="text-gray-500">{row.ContactEmail}</span>,
      sortKey: "ContactEmail",
      isSort: true,
    },
    // {
    //   label: "Country",
    //   value: (row) => (
    //     <span className="text-gray-500">Saudi Arabia</span>
    //   ),
    //   sortKey: "Country",
    //   isSort: true,
    // },
    // {
    //   label: "Region",
    //   value: (row) => (
    //     <span className="text-gray-500">Region 1</span>
    //   ),
    //   sortKey: "Region",
    //   isSort: true,
    // },
    // {
    //   label: "City",
    //   value: (row) => (
    //     <span className="text-gray-500">City 1</span>
    //   ),
    //   sortKey: "City",
    //   isSort: true,
    // },
    {
      label: "Upload Date",
      value: (row) => (
        <span className="text-gray-500">
          {new Date(row.CreatedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      ),
      sortKey: "CreatedDate",
      isSort: true,
    },
    {
      label: "Status",
      value: (row) => {
        return (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
              row.StatusId
            )}`}
          >
            {getStatusName(row.StatusId)}
          </span>
        );
      },
      sortKey: "StatusName",
      isSort: true,
    },
  ];

  const actionButtons: ActionButton<DashboardRecord>[] = [
    {
      label: "View",
      iconType: "view",
      onClick: (row: any) => {
        navigate(`/service4-1/${row.RequestNumber}`);
      },
      isVisible: () => true,
    },
    {
      label: "Publish",
      iconType: "publish",
      onClick: (row: any) => handlePublishMedicalLegalAction(row),
      isVisible: (row) => row.StatusId === StatusEnum.APPROVED,
    },
  ];

  const medicalLegalTableColumns: TableColumn<MedicalLegalRecord>[] = [
    {
      label: "Request Number",
      value: (row) => (
        <span className="font-semibold text-primary">{row.requestNumber}</span>
      ),
      sortKey: "requestNumber",
      isSort: true,
    },
    {
      label: "Request Title",
      value: (row) => <span className="text-gray-700">{row.requestTitle}</span>,
      sortKey: "requestTitle",
      isSort: true,
    },
    {
      label: "Client Name",
      value: (row) => (
        <span className="text-gray-500">{row.clientName}</span>
      ),
      sortKey: "clientName",
      isSort: true,
    },
    {
      label: "Client Email",
      value: (row) => <span className="text-gray-500">{row.clientEmail}</span>,
      sortKey: "clientEmail",
      isSort: true,
    },
    {
      label: "Client Phone",
      value: (row) => <span className="text-gray-500">{row.clientPhone}</span>,
      sortKey: "clientPhone",
      isSort: true,
    },
    {
      label: "Service Type",
      value: (row) => <span className="text-gray-500">{row.serviceType}</span>,
      sortKey: "serviceType",
      isSort: true,
    },
    {
      label: "Legal Case Type",
      value: (row) => <span className="text-gray-500">{row.legalCaseType}</span>,
      sortKey: "legalCaseType",
      isSort: true,
    },
    {
      label: "Urgency Level",
      value: (row) => (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${row.urgencyLevel === 'High' ? 'bg-red-100 text-red-800' :
          row.urgencyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
          {row.urgencyLevel}
        </span>
      ),
      sortKey: "urgencyLevel",
      isSort: true,
    },
    {
      label: "Estimated Duration",
      value: (row) => (
        <span className="text-gray-500">{row.estimatedDuration}</span>
      ),
      sortKey: "estimatedDuration",
      isSort: true,
    },
    {
      label: "Budget Range",
      value: (row) => (
        <span className="text-gray-500">{row.budgetRange}</span>
      ),
      sortKey: "budgetRange",
      isSort: true,
    },
    {
      label: "Assigned Lawyer",
      value: (row) => (
        <span className="text-gray-500">{row.assignedLawyer || 'Not Assigned'}</span>
      ),
      sortKey: "assignedLawyer",
      isSort: true,
    },
    {
      label: "Created Date",
      value: (row) => (
        <span className="text-gray-500">
          {new Date(row.createdDate).toLocaleDateString()}
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

  const medicalLegalActionButtons: ActionButton<MedicalLegalRecord>[] = [
    {
      label: "View",
      iconType: "view",
      onClick: (row: any) => {
        navigate(`/service4-1/${row.RequestNumber}`);
      },
      isVisible: () => true,
    },
    {
      label: "Publish",
      iconType: "publish",
      onClick: (row) => handlePublishMedicalLegalAction(row),
      isVisible: (row) => row.statusId === StatusEnum.APPROVED,
    },

  ];

  // Separate render functions for each table type to handle TypeScript properly
  const renderClinicTable = () => (
    <ComanTable
      columns={tableColumns}
      data={records}
      actions={actionButtons}
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

  const renderMedicalLegalTable = () => (
    <ComanTable
      columns={medicalLegalTableColumns}
      data={medicalLegalRecords}
      actions={medicalLegalActionButtons}
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

  if (loading && records.length === 0 && medicalLegalRecords.length === 0) {
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

  if (error && records.length === 0 && medicalLegalRecords.length === 0) {
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
                Service 4-1 Dashboard
              </h1>

              {/* Tab Navigation */}
              <div className="mt-4">
                <nav className="flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('clinic')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'clinic'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Individual Clinic Services
                  </button>
                  <button
                    onClick={() => setActiveTab('medical-legal')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'medical-legal'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Medical Legal Services
                  </button>
                </nav>
              </div>
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

        <div className="rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_40px_rgba(5,6,104,0.08)]">
          {activeTab === 'clinic' ? renderClinicTable() : renderMedicalLegalTable()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Service41Dashboard;

