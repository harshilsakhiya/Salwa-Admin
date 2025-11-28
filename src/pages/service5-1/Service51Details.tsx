import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import MedicalStaffService from "../../services/medicalStaffService";
import { useToast } from "../../components/ToastProvider";
import {
  getStatusBadgeClass,
  getStatusName,
  StatusEnum,
} from "../../utils/statusEnum";

interface ServiceDetails {
  RequestId: number;
  RequestNumber: string;
  OrderTitle: string;
  BuildingLicenseNumber: string;
  MedicalLicenseNumber: string;
  WorkingEmp: number;
  ContactPersonName: string;
  ContactEmail: string;
  StatusId: number;
  StatusName: string;
  CreatedDate: string;
  UpdatedDate: string;
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
  DeletedDate: string | null;
  City?: string;
  Region?: string;
  Country?: string;
  Classification?: string;
  Speciality?: string;
  ReligionName?: string;
  JobTypeName?: string;
  JobClassfication?: string;
  RoleName?: string;
  NationalityName?: string;
  GenderName?: string;
  Experience?: string;
  JobShiftName?: string;
}

const sampleImages = [
  "/img/hospital_img.jpg",
  "/img/hospital_img (2).jpg",
  "/img/hospital_img (3).jpg",
  "/img/hospital_img (4).jpg",
  "/img/hospital_img (5).jpg",
];

const Service51Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>(sampleImages);
  
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

      const response: any =
        await MedicalStaffService.GetAllMedicalRecruitmentJobByRequestNumber(
          id
        );

      if (response && response.success) {
        setServiceDetails(response.data);

        if (response.data.Media) {
          try {
            const mediaUrls = JSON.parse(response.data.Media);
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
  }, [id, showToast]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const handleApprove = async () => {
    if (!serviceDetails) return;

    try {
      setLoading(true);

      const response = await MedicalStaffService.MedicalRecruitmentJobAdminApproveReject({
        RequestId: serviceDetails.RequestId,
        NewStatusId: StatusEnum.APPROVED,
        RequestNumber: serviceDetails?.RequestNumber,
        Reason: "Request approved by admin",
      });

      if (response && response.success) {
        await fetchServiceDetails();

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

  // Handle reject action - open modal instead of direct rejection
  const handleReject = () => {
    if (!serviceDetails) return;
    setShowRejectModal(true);
    setRejectionReason("");
  };
// -------------------------------------------
  // Handle reject confirmation with reason
  const handleRejectSubmit = async () => {
    if (!serviceDetails || !rejectionReason.trim()) {
      showToast("Please provide a reason for rejection", "error");
      return;
    }

    try {
      setLoading(true);

      const response =
        await MedicalStaffService.MedicalRecruitmentJobAdminApproveReject({
          RequestId: serviceDetails.RequestId,
          NewStatusId: StatusEnum.REJECTED,
          RequestNumber: serviceDetails?.RequestNumber,
          Reason: rejectionReason.trim(),
        });

      if (response && response.success) {
        setShowRejectModal(false);
        setRejectionReason("");
        await fetchServiceDetails();

        showToast(
          `Request ${serviceDetails.RequestNumber} has been rejected`,
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
        `Failed to reject request ${serviceDetails.RequestNumber}. Please try again.`,
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
      <div className="p-6">
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
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-6">
            <div className="relative">
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {serviceDetails.OrderTitle}
                </h2>
                <div className="flex items-center gap-2 mb-4">
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
              <div className="space-y-6">

              {/* Location + Days Left */}
              <div className="flex items-center gap-2 text-gray-500">
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

                <span className="text-gray-500">
                  {serviceDetails.City}, {serviceDetails.Country}
                </span>

                <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  30 Days Left
                </span>
              </div>

              {/* Title */}
              <h2 className="font-semibold text-lg text-gray-700">Key Details:</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3 text-sm">
                  <p>• <b>Issuing of Classification :</b> <span className="text-gray-500">{serviceDetails.Classification}</span></p>
                  <p>• <b>Speciality :</b> <span className="text-gray-500">{serviceDetails.Speciality}</span></p>
                  <p>• <b>Religion :</b> <span className="text-gray-500">{serviceDetails.ReligionName}</span></p>
                  <p>• <b>Job Type :</b> <span className="text-gray-500">{serviceDetails.JobTypeName}</span></p>
                  <p>• <b>Classification :</b> <span className="text-gray-500">{serviceDetails.JobClassfication}</span></p>
                  <p>• <b>HR Email :</b> <span className="text-gray-500">example@gmail.com</span></p>
                </div>

                <div className="space-y-3 text-sm">
                  <p>• <b>Role :</b> <span className="text-gray-500">{serviceDetails.RoleName}</span></p>
                  <p>• <b>Nationality :</b> <span className="text-gray-500">{serviceDetails.NationalityName}</span></p>
                  <p>• <b>Gender :</b> <span className="text-gray-500">{serviceDetails.GenderName}</span></p>
                  <p>• <b>Job Shift :</b> <span className="text-gray-500">{serviceDetails.JobShiftName}</span></p>
                  <p>• <b>Experience :</b> <span className="text-gray-500">{serviceDetails.Experience}</span></p>
                </div>

              </div>

              {/* Terms & Conditions */}
              {serviceDetails.OtherTermsAndCon && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                    Terms & Condition :
                  </h3>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    {serviceDetails.OtherTermsAndCon}
                  </p>
                </div>
              )}
            </div>

            </div>
          </div>
        </div>

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

export default Service51Details;

