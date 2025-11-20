import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import IndividualMedicalWarehouseService from "../../services/IndividualMedicalWarehouseService";
import { useToast } from "../../components/ToastProvider";
import {
  getStatusBadgeClass,
  getStatusName,
  StatusEnum,
} from "../../utils/statusEnum";
import IndividualClinicService from "../../services/IndividualClinicService";

interface ServiceDetails {
  requestId: number;
  requestNumber: string;
  orderTitle: string;
  orderType: number;
  quantity: number;
  contactPersonEmail: string;
  country: string;
  region: string;
  city: string;
  businessName: string;
  address: string;
  district: string;
  statusId: number;
  media: string;
  fdaApproved: boolean;
  isFridge: boolean;
  fireDepartmentLic: string;
  termAndCondition: string;
  rentPeriod: number;
  rentValue: number;
  discountType: number;
  discountValue: number;
  serviceType: string;
  contactPersonName: string;
  postOfficeBox: string;
  otherDetails: string;
  postValidityTime: number;
}

const Service72Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch service details
  const fetchServiceDetails = async () => {
    if (!id) {
      setError("Request ID not provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response: any =
        await IndividualMedicalWarehouseService.GetWarehouseById(parseInt(id));

      if (response && response.success && response.data) {
        const warehouseData = Array.isArray(response.data) ? response.data[0] : response.data;

        // Transform API data to match our ServiceDetails interface
        const transformedData: ServiceDetails = {
          requestId: warehouseData.requestId,
          requestNumber: warehouseData.requestNumber,
          orderTitle: warehouseData.orderTitle,
          orderType: warehouseData.orderType,
          quantity: warehouseData.quantity,
          contactPersonEmail: warehouseData.contactPersonEmail,
          country: warehouseData.country || "N/A",
          region: warehouseData.region || "N/A",
          city: warehouseData.city || "N/A",
          businessName: warehouseData.businessName || "N/A",
          address: warehouseData.address || "N/A",
          district: warehouseData.district || "N/A",
          statusId: warehouseData.statusId,
          media: warehouseData.media,
          fdaApproved: warehouseData.fdaApproved,
          isFridge: warehouseData.isFridge,
          fireDepartmentLic: warehouseData.fireDepartmentLic,
          termAndCondition: warehouseData.termAndCondition,
          rentPeriod: warehouseData.rentPeriod,
          rentValue: warehouseData.rentValue,
          discountType: warehouseData.discountType,
          discountValue: warehouseData.discountValue,
          serviceType: warehouseData.serviceType,
          contactPersonName: warehouseData.contactPersonName,
          postOfficeBox: warehouseData.postOfficeBox,
          otherDetails: warehouseData.otherDetails,
          postValidityTime: warehouseData.postValidityTime,
        };

        setServiceDetails(transformedData);
      } else {
        throw new Error(
          (response as any)?.message || "Failed to fetch service details"
        );
      }
    } catch (err) {
      console.error("Error fetching service details:", err);
      setError("Failed to load service details");
      showToast("Failed to load service details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceDetails();
  }, [id, showToast]);

  // Handle approve action
  const handleApprove = async () => {
    if (!serviceDetails) return;

    try {
      setLoading(true);

      const response = await IndividualClinicService.UpdateStatus({
        requestId: serviceDetails.requestId,
        statusId: StatusEnum.APPROVED,
        reason: "",
      });

      if (response && response.success) {
        showToast(
          `Request ${serviceDetails.requestNumber} has been approved successfully!`,
          "success"
        );

        // Refresh the data after successful approve
        await fetchServiceDetails();
      } else {
        throw new Error(
          (response as any)?.message || "Failed to approve request"
        );
      }
    } catch (error) {
      console.error("Error approving request:", error);
      showToast(
        `Failed to approve request ${serviceDetails.requestNumber}. Please try again.`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle reject action - open modal
  const handleReject = () => {
    setShowRejectModal(true);
  };

  // Handle reject submit - actually reject with reason
  const handleRejectSubmit = async () => {
    if (!serviceDetails || !rejectionReason.trim()) return;

    try {
      setLoading(true);

      const response = await IndividualClinicService.UpdateStatus({
        requestId: serviceDetails.requestId,
        statusId: StatusEnum.REJECTED,
        reason: rejectionReason.trim(),
      });

      if (response && response.success) {
        // Close modal and reset reason
        setShowRejectModal(false);
        setRejectionReason("");

        showToast(
          `Request ${serviceDetails.requestNumber} has been rejected`,
          "success"
        );

        // Refresh the data after successful reject
        await fetchServiceDetails();
      } else {
        throw new Error(
          (response as any)?.message || "Failed to reject request"
        );
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      showToast(
        `Failed to reject request ${serviceDetails.requestNumber}. Please try again.`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle reject cancel - close modal
  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectionReason("");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading service details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !serviceDetails) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-red-500">
              {error || "Service details not found"}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
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
                <span className="text-sm font-medium">Back</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Service 7-2 Details
              </h1>
              <div className="flex items-center gap-2">
                <div className="h-6 w-px bg-gray-300"></div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                    serviceDetails.statusId
                  )}`}
                >
                  {getStatusName(serviceDetails.statusId)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Company Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Company Information */}
          <div className="space-y-6">
            {/* Company Image */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={serviceDetails.media ? `https://apisalwa.rushkarprojects.in/${serviceDetails.media}` : "/img/pallet_img.png"}
                  alt="Company Image"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/img/warehouse (1).png";
                  }}
                />
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {serviceDetails.businessName || "Company Name"}
              </h2>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">{serviceDetails.city || "N/A"}, {serviceDetails.country || "Saudi Arabia"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {serviceDetails.postValidityTime || 30} Days Left
                  </span>
                </div>
              </div>

              {/* Key Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Details:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                    <span className="text-gray-700">
                      <strong>Fridge:</strong> {serviceDetails.isFridge ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                    <span className="text-gray-700">
                      <strong>FDA Approved:</strong> {serviceDetails.fdaApproved ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                    <span className="text-gray-700">
                      <strong>Fire Department License:</strong> {serviceDetails.fireDepartmentLic || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                    <span className="text-gray-700">
                      <strong>Order Type:</strong> {serviceDetails.orderType || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                    <span className="text-gray-700">
                      <strong>Quantity:</strong> {serviceDetails.quantity || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                    <span className="text-gray-700">
                      <strong>Rent Period:</strong> {serviceDetails.rentPeriod || "N/A"} months
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                    <span className="text-gray-700">
                      <strong>Rent Value:</strong> {serviceDetails.rentValue || "N/A"} SAR
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                    <span className="text-gray-700">
                      <strong>Contact Person:</strong> {serviceDetails.contactPersonName || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Terms & Condition:</h3>
                <p className="text-gray-700 leading-relaxed">
                  {serviceDetails.termAndCondition || "No terms and conditions provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 h-96">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location
              </h3>
              <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-gray-500 mb-2">{serviceDetails.businessName || "Medical Center"}</p>
                  <p className="text-sm text-gray-400">
                    {serviceDetails.address || "Address not provided"}
                    {serviceDetails.district && `, ${serviceDetails.district}`}
                    {serviceDetails.city && `, ${serviceDetails.city}`}
                    {serviceDetails.country && `, ${serviceDetails.country}`}
                  </p>
                  <button className="mt-4 px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors">
                    Redirect to location
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Only show when status is PENDING */}
        {serviceDetails.statusId === StatusEnum.PENDING && (
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleReject}
              disabled={loading}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Approve
            </button>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Reason for Cancellation</h3>
                <button
                  onClick={handleRejectCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason*
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e:any) => setRejectionReason(e.target.value)}
                  placeholder="Please provide the reason for rejection..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                  required
                />
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleRejectSubmit}
                  disabled={loading || !rejectionReason.trim()}
                  className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Service72Details;