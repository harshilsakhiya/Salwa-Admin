import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import IndividualClinicService from "../services/IndividualClinicService";
import { useToast } from "../components/ToastProvider";
import {
  getStatusBadgeClass,
  getStatusName,
  StatusEnum,
} from "../utils/statusEnum";

interface ServiceDetails {
  RequestId: number;
  RequestNumber: string;
  OrderTitle: string;
  buildingLicenseNumber: string;
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
  Address?: string;
  City?: string;
  Region?: string;
  Country?: string;
}

// Sample images for carousel (you can replace with actual images from API)
const sampleImages = [
  "/img/hospital_img.jpg",
  "/img/hospital_img (2).jpg",
  "/img/hospital_img (3).jpg",
  "/img/hospital_img (4).jpg",
  "/img/hospital_img (5).jpg",
];

const SubServicesDetails7 = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(
    null
  );
  console.log("serviceDetails", serviceDetails);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>(sampleImages);

  // --- New states for reject modal ---
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [submittingReject, setSubmittingReject] = useState(false);

  // -- states for accept modal --
  // --- Accept modal states ---
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [acceptedOrderNumber, setAcceptedOrderNumber] = useState<string | null>(null);
  const [acceptedDate, setAcceptedDate] = useState<string | null>(null);

  // uploaded image path (will be transformed to url by your environment)
  const acceptImageUrl = "/mnt/data/b7c89c44-a25a-4d87-a63a-73bdbcace1c4.png";


  // Fetch service details
  const fetchServiceDetails = async () => {
    if (!requestId) {
      setError("Request ID not provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response: any =
        await IndividualClinicService.GetIndividualClinicServiceRequestById(
          parseInt(requestId)
        );

      if (response && response.success) {
        // If API returns an array, find the matching requestId item
        // const matched = Array.isArray(response.data)
        //   ?response.data.find(
        //     (x: any) => x.requestId === parseInt(requestId, 10)
        //   )
        //   : response.data;
        const matched = response.data;

        setServiceDetails(matched || null);

        // If API returns media/images, use them; otherwise use sample images
        const mediaValue = (matched && matched.Media) || (response.data && response.data.Media);
        if (mediaValue) {
          try {
            const mediaUrls = JSON.parse(mediaValue);
            if (Array.isArray(mediaUrls) && mediaUrls.length > 0) {
              setImages(mediaUrls);
            }
          } catch (e) {
            console.log("Could not parse media, using sample images");
          }
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
  }, [requestId, showToast]);

  // Image carousel navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle approve action (unchanged)
  const handleApprove = async () => {
    if (!serviceDetails) return;

    try {
      setLoading(true);

      const response = await IndividualClinicService.UpdateStatus({
        requestId: serviceDetails.RequestId,
        statusId: StatusEnum.APPROVED,
        reason: "Request approved by admin",
      });

      if (response && response.success) {
        // Refetch the data to get updated information
        await fetchServiceDetails();

        // prepare modal info (use RequestNumber if you want human-facing order number)
        const orderNumberDisplay = serviceDetails.RequestNumber
          ? `#${serviceDetails.RequestNumber}`
          : `#${String(serviceDetails.RequestId).padStart(4, "0")}`;

        const now = new Date();
        const formatted = now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        setAcceptedOrderNumber(orderNumberDisplay);
        setAcceptedDate(formatted);
        setAcceptModalOpen(true);

        showToast(
          `Request ${serviceDetails.RequestNumber} has been approved successfully!`,
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
        `Failed to approve request ${serviceDetails.RequestNumber}. Please try again.`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };


  // --- Updated handleReject: open modal instead of immediate API call ---
  const handleReject = async () => {
    if (!serviceDetails) return;
    setRejectReason(""); // reset previous reason
    setRejectModalOpen(true);
  };

  // Confirm reject with reason
  const confirmReject = async () => {
  if (!serviceDetails) return;
  if (!rejectReason || rejectReason.trim().length < 3) {
    showToast("Please enter a valid reason (at least 3 characters).", "error");
    return;
  }

  try {
    setSubmittingReject(true);

    const response = await IndividualClinicService.UpdateStatus({
      requestId: serviceDetails.RequestId,
      statusId: StatusEnum.REJECTED,
      reason: rejectReason.trim(),
    });

    if (response && response.success) {
      // close modal, refetch
      setRejectModalOpen(false);
      await fetchServiceDetails();

      showToast(
        `Request ${serviceDetails.RequestNumber} has been rejected.`,
        "success"
      );

      // --- send client-side notification by navigating to notifications route ---
      // try {
      //   const updatedOrder = {
      //     // copy existing details so notifications page has expected data
      //     ...serviceDetails,
      //     // add a friendly status field like other components expect
      //     status: "Rejected",
      //   };

      //   navigate(`/notifications`, {
      //     state: {
      //       order: updatedOrder,
      //       reason: rejectReason.trim(),
      //       timestamp: new Date().toISOString(),
      //     },
      //   });
      // } catch (navErr) {
      //   console.warn("Failed to navigate to notifications:", navErr);
      // }
    } else {
      throw new Error((response as any)?.message || "Failed to reject request");
    }
  } catch (error) {
    console.error("Error rejecting request:", error);
    showToast(
      `Failed to reject request ${serviceDetails?.RequestNumber}. Please try again.`,
      "error"
    );
  } finally {
    setSubmittingReject(false);
  }
};


  // Cancel reject modal
  const cancelReject = () => {
    setRejectModalOpen(false);
    setRejectReason("");
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
                Service Details
              </h1>
              <div className="flex items-center gap-2">
                <div className="h-6 w-px bg-gray-300"></div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                    serviceDetails.StatusId
                  )}`}
                >
                  {getStatusName(serviceDetails.StatusId)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* First Section - Image Gallery */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="relative h-80 bg-gradient-to-br from-blue-50 to-indigo-100">
              <img
                src={images[currentImageIndex]}
                alt={`Service image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/img/hospital_img.jpg";
                }}
              />

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="p-4 bg-gray-50">
              <div className="flex gap-3 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentImageIndex
                      ? "border-blue-500 shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/img/hospital_img.jpg";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Second Section - Service Details */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Service Details
              </h2>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700 font-medium">Jeddah, Saudi Arabia</span>
                </div>
                <span className="bg-gradient-to-r from-green-400 to-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                  {serviceDetails.ValidityTime} Days Left
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm font-medium">Building License:</span>
                      <span className="font-semibold text-gray-900">{serviceDetails.buildingLicenseNumber}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm font-medium">Medical License:</span>
                      <span className="font-semibold text-gray-900">{serviceDetails.MedicalLicenseNumber}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm font-medium">Contact Person:</span>
                      <span className="font-semibold text-gray-900">{serviceDetails.ContactPersonName}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm font-medium">Email:</span>
                      <span className="font-semibold text-gray-900 text-sm">{serviceDetails.ContactEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm font-medium">Employees:</span>
                      <span className="font-semibold text-gray-900">{serviceDetails.WorkingEmp}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm font-medium">FDA Number:</span>
                      <span className="font-semibold text-gray-900">{serviceDetails.TransactionId || "N/A"}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm font-medium">Rent Period:</span>
                      <span className="font-semibold text-gray-900">{serviceDetails.RentPeriod} {serviceDetails.RentPeriodType}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm font-medium">Clinic Hours:</span>
                      <span className="font-semibold text-gray-900">{serviceDetails.ClinicHours}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm font-medium">Sterilization Equipment:</span>
                  <span className={`font-semibold ${serviceDetails.SterilizationEquipmentFlag ? 'text-green-600' : 'text-red-600'}`}>
                    {serviceDetails.SterilizationEquipmentFlag ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {serviceDetails.OtherTermsAndCon && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Terms & Conditions
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {serviceDetails.OtherTermsAndCon}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Third Section - Map */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </h3>
            </div>

            <div className="p-6">
              <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20"></div>
                <div className="text-center relative z-10">
                  <div className="bg-white rounded-full p-4 shadow-lg mb-4 mx-auto w-fit">
                    <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-semibold mb-1">Riyadh Medical Center</p>
                  <p className="text-sm text-gray-500 mb-4">123 Healthcare Avenue, Riyadh, MD 10001</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105">
                    Redirect to location
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handleReject}
            disabled={
              loading || serviceDetails.StatusId === StatusEnum.REJECTED
            }
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject
          </button>
          <button
            onClick={handleApprove}
            disabled={
              loading || serviceDetails.StatusId === StatusEnum.APPROVED
            }
            className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Approve
          </button>
        </div>

        {/* Reject Modal */}
        {rejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* overlay */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={cancelReject}
            />
            {/* modal */}
            <div className="relative bg-white rounded-xl max-w-2xl w-full mx-4 p-6 shadow-2xl z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Reason for Cancellation</h2>
                <button onClick={cancelReject} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Reason*</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={6}
                placeholder="Write the reason for rejection..."
                className="w-full border border-gray-200 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={cancelReject}
                  disabled={submittingReject}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  disabled={submittingReject}
                  className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {submittingReject ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  ) : null}
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Accept Modal */}
        {acceptModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setAcceptModalOpen(false)}
            />
            <div className="relative bg-white rounded-xl max-w-2xl w-full mx-4 p-8 shadow-2xl z-10 text-center">
              <button
                onClick={() => setAcceptModalOpen(false)}
                className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* large graphic (your uploaded image) */}
              <div className="mb-6 flex justify-center">
                <img
                  src={acceptImageUrl}
                  alt="accepted"
                  className="w-28 h-28 object-contain"
                  onError={(e) => {
                    // fallback to an inline SVG check if image isn't available
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M9 16.17L4.83 12 3.41 13.41 9 19l12-12L19.59 5.59z'/></svg>";
                  }}
                />
              </div>

              <h2 className="text-lg font-semibold mb-2">
                Order Number :{" "}
                <span className="font-bold">{acceptedOrderNumber || "#N/A"}</span>
              </h2>

              <p className="text-sm text-gray-700 mb-4">
                Clinic on Worksite Order has been successfully accepted.
              </p>

              <p className="text-xs text-gray-500">
                Order Accepted Date : <span className="font-semibold">{acceptedDate}</span>
              </p>

              <div className="mt-6">
                <button
                  onClick={() => setAcceptModalOpen(false)}
                  className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubServicesDetails7;
