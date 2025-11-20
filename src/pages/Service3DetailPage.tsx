import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import OfficeStationaryService from "../services/OfficeStationaryService";
import { useToast } from "../components/ToastProvider";
import { StatusEnum } from "../utils/statusEnum";

interface Service3Detail {
    RequestId: number;
    CategoryId: number;
    ServiceId: number;
    RequestNumber: string;
    ContactPersonName: string;
    ContactPersonEmail: string;
    LocationId: number;
    OtherDetails: string;
    IsComfirmation: boolean | null;
    IsTermsandConditon: boolean | null;
    StatusId: number;
    IsActive: number;
    StatusName: string;
    PostValidityTime: number;
    UniformType: number;
    UniformTypeName: string;
    OrderTitle: string;
    Gender: number;
    GenderName: string;
    Size: string;
    PostValidityTimeName: string;
    ProductTypeAndColor: string;
    Offers: string | null;
}

const Service3DetailPage = () => {
    const { projectId } = useParams<{ projectId: string }>();


    const navigate = useNavigate();

    const [projectDetail, setProjectDetail] = useState<Service3Detail | null>(null);
    const [loading, setLoading] = useState(true);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        // Simulate API call to fetch project details
        const fetchProjectDetail = async () => {
            setLoading(true);

            // Mock data based on the design
            const response: any = await OfficeStationaryService?.GetDoctorUniformClothingByRequestNumber(projectId as string);
            if (response?.success && response?.data) {
                setProjectDetail(response.data?.[0]);
            } else {
                showToast(response?.message, "error");

            }
            setLoading(false);
        };

        if (projectId) {
            fetchProjectDetail();
        }
    }, [projectId]);

    const handleApprove = async () => {
        if (!projectDetail) {
            showToast("No project data available", "error");
            return;
        }

        setIsApproving(true);
        try {
            const response = await OfficeStationaryService.UpdateDoctorUniformClothingStatus({
                RequestId: projectDetail.RequestId,
                NewStatusId: StatusEnum.APPROVED,
                RequestNumber: projectDetail.RequestNumber,
                Reason: "Request approved by admin",
            });

            if (response?.success) {
                showToast("Request approved successfully!", "success");
                // Refresh the data
                const updatedResponse = await OfficeStationaryService?.GetDoctorUniformClothingByRequestNumber(projectId as string);
                if (updatedResponse?.success && (updatedResponse as any)?.data) {
                    setProjectDetail((updatedResponse as any).data?.[0]);
                }
            } else {
                showToast("Failed to approve request", "error");
            }
        } catch (error) {
            console.error("Error approving request:", error);
            showToast("Failed to approve request", "error");
        } finally {
            setIsApproving(false);
        }
    };

    const handleReject = () => {
        setShowRejectModal(true);
    };

    const handleRejectSubmit = async () => {
        if (!projectDetail) {
            showToast("No project data available", "error");
            return;
        }

        if (!rejectionReason.trim()) {
            showToast("Please provide a reason for rejection.", "error");
            return;
        }

        setIsRejecting(true);
        try {
            const response = await OfficeStationaryService.UpdateDoctorUniformClothingStatus({
                RequestId: projectDetail.RequestId,
                NewStatusId: StatusEnum.REJECTED,
                RequestNumber: projectDetail.RequestNumber,
                Reason: rejectionReason.trim(),
            });

            if (response?.success) {
                showToast("Request rejected successfully!", "success");
                // Reset and close modal
                setRejectionReason("");
                setShowRejectModal(false);
                // Refresh the data
                const updatedResponse = await OfficeStationaryService?.GetDoctorUniformClothingByRequestNumber(projectId as string);
                if (updatedResponse?.success && (updatedResponse as any)?.data) {
                    setProjectDetail((updatedResponse as any).data?.[0]);
                }
            } else {
                showToast("Failed to reject request", "error");
            }
        } catch (error) {
            console.error("Error rejecting request:", error);
            showToast("Failed to reject request", "error");
        } finally {
            setIsRejecting(false);
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

    if (!projectDetail) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-500">Project not found</p>
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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>

                    {/* Project Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        {projectDetail.OrderTitle}
                    </h1>

                    {/* Request Number and Status */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                            Request Number: {projectDetail.RequestNumber}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${projectDetail.StatusId === 99 ? 'bg-yellow-100 text-yellow-800' :
                                projectDetail.StatusId === 100 ? 'bg-green-100 text-green-800' :
                                    projectDetail.StatusId === 101 ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {projectDetail.StatusName}
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-200 mb-8" />

                    {/* Key Details */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Details:</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                <span className="text-gray-700">
                                    <strong>Contact Person Name:</strong> {projectDetail.ContactPersonName}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                <span className="text-gray-700">
                                    <strong>Contact Person Email:</strong> {projectDetail.ContactPersonEmail}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                <span className="text-gray-700">
                                    <strong>Uniform Type:</strong> {projectDetail.UniformTypeName}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                <span className="text-gray-700">
                                    <strong>Gender:</strong> {projectDetail.GenderName}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                <span className="text-gray-700">
                                    <strong>Size:</strong> {projectDetail.Size}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                <span className="text-gray-700">
                                    <strong>Post Validity Time:</strong> {projectDetail.PostValidityTime} {projectDetail.PostValidityTimeName}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Product Details Table */}
                    <div className="mb-8">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                                        <div className="flex items-center gap-2">
                                            Order No
                                            <div className="flex flex-col">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                                </svg>
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                                        Order Title
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                                        Uniform Type
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                                        Gender
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                                        Size
                                    </th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                                        Product Type & Color
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-900">
                                        {projectDetail.RequestNumber}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-900">
                                        {projectDetail.OrderTitle}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-900">
                                        {projectDetail.UniformTypeName}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-900">
                                        {projectDetail.GenderName}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-900">
                                        {projectDetail.Size}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-900">
                                        {(() => {
                                            try {
                                                const productData = JSON.parse(projectDetail.ProductTypeAndColor);
                                                return productData.map((item: any, index: number) => (
                                                    <div key={index} className="mb-1">
                                                        <span className="font-medium">{item.productType}</span>
                                                        <span className="text-gray-500 ml-2">({item.color})</span>
                                                    </div>
                                                ));
                                            } catch (error) {
                                                return <span className="text-gray-500">Invalid product data</span>;
                                            }
                                        })()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Other Details */}
                    <div className="mb-12">
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Other Details:</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {projectDetail.OtherDetails}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Only show when status is PENDING */}
                    {projectDetail.StatusId === StatusEnum.PENDING && (
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleReject}
                                disabled={isRejecting}
                                className={`px-8 py-3 font-semibold rounded-lg transition-colors ${isRejecting
                                    ? 'bg-gray-100 border-2 border-gray-300 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {isRejecting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                        Rejecting...
                                    </div>
                                ) : (
                                    'Reject'
                                )}
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={isApproving}
                                className={`px-8 py-3 font-semibold rounded-lg transition-colors ${isApproving
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                                    }`}
                            >
                                {isApproving ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Approving...
                                    </div>
                                ) : (
                                    'Approve'
                                )}
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
                                disabled={isRejecting}
                                className={`px-8 py-3 font-semibold rounded-lg transition-colors ${isRejecting
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                                    }`}
                            >
                                {isRejecting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </div>
                                ) : (
                                    'Send'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Service3DetailPage;
