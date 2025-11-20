import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import MedicalGeneralServices from "../../services/MedicalGeneralServices";
import axiosInstance from "../../common/axiosInstance";
import { useToast } from "../../components/ToastProvider";
import { StatusEnum } from "../../utils/statusEnum";

// Real API data structure based on MedicalGeneralServicesRequest
interface ServiceDetails {
  id: number;
  requestNumber: string;
  orderTitle: string;
  contactPersonName: string;
  contactPersonEmail: string;
  numberOfBags: number;
  country: string;
  region: string;
  city: string;
  district: string;
  address: string;
  nationalAddress: string;
  latitude: number;
  longitude: number;
  mediaURL: string;
  orderStatus: number;
  eName: string;
  categoryId: number;
  serviceId: number;
  isAdminApprove: string;
  isTermCondition: boolean;
  otherTermsAndCondition: string;
}

// Sample images for carousel
const sampleImages = [
  "/img/hospital_img.jpg",
  "/img/hospital_img (2).jpg",
  "/img/hospital_img (3).jpg",
  "/img/hospital_img (4).jpg",
  "/img/hospital_img (5).jpg",
];

const Service81Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [serviceDetails, setServiceDetails] = useState<
    ServiceDetails | any | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  // Reject reason modal state
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
        await MedicalGeneralServices.GetMedicalGeneralServiceById(parseInt(id));

      if (response && response.success) {
        setServiceDetails(response.data);

        // Handle images from mediaURL with API base URL prefix
        if (response.data?.mediaURL) {
          const apiBaseUrl =
            axiosInstance.defaults.baseURL?.replace("/api/", "") || "";
          const fullImageUrl = response.data.mediaURL.startsWith("http")
            ? response.data.mediaURL
            : `${apiBaseUrl}/${response.data.mediaURL}`;
          setImages([fullImageUrl]);
        } else {
          // Use sample images if no media URL
          setImages(sampleImages);
        }
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

  // Image carousel navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle approve action
  const handleApprove = async () => {
    if (!serviceDetails) return;

    try {
      setLoading(true);

      const response =
        await MedicalGeneralServices.MedicalGeneralServicesAdminApproveReject({
          id: serviceDetails.id,
          newStatusId: StatusEnum.APPROVED,
          requestNumber: serviceDetails.requestNumber,
          reason: "Request approved by admin",
        });

      if (response && response.success) {
        await fetchServiceDetails();

        showToast(
          `Request ${serviceDetails.requestNumber} has been approved successfully!`,
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
        `Failed to approve request ${serviceDetails.requestNumber}. Please try again.`,
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
        await MedicalGeneralServices.MedicalGeneralServicesAdminApproveReject({
          id: serviceDetails.id,
          newStatusId: StatusEnum.REJECTED,
          requestNumber: serviceDetails.requestNumber,
          reason: rejectionReason.trim(),
        });

      if (response && response.success) {
        setShowRejectModal(false);
        setRejectionReason("");
        await fetchServiceDetails();

        showToast(
          `Request ${serviceDetails.requestNumber} has been rejected`,
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
        `Failed to reject request ${serviceDetails.requestNumber}. Please try again.`,
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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
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
            <h1 className="text-xl font-bold text-gray-900">
              Medical General Service Details
            </h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {/* Image Gallery Section */}
          <div className="mb-8">
            <div className="flex gap-4 h-[500px]">
              {/* Main Image */}
              <div className="flex-1 relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={`Service image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/img/hospital_img.jpg";
                  }}
                />

                {/* Navigation Arrows - Only show if multiple images */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
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
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="w-32 flex flex-col gap-3">
                  {images.slice(0, 3).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-full h-32 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/img/hospital_img.jpg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Company Information Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Name */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {serviceDetails.orderTitle || "Order Title"}
                </h2>

                {/* Location and Status */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
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
                    <span className="text-gray-700">
                      {serviceDetails.city}, {serviceDetails.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="text-green-600 font-medium">
                      30 Days Left
                    </span>
                  </div>
                </div>

                {/* Key Details Section - Clean Minimalist Design */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Key Details:
                  </h3>

                  <div className="space-y-4">
                    {/* Number of Bags */}
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-black"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-black">
                        Number of Bags : {serviceDetails.numberOfBags} bags
                      </span>
                    </div>

                    {/* Other Details */}
                    {serviceDetails.otherTermsAndCondition && (
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-black mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <span className="font-bold text-black">
                            Other Details :{" "}
                          </span>
                          <p className="text-black mt-1 leading-relaxed">
                            {serviceDetails.otherTermsAndCondition}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 h-[400px]">
                <div className="h-full bg-gray-100 rounded-lg relative overflow-hidden">
                  {/* Mock Map */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                    {/* Map-like background */}
                    <div className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="absolute top-8 right-8 w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="absolute bottom-8 left-8 w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-3 h-3 bg-green-500 rounded-full"></div>

                    {/* Location pin */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <svg
                        className="w-8 h-8 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>

                    {/* Location info box */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-4 shadow-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {serviceDetails.orderTitle || "Medical General Service"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {serviceDetails.address}, {serviceDetails.city},{" "}
                        {serviceDetails.country}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        District: {serviceDetails.district} | Region:{" "}
                        {serviceDetails.region}
                      </p>
                    </div>
                  </div>

                  {/* Redirect button */}
                  <button className="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors">
                    Redirect to location
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {serviceDetails?.eName === "Pending" && (
            <div className="mt-12 flex justify-center gap-4">
              <button
                onClick={handleReject}
                className="px-12 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="px-12 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Approve
              </button>
            </div>
          )}
        </div>

        {/* Reject Reason Modal - Same design as Service3DetailPage */}
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
      </div>
    </DashboardLayout>
  );
};

export default Service81Details;
