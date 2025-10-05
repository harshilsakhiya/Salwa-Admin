import { type FC, useState, useEffect } from "react";
import { useToast } from "../ToastProvider";
import type { SuperAdminRecord } from "../../services/superAdminService";
import SupervisorServices from "../../services/SupervisorServices/SupervisorServices";

interface SupervisorFormProps {
    mode: "add" | "view" | "edit";
    record?: SuperAdminRecord;
    onCancel: () => void;
    onSuccess?: () => void;
}

const SupervisorForm: FC<SupervisorFormProps> = ({
    mode,
    record,
    onCancel,
    onSuccess,
}) => {
    const { showToast } = useToast();

    // Form state management
    const [formData, setFormData] = useState({
        employeeId: record?.employeeId || 0,
        firstName: record?.firstName || "",
        middleName: record?.middleName || "",
        lastName: record?.lastName || "",
        idNumber: record?.idNumber || "",
        idExpiryDate: record?.idExpiryDate || "",
        dateOfBirth: record?.dateOfBirth || "",
        graduationCertificate: record?.graduationCertificate || "",
        acquiredLanguages: record?.acquiredLanguages || "",
        telephone: record?.telephone || "",
        officialEmail: record?.officialEmail || "",
        type: record?.type || 0,
        country: record?.country || "",
        region: record?.region || "",
        city: record?.city || "",
        nationalAddress: record?.nationalAddress || "",
        address: record?.address || "",
        latitude: record?.latitude || "",
        longitude: record?.longitude || "",
        bankName: record?.bankName || "",
        ibanNumber: record?.ibanNumber || "",
        password: record?.password || "",
        otp: record?.otp || 0,
        isPasswordset: record?.isPasswordset || 0,
        isOtpVerify: record?.isOtpVerify || 0,
        isMobileNoVerify: record?.isMobileNoVerify || true,
        createdBy: record?.createdBy || 0,
        updatedBy: record?.updatedBy || 0,
        isActive: record?.isActive || false,
        statusId: record?.statusId || 0
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const isReadOnly = mode === "view";
    const isAdd = mode === "add";

    // Fetch complete record data when component mounts (for edit/view modes)
    useEffect(() => {
        const fetchRecordData = async () => {
            if (record?.employeeId && (mode === "edit" || mode === "view")) {
                setLoading(true);
                try {
                    const response = await SupervisorServices.GetSuperAdminById(record.employeeId);
                    console.log("Fetched record data:", response);

                    if (response?.success && 'data' in response && response.data) {
                        const recordData = response.data;
                        setFormData({
                            employeeId: recordData.employeeId || 0,
                            firstName: recordData.firstName || "",
                            middleName: recordData.middleName || "",
                            lastName: recordData.lastName || "",
                            idNumber: recordData.idNumber || "",
                            idExpiryDate: recordData.idExpiryDate || "",
                            dateOfBirth: recordData.dateOfBirth || "",
                            graduationCertificate: recordData.graduationCertificate || "",
                            acquiredLanguages: recordData.acquiredLanguages || "",
                            telephone: recordData.telephone || "",
                            officialEmail: recordData.officialEmail || "",
                            type: recordData.type || 0,
                            country: recordData.country || "",
                            region: recordData.region || "",
                            city: recordData.city || "",
                            nationalAddress: recordData.nationalAddress || "",
                            address: recordData.address || "",
                            latitude: recordData.latitude || "",
                            longitude: recordData.longitude || "",
                            bankName: recordData.bankName || "",
                            ibanNumber: recordData.ibanNumber || "",
                            password: recordData.password || "",
                            otp: recordData.otp || 0,
                            isPasswordset: recordData.isPasswordset || 0,
                            isOtpVerify: recordData.isOtpVerify || 0,
                            isMobileNoVerify: recordData.isMobileNoVerify || true,
                            createdBy: recordData.createdBy || 0,
                            updatedBy: recordData.updatedBy || 0,
                            isActive: recordData.isActive || false,
                            statusId: recordData.statusId || 0
                        });
                    } else {
                        showToast("Failed to fetch supervisor details", "error");
                    }
                } catch (error) {
                    console.error("Error fetching record data:", error);
                    showToast("Failed to fetch supervisor details", "error");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchRecordData();
    }, [record?.employeeId, mode, showToast]);

    const getTitle = () => {
        switch (mode) {
            case "add":
                return "Add New Supervisor";
            case "view":
                return "View Supervisor Details";
            case "edit":
                return "Edit Supervisor";
            default:
                return "Supervisor Form";
        }
    };

    const getDescription = () => {
        switch (mode) {
            case "add":
                return "Fill in the details below to add a new supervisor";
            case "view":
                return "View supervisor information and details";
            case "edit":
                return "Update supervisor information and details";
            default:
                return "Supervisor information";
        }
    };

    // Form validation
    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.firstName.trim()) errors.firstName = "First name is required";
        if (!formData.lastName.trim()) errors.lastName = "Last name is required";
        if (!formData.idNumber.trim()) errors.idNumber = "ID Number is required";
        if (!formData.telephone.trim()) errors.telephone = "Telephone is required";
        if (!formData.officialEmail.trim()) errors.officialEmail = "Email is required";
        if (!formData.country.trim()) errors.country = "Country is required";
        if (!formData.region.trim()) errors.region = "Region is required";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.address.trim()) errors.address = "Address is required";
        if (!formData.bankName.trim()) errors.bankName = "Bank name is required";
        if (!formData.ibanNumber.trim()) errors.ibanNumber = "IBAN number is required";

        if (formData.officialEmail && !/\S+@\S+\.\S+/.test(formData.officialEmail)) {
            errors.officialEmail = "Please enter a valid email";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Form submission
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            let response: any;

            if (isAdd) {
                // Add new supervisor
                response = await SupervisorServices.UpsertSuperAdmin(formData);
                console.log("Add response:", response);
                if (response?.success) {
                    showToast("Supervisor added successfully!", "success");
                    onSuccess?.();
                } else {
                    showToast(response?.data?.message || "Failed to add supervisor", "error");
                }
            } else {
                // Update existing supervisor
                response = await SupervisorServices.UpdateSuperAdmin(formData.employeeId, formData, formData.idNumber);
                console.log("Update response:", response);
                if (response?.success) {
                    showToast("Supervisor updated successfully!", "success");
                    onSuccess?.();
                } else {
                    showToast(response?.data?.message || "Failed to update supervisor", "error");
                }
            }
        } catch (error) {
            console.error("Form submission error:", error);
            const message = error instanceof Error ? error.message : `Failed to ${isAdd ? "add" : "update"} supervisor`;
            showToast(message, "error");
        }
    };

    // Input change handler
    const handleInputChange = (field: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: "" }));
        }
    };


    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden main-content-scroll px-2 sm:px-3 lg:px-5">
            <div className="w-full">
                <div className="bg-white rounded-[32px] p-8 shadow-sm h-full">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">{getTitle()}</h2>
                                <p className="text-sm text-gray-500">{getDescription()}</p>
                            </div>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-500">Loading supervisor details...</p>
                                </div>
                            </div>
                        ) : (

                            <form onSubmit={handleFormSubmit} className="space-y-8">
                                {/* General Information Section */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">General Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.firstName ? "border-red-500" : "border-gray-300"
                                                    } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                                placeholder="Enter first name"
                                                readOnly={isReadOnly}
                                            />
                                            {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                                            <input
                                                type="text"
                                                value={formData.middleName}
                                                onChange={(e) => handleInputChange("middleName", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
                                                    }`}
                                                placeholder="Enter middle name"
                                                readOnly={isReadOnly}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.lastName ? "border-red-500" : "border-gray-300"
                                                    } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                                placeholder="Enter last name"
                                                readOnly={isReadOnly}
                                            />
                                            {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">ID Number / IQAMA Number *</label>
                                            <input
                                                type="text"
                                                value={formData.idNumber}
                                                onChange={(e) => handleInputChange("idNumber", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.idNumber ? "border-red-500" : "border-gray-300"
                                                    } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                                placeholder="Enter ID number"
                                                readOnly={isReadOnly}
                                            />
                                            {formErrors.idNumber && <p className="text-red-500 text-xs mt-1">{formErrors.idNumber}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">ID Expiry Date</label>
                                            <input
                                                type="date"
                                                value={formData.idExpiryDate}
                                                onChange={(e) => handleInputChange("idExpiryDate", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
                                                    }`}
                                                readOnly={isReadOnly}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
                                                    }`}
                                                readOnly={isReadOnly}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Certificate</label>
                                            <input
                                                type="text"
                                                value={formData.graduationCertificate}
                                                onChange={(e) => handleInputChange("graduationCertificate", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
                                                    }`}
                                                placeholder="Enter graduation certificate"
                                                readOnly={isReadOnly}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Acquired Languages</label>
                                            <input
                                                type="text"
                                                value={formData.acquiredLanguages}
                                                onChange={(e) => handleInputChange("acquiredLanguages", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
                                                    }`}
                                                placeholder="Enter languages"
                                                readOnly={isReadOnly}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Telephone *</label>
                                            <div className="flex">
                                                <select
                                                    className={`px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
                                                        }`}
                                                    disabled={isReadOnly}
                                                >
                                                    <option>+966</option>
                                                    <option>+1</option>
                                                    <option>+44</option>
                                                </select>
                                                <input
                                                    type="tel"
                                                    value={formData.telephone}
                                                    onChange={(e) => handleInputChange("telephone", e.target.value)}
                                                    className={`flex-1 px-3 py-2 border border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.telephone ? "border-red-500" : "border-gray-300"
                                                        } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                                    placeholder="566 645 122"
                                                    readOnly={isReadOnly}
                                                />
                                            </div>
                                            {formErrors.telephone && <p className="text-red-500 text-xs mt-1">{formErrors.telephone}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Official Email *</label>
                                            <input
                                                type="email"
                                                value={formData.officialEmail}
                                                onChange={(e) => handleInputChange("officialEmail", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.officialEmail ? "border-red-500" : "border-gray-300"
                                                    } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                                placeholder="Enter email address"
                                                readOnly={isReadOnly}
                                            />
                                            {formErrors.officialEmail && <p className="text-red-500 text-xs mt-1">{formErrors.officialEmail}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => handleInputChange("type", parseInt(e.target.value))}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
                                                    }`}
                                                disabled={isReadOnly}
                                            >
                                                <option value={0}>Operational Supervisor</option>
                                                <option value={1}>Operational Employee</option>
                                                <option value={2}>Finance Supervisor</option>
                                                <option value={3}>Finance Employee</option>
                                                <option value={4}>IT Support Employee</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                                            <input
                                                type="text"
                                                value={formData.country}
                                                onChange={(e) => handleInputChange("country", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.country ? "border-red-500" : "border-gray-300"
                                                    } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                                placeholder="Enter country"
                                                readOnly={isReadOnly}
                                            />
                                            {formErrors.country && <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Region *</label>
                                            <input
                                                type="text"
                                                value={formData.region}
                                                onChange={(e) => handleInputChange("region", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.region ? "border-red-500" : "border-gray-300"
                                                    } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                                placeholder="Enter region"
                                                readOnly={isReadOnly}
                                            />
                                            {formErrors.region && <p className="text-red-500 text-xs mt-1">{formErrors.region}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                            <input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => handleInputChange("city", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.city ? "border-red-500" : "border-gray-300"
                                                    } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                                placeholder="Enter city"
                                                readOnly={isReadOnly}
                                            />
                                            {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">National Address - SPL</label>
                                            <input
                                                type="text"
                                                value={formData.nationalAddress}
                                                onChange={(e) => handleInputChange("nationalAddress", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
                                                    }`}
                                                placeholder="YADD3344"
                                                readOnly={isReadOnly}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={(e) => handleInputChange("address", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.address ? "border-red-500" : "border-gray-300"
                                                    } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                                placeholder="Idara St, King Abdul Aziz University, Jeddah"
                                                readOnly={isReadOnly}
                                            />
                                            {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                                        </div>
                                    </div>

                                    {/* Map placeholder */}
                                    <div className="mt-6">
                                        <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-2"></div>
                                                <p className="text-gray-500">Map Component</p>
                                                {!isReadOnly && (
                                                    <button
                                                        type="button"
                                                        className="mt-2 px-4 py-2 bg-black text-white rounded-md text-sm"
                                                    >
                                                        Get Direction
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bank Information Section */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Bank Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                                            <input
                                                type="text"
                                                value={formData.bankName}
                                                onChange={(e) => handleInputChange("bankName", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.bankName ? "border-red-500" : "border-gray-300"
                                                    } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                                placeholder="Enter bank name"
                                                readOnly={isReadOnly}
                                            />
                                            {formErrors.bankName && <p className="text-red-500 text-xs mt-1">{formErrors.bankName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">IBAN Number *</label>
                                            <input
                                                type="text"
                                                value={formData.ibanNumber}
                                                onChange={(e) => handleInputChange("ibanNumber", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.ibanNumber ? "border-red-500" : "border-gray-300"
                                                    } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                                placeholder="Enter IBAN number"
                                                readOnly={isReadOnly}
                                            />
                                            {formErrors.ibanNumber && <p className="text-red-500 text-xs mt-1">{formErrors.ibanNumber}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                {!isReadOnly && (
                                    <div className="flex justify-center pt-6">
                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                                        >
                                            {isAdd ? "Save" : "Update"}
                                        </button>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorForm;