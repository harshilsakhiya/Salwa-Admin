import React, { useState } from 'react';
import { X, ArrowLeft, MapPin, Calendar, Phone, Mail, Building, CreditCard, Shield, FileText, User } from 'lucide-react';

interface UserDetailsViewProps {
  user: any;
  userType: 'Individual' | 'Business' | 'Government';
  onClose: () => void;
}

const UserDetailsView: React.FC<UserDetailsViewProps> = ({ user, userType, onClose }) => {
  const [activeTab, setActiveTab] = useState('general');

  const renderGeneralInfo = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-primary" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.firstName || user.name?.split(' ')[0] || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.middleName || user.name?.split(' ')[1] || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.lastName || user.name?.split(' ')[2] || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Number / IQAMA Number</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.idNo || user.nationalId || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <div className="p-3 bg-gray-50 rounded-lg border flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              {user.dateOfBirth || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.gender || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
            <div className="p-3 bg-gray-50 rounded-lg border flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              {user.phoneNumber || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Official Email</label>
            <div className="p-3 bg-gray-50 rounded-lg border flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              {user.email || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-primary" />
          Location Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.country || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.region || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.city || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.district || 'N/A'}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <div className="p-3 bg-gray-50 rounded-lg border">
            {user.address || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBusinessInfo = () => (
    <div className="space-y-6">
      {/* Business Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="w-5 h-5 mr-2 text-primary" />
          Business Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.businessName || user.name || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.businessType || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Sector</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.businessSector || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.numberOfEmployees || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Revenue</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.subscriptionAmount > 0 ? `$${user.subscriptionAmount.toLocaleString()}` : 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Website</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.businessWebsite || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Person */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Person</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.contactPersonName || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.contactPersonPosition || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="p-3 bg-gray-50 rounded-lg border flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              {user.email || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <div className="p-3 bg-gray-50 rounded-lg border flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              {user.phoneNumber || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGovernmentInfo = () => (
    <div className="space-y-6">
      {/* Government Employee Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="w-5 h-5 mr-2 text-primary" />
          Government Employee Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.employeeId || user.idNo || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Government ID</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.governmentId || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position Title</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.positionTitle || user.name || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Level</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.employmentLevel || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.employmentType || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Grade</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.salaryGrade || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Department Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ministry Name</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.ministryName || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.departmentName || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.workLocation || user.city || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Security Clearance</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.securityClearance || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Email</label>
            <div className="p-3 bg-gray-50 rounded-lg border flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              {user.email || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Phone</label>
            <div className="p-3 bg-gray-50 rounded-lg border flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              {user.phoneNumber || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Direct Manager</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.directManagerName || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">HR Contact</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.hrContactName || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsuranceInfo = () => (
    <div className="space-y-6">
      {/* Insurance Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-primary" />
          Insurance Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Company</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.insuranceProvider || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.policyNumber || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Type</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.coverageType || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <div className="p-3 bg-gray-50 rounded-lg border flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              {user.expiryDate || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Bank Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-primary" />
          Bank Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.bankName || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IBAN Number</label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              {user.ibanNumber || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      {/* Uploaded Documents */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-primary" />
          Uploaded Documents
        </h3>
        
        {/* Sample Document Preview */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <img 
                src="/img/hospital_img.jpg" 
                alt="Medical Facility Document" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-600 mb-2">Medical Facility Document</p>
            <p className="text-xs text-gray-500">Uploaded on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        {/* Additional document placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {['ID Document', 'Insurance Card', 'Bank Statement'].map((doc, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">{doc}</p>
              <p className="text-xs text-gray-500">Not uploaded</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return userType === 'Individual' ? renderGeneralInfo() : 
               userType === 'Business' ? renderBusinessInfo() : 
               renderGovernmentInfo();
      case 'insurance':
        return renderInsuranceInfo();
      case 'documents':
        return renderDocuments();
      default:
        return renderGeneralInfo();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {userType} User Details
              </h2>
              <p className="text-sm text-gray-500">
                {user.name} - {user.idNo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'general', label: 'General Information', icon: User },
              { id: 'insurance', label: 'Insurance & Bank', icon: Shield },
              { id: 'documents', label: 'Documents', icon: FileText }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Reject
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsView;
