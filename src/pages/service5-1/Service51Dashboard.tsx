import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import ComanTable, {
  type TableColumn,
  type ActionButton,
  type SortState,
} from "../../components/common/ComanTable";
import MedicalStaffService from "../../services/medicalStaffService";
import { useToast } from "../../components/ToastProvider";
import {
  getStatusBadgeClass,
  getStatusName,
  StatusEnum,
} from "../../utils/statusEnum";

interface DashboardRecord {
  id: number;
  requestId: number;
  jobTitle: string;
  jobDescription: string;
  department: string;
  requiredQualifications: string;
  experienceYears: number;
  salaryRange: string;
  location: string;
  employmentType: string;
  statusId: number;
  statusName: string;
  createdDate: string;
  updatedDate?: string;
  createdBy: number;
  updatedBy?: number;
  isActive: boolean;
  applicationDeadline?: string;
  contactEmail: string;
  contactPhone: string;
  benefits: string;
  responsibilities: string;
  requirements: string;
  jobCategory: string;
  recruitmentType: string;
  urgentFlag: boolean;
  internalOnly: boolean;
  externalAllowed: boolean;
  jobClassification: string;
  jobType: string;
  country: string;
  region: string;
  city: string;
  emailHR: string;
  speciality: string;
  nationalityId: number;
  religionId: number;
  genderId: number;
  jobTypeId: number;
  requestNumber: string;
}

const Service51Dashboard = () => {
  const { subserviceIndex } = useParams<{
    subserviceIndex?: string;
  }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [records, setRecords] = useState<DashboardRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortState, setSortState] = useState<SortState[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDataFromAPI = async (): Promise<DashboardRecord[]> => {
    try {
      const response =
        await MedicalStaffService.GetAllMedicalRecruitmentJob({
          searchText: "",
          statusId: 0,
          pageNumber: pageNumber,
          pageSize: pageSize,
          orderByColumn:
            sortState.length > 0 ? sortState[0].key : "CreatedDate",
          orderDirection:
            sortState.length > 0 ? sortState[0].order.toUpperCase() : "ASC",
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
        throw new Error((response as any)?.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiData = await fetchDataFromAPI();
        setRecords(apiData);
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

  const handlePublishAction = async (row: DashboardRecord) => {
    try {
      setLoading(true);

      const response =
        await MedicalStaffService.MedicalRecruitmentJobAdminApproveReject({
          RequestId: row.requestId,
          NewStatusId: StatusEnum.PUBLISHED,
          RequestNumber: row.requestNumber,
          Reason: "Job published by admin",
        });

      if (response && response.success) {
        await fetchDataFromAPI();

        showToast(
          `Job "${row.jobTitle}" has been published successfully!`,
          "success"
        );
      } else {
        throw new Error((response as any)?.message || "Failed to publish job");
      }
    } catch (error) {
      console.error("Error publishing job:", error);
      showToast(
        `Failed to publish job "${row.jobTitle}". Please try again.`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const tableColumns: TableColumn<DashboardRecord>[] = [
    {
      label: "Job ID",
      value: (row) => (
        <span className="font-semibold text-primary">#{row.requestId}</span>
      ),
      sortKey: "id",
      isSort: true,
    },
    {
      label: "Job Title",
      value: (row) => (
        <div className="max-w-xs">
          <span className="font-semibold text-gray-900">{row.jobTitle}</span>
          {row.urgentFlag && (
            <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
              Urgent
            </span>
          )}
        </div>
      ),
      sortKey: "jobTitle",
      isSort: true,
    },
    {
      label: "Job role",
      value: (row) => <span className="text-gray-700">{row.jobClassification}</span>,
      sortKey: "jobClassification",
      isSort: true,
    },
    {
      label: "Speciality",
      value: (row) => <span className="text-gray-500">{row.speciality}</span>,
      sortKey: "speciality",
      isSort: true,
    },
    {
      label: "Nationality",
      value: (row) => (
        <span className="text-gray-500">{row.nationalityId}</span>
      ),
      sortKey: "nationalityId",
      isSort: true,
    },
    {
      label: "Religion",
      value: (row) => (
        <span className="text-gray-500">{row.religionId}</span>
      ),
      sortKey: "religionId",
      isSort: true,
    },
    {
      label: "Gender",
      value: (row) => <span className="text-gray-500">{row.genderId}</span>,
      sortKey: "genderId",
      isSort: true,
    },
    {
      label: "Job Type",
      value: (row) => <span className="text-gray-500">{row.jobTypeId}</span>,
      sortKey: "jobTypeId",
      isSort: true,
    },
    {
      label: "HR Email",
      value: (row) => <span className="text-gray-500">{row.emailHR}</span>,
      sortKey: "emailHR",
      isSort: true,
    },
    {
      label: "Country",
      value: (row) => <span className="text-gray-500">{row.country}</span>,
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
      value: (row) => <span className="text-gray-500">{row.city}</span>,
      sortKey: "city",
      isSort: true,
    },
    {
      label: "Upload Date",
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

  const actionButtons: ActionButton<DashboardRecord>[] = [
    {
      label: "View",
      iconType: "view",
      onClick: (row) => {
        navigate(`/service5-1/${row.requestNumber}`);
      },
      isVisible: () => true,
    },
    {
      label: "Publish",
      iconType: "publish",
      onClick: (row) => handlePublishAction(row),
      isVisible: (row) => row.statusId === StatusEnum.APPROVED,
    },
  ];

  if (loading && records.length === 0) {
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

  if (error && records.length === 0) {
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
            <h1 className="text-2xl font-bold text-gray-900">
              Medical Recruitment Jobs Dashboard
            </h1>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-[28px] border border-gray-200 bg-[#f7f8fd] px-6 py-8 text-center shadow-[0_20px_40px_rgba(5,6,104,0.08)]">
            <h3 className="mb-2 text-4xl font-bold text-gray-900">
              {
                records.filter((r) => r.statusId === StatusEnum.PUBLISHED)
                  .length
              }
            </h3>
            <p className="text-sm text-gray-600">Published Jobs</p>
          </div>
          <div className="rounded-[28px] border border-gray-200 bg-[#f7f8fd] px-6 py-8 text-center shadow-[0_20px_40px_rgba(5,6,104,0.08)]">
            <h3 className="mb-2 text-4xl font-bold text-gray-900">
              {records.filter((r) => r.statusId === StatusEnum.APPROVED).length}
            </h3>
            <p className="text-sm text-gray-600">Approved Jobs</p>
          </div>
          <div className="rounded-[28px] border border-gray-200 bg-[#f7f8fd] px-6 py-8 text-center shadow-[0_20px_40px_rgba(5,6,104,0.08)]">
            <h3 className="mb-2 text-4xl font-bold text-gray-900">
              {totalCount}
            </h3>
            <p className="text-sm text-gray-600">Total Jobs</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_20px_40px_rgba(5,6,104,0.08)]">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Job Postings By Month
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
      </div>
    </DashboardLayout>
  );
};

export default Service51Dashboard;
