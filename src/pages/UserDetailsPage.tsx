import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Phone, Mail, CreditCard, Shield, FileText, Eye } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

const UserDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId, userType } = useParams<{ userId: string; userType: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock user data - replace with actual API call
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setUser({
          id: userId,
          firstName: "Ahmed",
          middleName: "Ali",
          lastName: "Hassan",
          idNo: "1234567890",
          idExpiryDate: "2025-12-31",
          dateOfBirth: "1990-05-15",
          doYouWork: "Yes",
          jobName: "Software Engineer",
          graduationCertificate: "Bachelor of Computer Science",
          telephone: "+966 56 545 123",
          officialEmail: "ahmed.hassan@email.com",
          country: "Saudi Arabia",
          region: "Riyadh",
          city: "Riyadh",
          address: "King Fahd Road, Al Malaz",
          bankName: "Al Rajhi Bank",
          ibanNumber: "SA0380000000608010167519",
          hasInsuranceCard: "Yes",
          insuranceCompanyName: "Bupa Arabia",
          insurancePolicyNumber: "BUP123456789",
          insurancePolicyExpiry: "2025-06-30",
          insuranceMembership: "Premium",
          gender: "Male",
          status: "Active"
        });
        setLoading(false);
      }, 1000);
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User not found</h2>
            <button
              onClick={() => navigate('/list-subscribers')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to List
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full flex-col gap-8 pb-3">
        {/* Header */}
        <div className="flex items-center gap-4 rounded-[28px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <button
            onClick={() => navigate('/list-subscribers')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-primary">User Details</h1>
            <p className="text-sm text-gray-400">
              {user.firstName} {user.middleName} {user.lastName} - {user.idNo}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Information */}
            <section className="bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">General Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.firstName || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.middleName || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.lastName || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Number / IQAMA Number</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.idNo || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Expiry</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {user.idExpiryDate || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {user.dateOfBirth || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Do you work? (Yes / No)</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.doYouWork || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Name</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.jobName || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Certificate</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.graduationCertificate || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telephone</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {user.telephone || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Official Email</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {user.officialEmail || 'N/A'}
                  </div>
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.country || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.region || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.city || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 h-24">
                    {user.address || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Map
                </button>
              </div>
            </section>

            {/* Bank Information */}
            <section className="bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-primary" />
                Bank Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.bankName || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IBAN Number</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.ibanNumber || 'N/A'}
                  </div>
                </div>
              </div>
            </section>

            {/* Insurance Information */}
            <section className="bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary" />
                Insurance Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Do you have Insurance Card? (Yes/No)</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.hasInsuranceCard || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Company Name</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.insuranceCompanyName || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Policy Number</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.insurancePolicyNumber || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Policy Number Date of Expiry</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {user.insurancePolicyExpiry || 'N/A'}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Membership</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.insuranceMembership || 'N/A'}
                  </div>
                </div>
              </div>
            </section>

            {/* Updated Information */}
            <section className="bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Updated Information if it has expired</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Number / IQAMA Number</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.idNo || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Number / IQAMA Number Date of Expiry</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {user.idExpiryDate || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Do you have Insurance Card? (Yes/No)</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.hasInsuranceCard || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Company Name</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.insuranceCompanyName || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Policy Number</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.insurancePolicyNumber || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Policy Number Date of Expiry</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {user.insurancePolicyExpiry || 'N/A'}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Membership</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.insuranceMembership || 'N/A'}
                  </div>
                </div>
              </div>
            </section>

            {/* Update the location */}
            <section className="bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Update the location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.country || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.region || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {user.city || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 h-24">
                    {user.address || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Map
                </button>
              </div>
            </section>

            {/* Uploaded Documents */}
            <section className="bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Uploaded Documents
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="text-center">
                  <div className="max-w-2xl mx-auto">
                    <img 
                      src="/img/hospital_img.jpg" 
                      alt="Medical Facility Document" 
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                    <div className="mt-4 flex items-center justify-center gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                        <Eye className="w-4 h-4" />
                        View Full Size
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        <FileText className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pb-8">
              <button 
                onClick={() => navigate('/list-subscribers')}
                className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Prev
              </button>
              <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                Reject
              </button>
              <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                Accept
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Status Card */}
            <div className="bg-white rounded-[32px] border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">User Type</span>
                  <span className="text-sm font-medium text-gray-900">{userType || 'Individual'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ID Number</span>
                  <span className="text-sm font-medium text-gray-900">{user.idNo}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-[32px] border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm font-medium">Send Email</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm font-medium">Call User</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm font-medium">Generate Report</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDetailsPage;
