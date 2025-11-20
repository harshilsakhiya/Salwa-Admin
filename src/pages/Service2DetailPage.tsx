import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import OfficeStationaryService from "../services/OfficeStationaryService";
import { StatusEnum } from "../utils/statusEnum";
import { useToast } from "../components/ToastProvider";

interface Service2Detail {
  id: string;
  requestId: number;
  requestNumber: string;
  categoryId: number;
  serviceId: number;
  serviceTitle: string;
  contactPersonName: string;
  contactPersonEmail: string;
  choosePostTimeValidityTime: number;
  locationId: number;
  otherDetails: string;
  confirmedFlag: boolean;
  sterilizationEquipmentFlag: boolean;
  isTermCondition: boolean;
  serviceType: number;
  statusId: number;
  isActive: boolean;
  createdBy: number;
  createdDate: string;
  updatedBy: number | null;
  updatedDate: string | null;
  totalQuantity: number;
  items: Service2Item[];
}

interface Service2Item {
  Id: number;
  RequestNumber: string;
  RequestId: number;
  Name: string;
  Quantity: number;
  IsActive: boolean;
  CreatedBy: number;
  CreatedDate: string;
}

const Service2DetailPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [serviceDetail, setServiceDetail] = useState<Service2Detail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      if (!serviceId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Call the actual API with the service ID (request number)
        const response =
          await OfficeStationaryService.GetHealthMarketPlaceServiceByRequestNumber(
            serviceId
          );

        if (
          response &&
          response.success &&
          "data" in response &&
          response.data
        ) {
          // Map the API response to our Service2Detail interface
          const apiData = response.data;

          // Parse Items JSON string if it's a string
          let parsedItems: Service2Item[] = [];
          if (typeof apiData.Items === "string") {
            try {
              parsedItems = JSON.parse(apiData.Items);
            } catch (error) {
              console.error("Error parsing Items JSON:", error);
              parsedItems = [];
            }
          } else if (Array.isArray(apiData.Items)) {
            parsedItems = apiData.Items;
          }

          const serviceDetail: Service2Detail = {
            id: apiData.RequestId?.toString() || serviceId,
            requestId: apiData.RequestId || 0,
            requestNumber: apiData.RequestNumber || serviceId,
            categoryId: apiData.CategoryId || 0,
            serviceId: apiData.ServiceId || 0,
            serviceTitle: apiData.OrderTitle || "Service Details",
            contactPersonName: apiData.ContactPersonName || "Contact person",
            contactPersonEmail:
              apiData.ContactPersonEmail || "contact@example.com",
            choosePostTimeValidityTime:
              apiData.ChoosePostTimeValidityTime || 30,
            locationId: apiData.LocationId || 0,
            otherDetails:
              apiData.OtherDetails || "No additional details provided",
            confirmedFlag: apiData.ConfirmedFlag || false,
            sterilizationEquipmentFlag:
              apiData.SterilizationEquipmentFlag || false,
            isTermCondition: apiData.IsTermCondition || false,
            serviceType: apiData.ServiceType || 0,
            statusId: apiData.StatusId || 99,
            isActive: apiData.IsActive || true,
            createdBy: apiData.CreatedBy || 0,
            createdDate: apiData.CreatedDate || new Date().toISOString(),
            updatedBy: apiData.UpdatedBy || null,
            updatedDate: apiData.UpdatedDate || null,
            totalQuantity: apiData.TotalQuantity || 0,
            items: parsedItems,
          };

          setServiceDetail(serviceDetail);
        } else {
          console.error(
            "Failed to fetch service details:",
            response && "message" in response
              ? response.message
              : "Unknown error"
          );
          // Handle error case - maybe show an error message
        }
      } catch (error) {
        console.error("Error fetching service details:", error);
        // Handle error case
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [serviceId]);

  const handleApprove = async () => {
    if (!serviceDetail) return;

    try {
      setIsSubmitting(true);

      const requestData = {
        requestId: serviceDetail.requestId,
        newStatusId: StatusEnum.APPROVED, // 100
        userId: 0,
        requestNumber: serviceDetail.requestNumber,
        reason: "",
      };

      const response =
        await OfficeStationaryService.UpdateHealthMarketPlaceServicesStatus(
          requestData
        );

      if (response?.success) {
        showToast("Service approved successfully!", "success");
        navigate(-1);
      } else {
        showToast(
          (response as any)?.message || "Failed to approve service",
          "error"
        );
      }
    } catch (error) {
      console.error("Error approving service:", error);
      showToast("An error occurred while approving the service", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      showToast("Please provide a reason for rejection.", "error");
      return;
    }

    if (!serviceDetail) return;

    try {
      setIsSubmitting(true);

      const requestData = {
        requestId: serviceDetail.requestId,
        newStatusId: StatusEnum.REJECTED, // 101
        userId: 0,
        requestNumber: serviceDetail.requestNumber,
        reason: rejectionReason,
      };

      const response =
        await OfficeStationaryService.UpdateHealthMarketPlaceServicesStatus(
          requestData
        );

      if (response?.success) {
        showToast("Service rejected successfully!", "success");

        setRejectionReason("");
        setShowRejectModal(false);
        navigate(-1);
      } else {
        showToast(
          (response as any)?.message || "Failed to reject service",
          "error"
        );
      }
    } catch (error) {
      console.error("Error rejecting service:", error);
      showToast("An error occurred while rejecting the service", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectCancel = () => {
    setRejectionReason("");
    setShowRejectModal(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!serviceDetail) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Service not found</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
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
      <div className="bg-white">
        <div className="mx-auto p-6">
          {/* Header Section with Doctor Icon */}

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <svg
              className="w-5 h-5"
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
            Back
          </button>

          {/* Service Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {serviceDetail.serviceTitle || "Service Request"}
          </h1>

          {/* Request Number and Validity */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Request Number: {serviceDetail.requestNumber}
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {serviceDetail.choosePostTimeValidityTime} Days Validity
              </span>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-200 mb-8" />

          {/* Key Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Key Details:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <span className="text-gray-700">
                  <strong>Contact Person Name :</strong>{" "}
                  {serviceDetail.contactPersonName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <span className="text-gray-700">
                  <strong>Contact Person Email :</strong>{" "}
                  {serviceDetail.contactPersonEmail}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <span className="text-gray-700">
                  <strong>Category ID :</strong> {serviceDetail.categoryId}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <span className="text-gray-700">
                  <strong>Service ID :</strong> {serviceDetail.serviceId}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <span className="text-gray-700">
                  <strong>Total Quantity :</strong>{" "}
                  {serviceDetail.totalQuantity}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <span className="text-gray-700">
                  <strong>Location ID :</strong> {serviceDetail.locationId}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Requested Items:
            </h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    Item ID
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    Item Name
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    Quantity
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    Request Number
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    Created Date
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {serviceDetail.items.map((item, index) => (
                  <tr
                    key={item.Id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="border border-gray-300 px-4 py-3 text-gray-900">
                      {item.Id}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-900">
                      {item.Name}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-900">
                      {item.Quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-900">
                      {item.RequestNumber}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-900">
                      {new Date(item.CreatedDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-900">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.IsActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.IsActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Other Details */}
          <div className="mb-12">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Other Details :
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {serviceDetail.otherDetails}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Only show for Pending status */}
          {serviceDetail?.statusId === StatusEnum.PENDING && (
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Reject"}
              </button>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Approve"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Reason for Cancellation
              </h3>
              <button
                onClick={handleRejectCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason*
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e:any) => setRejectionReason(e.target.value)}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Modal Footer */}
            <div className="flex justify-center">
              <button
                onClick={handleRejectSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Service2DetailPage;
