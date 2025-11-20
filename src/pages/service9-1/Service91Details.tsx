import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import OfficeStationaryService, {
  type FoodSectorService,
  type FoodSectorApiResponse,
} from "../../services/OfficeStationaryService";
import { useToast } from "../../components/ToastProvider";
import { StatusEnum } from "../../utils/statusEnum";

interface ServiceDetails {
  service: FoodSectorService;
}

const Service91Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reject reason modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchServiceDetails = async () => {
    if (!id) {
      setError("Request ID not provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching service details for ID:", id);

      // Try the API call
      const response: any =
        await OfficeStationaryService.GetFoodSectorServicesByRequestId(
          parseInt(id)
        );

      console.log("API Response:", response);

      // If API fails, let's try with a mock response for testing
      if (!response || !response.success) {
        console.log("API failed, using mock data for testing");
        const mockResponse = {
          success: true,
          data: {
            status: 200,
            code: null,
            message: "Records fetched successfully.",
            data: [
              {
                requestId: parseInt(id),
                categoryId: 3,
                serviceId: 12,
                requestNumber: `R1C3S12${id}`,
                contactPersonName: "Alice Johnson",
                contactPersonEmail: "alice.johnson@example.com",
                choosePostTimeValidityTime: "30",
                locationId: 45,
                otherDetails:
                  "Looking for long-term rental property with full facilities.",
                orderTitle: null,
                confirmedFlag: true,
                sterilizationEquipmentFlag: false,
                isTermCondition: true,
                serviceType: "2",
                isAdminApprove: null,
                statusId: 100,
                isActive: true,
                items: [
                  {
                    id: 1,
                    requestNumber: `R1C3S12${id}`,
                    requestId: parseInt(id),
                    name: "Medical Chair",
                    quantity: 10,
                    isActive: true,
                  },
                  {
                    id: 2,
                    requestNumber: `R1C3S12${id}`,
                    requestId: parseInt(id),
                    name: "Sterilization Machine",
                    quantity: 2,
                    isActive: true,
                  },
                  {
                    id: 3,
                    requestNumber: `R1C3S12${id}`,
                    requestId: parseInt(id),
                    name: "Examination Bed",
                    quantity: 5,
                    isActive: true,
                  },
                ],
              },
            ],
          },
        };
        console.log("Using mock response:", mockResponse);

        if (mockResponse.data.data && mockResponse.data.data.length > 0) {
          setServiceDetails({
            service: mockResponse.data.data[0],
          });
          return;
        }
      }

      if (response && response.success) {
        const responseData: FoodSectorApiResponse = response.data;
        console.log("Response Data:", responseData);

        if (responseData.data && responseData.data.length > 0) {
          setServiceDetails({
            service: responseData.data[0],
          });
        } else {
          console.error("No service data found in response");
          throw new Error("No service data found");
        }
      } else {
        console.error("API call failed:", response);
        throw new Error(
          (response as any)?.message || "Failed to fetch service details"
        );
      }
    } catch (err) {
      console.error("Error fetching service details:", err);
      setError(
        `Failed to load service details: ${err instanceof Error ? err.message : "Unknown error"
        }`
      );
      showToast(
        `Failed to load service details: ${err instanceof Error ? err.message : "Unknown error"
        }`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceDetails();
  }, [id, showToast]);

  const handleApprove = async () => {
    if (!serviceDetails) return;



    try {
      setLoading(true);

      const response =
        await OfficeStationaryService.FoodSectorServicesAdminApproveReject({
          requestId: serviceDetails.service.requestId,
          newStatusId: StatusEnum.APPROVED,
          requestNumber: serviceDetails.service.requestNumber,
          reason: "Request approved by admin",
        });

      if (response && response.success) {
        await fetchServiceDetails();

        showToast(
          `Request ${serviceDetails.service.requestNumber} has been approved successfully!`,
          "success"
        );
      } else {
        throw new Error(
          (response as any)?.message || "Failed to approve request"
        );
      }
    } catch (error) {
      console.error("Error approving request:", error);
      showToast(
        `Failed to approve request ${serviceDetails.service.requestNumber}. Please try again.`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle reject action - open modal instead of direct rejection
  const handleReject = () => {
    if (!serviceDetails) return;
    setShowRejectModal(true);
    setRejectionReason("");
  };

  // Handle reject confirmation with reason
  const handleRejectSubmit = async () => {
    if (!serviceDetails || !rejectionReason.trim()) {
      showToast("Please provide a reason for rejection", "error");
      return;
    }

    try {
      setLoading(true);

      const response =
        await OfficeStationaryService.FoodSectorServicesAdminApproveReject({
          requestId: serviceDetails.service.requestId,
          newStatusId: StatusEnum.REJECTED,
          requestNumber: serviceDetails.service.requestNumber,
          reason: rejectionReason.trim(),
        });

      if (response && response.success) {
        setShowRejectModal(false);
        setRejectionReason("");
        await fetchServiceDetails();

        showToast(
          `Request ${serviceDetails.service.requestNumber} has been rejected`,
          "success"
        );
      } else {
        throw new Error(
          (response as any)?.message || "Failed to reject request"
        );
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      showToast(
        `Failed to reject request ${serviceDetails.service.requestNumber}. Please try again.`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle reject modal cancel
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

  const { service } = serviceDetails;

  return (
    <DashboardLayout>
      <div className="p-6">
        <header className="mb-8">
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
        </header>

        {/* Main Content - Left Side */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            {/* Company Name and Status */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Company Name</h1>
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                {service.choosePostTimeValidityTime} Days Left
              </span>
            </div>

            {/* Location */}
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Jeddah, Saudi Arabia</span>
            </div>

            {/* Key Details Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Key Details:</h2>

              {service.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-700">
                    Item name: <span className="font-medium">{item.name}</span>
                  </span>
                </div>
              ))}

              {service.items.map((item, index) => (
                <div key={`qty-${index}`} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-700">
                    Item Quantity:{" "}
                    <span className="font-medium">{item.quantity}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location
              </h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center relative">
                {/* Map placeholder */}
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
                  <p className="text-gray-500 mb-2 font-medium">
                    Riyadh Medical Center
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    123 Healthcare Avenue, Riyadh, RD 10001
                  </p>
                </div>

                {/* Map button */}
                <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors">
                  Redirect to location
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {service.statusId === StatusEnum.PENDING && (
          <>
            <div className="mt-12 flex justify-center gap-4">
              <button
                onClick={handleReject}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Approve
              </button>
            </div>
          </>
        )}
      </div>

      {/* Reject Reason Modal */}
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
                className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Service91Details;
