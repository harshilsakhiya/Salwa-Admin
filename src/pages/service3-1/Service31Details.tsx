import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import IndividualClinicService from "../../services/IndividualClinicService";
import MedicalEquipmentAndFacilitiesService from "../../services/MedicalEquipmentAndFacilitiesService";
import { useToast } from "../../components/ToastProvider";
import {
  getStatusBadgeClass,
  getStatusName,
  StatusEnum,
} from "../../utils/statusEnum";

interface ServiceDetails {
  RequestId: number;
  RequestNumber: string;
  ContactPersonName: string;
  ContactPersonEmail: string;
  OrderPostValidityTime: number;
  OrderPostValidityTimeName: string;
  LocationId: number;
  DiscountType: boolean;
  DiscountValue: number;
  OrderTitle: string;
  DeviceName: string;
  DeviceServiceType: number;
  FDANumber: string;
  PostValidityTime: number;
  PostValidityTimeName: string;
  DeviceApprovalNumber: string;
  OtherTermsAndConditions: string;
  EquipmentDamageInfo: string;
  SellValue: number;
  MediaFilePath: string;
  IsConfirmedOwner: boolean;
  IsSterilizationConfirmed: boolean;
  CreatedBy: number;
  CreatedDate: string;
  UpdatedBy: number;
  UpdatedDate: string;
  DeletedBy: number | null;
  DeletedDate: string | null;
  IsActive: boolean;
  CategoryId: number;
  ServiceId: number;
  IsTermCondition: boolean;
  ServiceType: number;
  StatusId: number;
  StatusName: string;
  Country: string;
  Region: string;
  City: string;
  District: string;
  NationalAddress: string;
  Address: string;
  Latitude: string;
  Longitude: string;
  BusinessName: string;
  DeviceTypeName: string;
  DayLeft: string;
}

const sampleImages = [
  "/img/hospital_img.jpg",
  "/img/hospital_img (2).jpg",
  "/img/hospital_img (3).jpg",
];

const Service31Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>(sampleImages);
  const [searchRequestNumber, setSearchRequestNumber] = useState("");



  const fetchServiceDetailsByRequestNumber = async (requestNumber?: string) => {
    try {
      setLoading(true);
      setError(null);

      const searchParam = requestNumber || id;
      if (!searchParam) {
        setError("Request ID or Request Number not provided");
        setLoading(false);
        return;
      }

      const response: any =
        await MedicalEquipmentAndFacilitiesService.GetMedicalSellServiceByRequestNumber(
          searchParam as string
        );

      if (response && response.success) {
        setServiceDetails(response.data);

        if (response.data.MediaFilePath) {
          setImages([response.data.MediaFilePath]);
        } else {
          setImages(sampleImages);
        }
      } else {
        throw new Error(
          (response as any)?.message || "Failed to fetch service details"
        );
      }
    } catch (err) {
      console.error("Error fetching service details by request number:", err);
      setError("Failed to load service details");
      showToast("Failed to load service details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByRequestNumber = () => {
    if (searchRequestNumber.trim()) {
      fetchServiceDetailsByRequestNumber(searchRequestNumber.trim());
    } else {
      showToast("Please enter a request number", "error");
    }
  };


  useEffect(() => {
    fetchServiceDetailsByRequestNumber();
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

      const response = await IndividualClinicService.UpdateStatus({
        requestId: serviceDetails.RequestId,
        statusId: StatusEnum.APPROVED,
        reason: "Request approved by admin",
      });

      if (response && response.success) {
        await fetchServiceDetailsByRequestNumber();

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

  const handleReject = async () => {
    if (!serviceDetails) return;



    try {
      setLoading(true);

      const response = await IndividualClinicService.UpdateStatus({
        requestId: serviceDetails.RequestId,
        statusId: StatusEnum.REJECTED,
        reason: "Request rejected by admin",
      });

      if (response && response.success) {
        await fetchServiceDetailsByRequestNumber();

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
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Service 3-1 Details
              </h1>
              {serviceDetails && (
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
              )}
            </div>
          </div>

          {/* Search by Request Number */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="requestNumber" className="text-sm font-medium text-gray-700">
                Search by Request Number:
              </label>
              <input
                id="requestNumber"
                type="text"
                value={searchRequestNumber}
                onChange={(e:any) => setSearchRequestNumber(e.target.value)}
                placeholder="Enter request number"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={handleSearchByRequestNumber}
                disabled={loading}
                className="px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1  gap-8">
          <div className="space-y-6">
            <div className="relative">
              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={`Service image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/img/hospital_img.jpg";
                  }}
                />

                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
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
              </div>

              <div className="flex gap-2 mt-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${index === currentImageIndex
                      ? "border-primary"
                      : "border-gray-200"
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
            </div>


          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {serviceDetails.OrderTitle}
              </h2>
              <div className="space-y-4">
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
                  <span className="text-gray-700">{serviceDetails.City}, {serviceDetails.Country}</span>
                  <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {serviceDetails.DayLeft} Days Left
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="">
                    <span className="text-gray-600">Request Number:</span>
                    <span className="font-medium">
                      {serviceDetails.RequestNumber}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-gray-600">Contact Person:</span>
                    <span className="font-medium">
                      {serviceDetails.ContactPersonName}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-gray-600">Contact Email:</span>
                    <span className="font-medium">
                      {serviceDetails.ContactPersonEmail}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-gray-600">Device Name:</span>
                    <span className="font-medium">
                      {serviceDetails.DeviceName}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-gray-600">Device Type:</span>
                    <span className="font-medium">
                      {serviceDetails.DeviceTypeName}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-gray-600">FDA Number:</span>
                    <span className="font-medium">
                      {serviceDetails.FDANumber}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-gray-600">Sell Value:</span>
                    <span className="font-medium">
                      {serviceDetails.SellValue} SAR
                    </span>
                  </div>
                  <div className="">
                    <span className="text-gray-600">Business Name:</span>
                    <span className="font-medium">
                      {serviceDetails.BusinessName}
                    </span>
                  </div>
                  <div className="">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium">
                      {serviceDetails.Address}
                    </span>
                  </div>
                </div>

                {serviceDetails.OtherTermsAndConditions && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Terms & Conditions:
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {serviceDetails.OtherTermsAndConditions}
                    </p>
                  </div>
                )}

                {serviceDetails.EquipmentDamageInfo && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Equipment Damage Info:
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {serviceDetails.EquipmentDamageInfo}
                    </p>
                  </div>
                )}
              </div>
            </div>
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
                    <p className="text-gray-500 mb-2">Riyadh Medical Center</p>
                    <p className="text-sm text-gray-400">
                      123 Healthcare Avenue, Riyadh, MD 10001
                    </p>
                    <button className="mt-4 px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors">
                      Redirect to location
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Show Approve/Reject buttons only when status is Pending */}
        {serviceDetails.StatusId === StatusEnum.PENDING && (
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
      </div>
    </DashboardLayout>
  );
};

export default Service31Details;

