import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import StepperLayout from "../../components/common/StepperLayout";
import {
  Step1Administrative,
  Step2Medical,
  Step3Technical,
  Step4HumanResource,
  Step5ServiceLogistics,
  Step6PublicHealth,
} from "../../components/steps";
import { updateUpsertAdministrativeOrganizationalStandards } from "../../services/AdministrativeAndOrganizationalStandards";

// Step Data Interfaces
interface Step1Data {
  facilityName: string;
  facilityType: string;
  facilityArea: string;
  hasPrivateRooms: string;
  numberOfPrivateRooms: string;
  hasICURooms: string;
  numberOfICURooms: string;
  numberOfOperatingRooms: string;
  numberOfDaySurgeryRooms: string;
  hasPharmacy: string;
  hasPostOpRoom: string;
  hasER: string;
  numberOfDialysisMachines: string;
  facilityAddress: string;
  country: string;
  region: string;
  city: string;
  typeOfFacilityBranches: string;
  hasEmergencyDepartment: string;
  hasParking: string;
  numberOfParkingSlots: string;
  hasAmbulanceService: string;
  numberOfAmbulanceCars: string;
  waitingTimeForConsultation: string;
  evaluationDate: string;
  expirationDate: string;
  doctorInsuranceBoardNumber: string;
  evaluationDate2: string;
  expirationDate2: string;
  numberOfBeds: string;
  numberOfClinics: string;
  totalSpaceInSqM: string;
  privateWaitingArea: string;
  infectionControlOfficer: string;
  medicalWasteDepartment: string;
  sterilizationDepartment: string;
  pharmacyDepartment: string;
  medicalRecordsDepartment: string;
  labDepartment: string;
  bloodBank: string;
  ambulanceMedicalTransport: string;
  radiologyDepartment: string;
  physiotherapyDepartment: string;
  dentalDepartment: string;
  psychiatryDepartment: string;
  nutritionDieteticsDepartment: string;
  medicalEducation: string;
  publicRelationsDepartment: string;
  dermatologySkinCare: string;
  internalMedicine: string;
  cardiologyDepartment: string;
  pediatricsChildCare: string;
  medicalBoardDepartment: string;
  medicalStaff: string;
  educationalStaff: string;
  nurseTraining: string;
  employeeAccommodation: string;
  facilityPhotosOutside: File[];
  facilityPhotosInside: File[];
}

interface Step2Data {
  generalMedicalOperation: string;
  subspecialties: string;
  specializedUnits: string;
  knowledgeOfThe: string;
  icuMom: string;
  cardiacTeam: string;
  doctorsConsultationUnit: string;
  intensiveCareUnit: string;
  pediatricsIntensiveCareUnit: string;
  nonMedicalIntensiveCareUnit: string;
  intermediateCareUnit: string;
  isolationUnit: string;
  emergencyUnit: string;
  dialysisUnit: string;
  comprehensiveRehabilitationCenter: string;
  nursery: string;
  maternityUnit: string;
  organDonationTransplantCenter: string;
  drugAddictionUnit: string;
}

interface Step3Data {
  radiologyDepartment: string;
  pathologyDepartment: string;
  laboratoryDepartment: string;
  anesthesiologyDepartment: string;
  availabilityOfMedicalEquipment: string;
  totalNumberOfBeds: string;
}

interface Step4Data {
  totalStaff: string;
  numberOfLeadEmployees: string;
  numberOfForeignEmployees: string;
  numberOfGeneralDoctor: string;
  numberOfSpecialistDoctor: string;
  numberOfGeneralPractitioner: string;
  numberOfConsultantDoctor: string;
  numberOfEmergencyMedicine: string;
  numberOfAnesthesiaDoctor: string;
  numberOfSpecialistDentist: string;
  numberOfGeneralDentist: string;
  numberOfNursingOrParamedical: string;
  numberOfPharmacist: string;
  numberOfMidwives: string;
  numberOfTechnicianDoctor: string;
  numberOfRadiologyTechnician: string;
  numberOfLaboratoryTechnician: string;
  numberOfDentalTechnician: string;
  numberOfOtherHealthcareSchedules: string;
  numberOfDentalAssistant: string;
  numberOfNursingOrParamedicalAssistant: string;
  numberOfDentalHygienist: string;
  numberOfPublicHealthNurse: string;
  numberOfPublicHealthTechnician: string;
  numberOfOrthopedicTechnician: string;
  numberOfSocialPsychologistOrSocialWorker: string;
  numberOfCardioPulmonaryTechnician: string;
  numberOfOtherGroupOfTechnicalAndProfessionalStaff: string;
  numberOfContractOrTemporaryStaff: string;
  numberOfOtherStaff: string;
  numberOfMedicalRecordsStaff: string;
  numberOfPhysiotherapistSchedules: string;
  numberOfOtherGroupOfTechnicalAndProfessionalStaffSpecify: string;
  numberOfContractOrTemporaryStaffSpecify: string;
}

interface Step5Data {
  itNetworkTechnicians: string;
  maintenanceDepartment: string;
  itStaffShop: string;
  priceListFile: File | null;
}

interface Step6Data {
  healthAwarenessSupplements: string;
  epidemicControlDepartment: string;
  patientEducationServices: string;
  socialServices: string;
  medicalEquipmentRepairWorkshop: string;
  availabilityOfLongTermHospitalizationRiskManagement: string;
  availabilityOfHomecareServices: string;
  availabilityOfElderlyCareServices: string;
  availabilityOfMedicalEquipmentAndToolsStorage: string;
  availabilityOfMedicalEquipmentAnalysisStorage: string;
}

interface AllStepsData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
  step6: Step6Data;
}

const Service11Details = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const serviceData = location.state?.service;

  // Initialize form data with empty values
  const [formData, setFormData] = useState<AllStepsData>({
    step1: {
      facilityName: "",
      facilityType: "",
      facilityArea: "",
      hasPrivateRooms: "",
      numberOfPrivateRooms: "",
      hasICURooms: "",
      numberOfICURooms: "",
      numberOfOperatingRooms: "",
      numberOfDaySurgeryRooms: "",
      hasPharmacy: "",
      hasPostOpRoom: "",
      hasER: "",
      numberOfDialysisMachines: "",
      facilityAddress: "",
      country: "",
      region: "",
      city: "",
      typeOfFacilityBranches: "",
      hasEmergencyDepartment: "",
      hasParking: "",
      numberOfParkingSlots: "",
      hasAmbulanceService: "",
      numberOfAmbulanceCars: "",
      waitingTimeForConsultation: "",
      evaluationDate: "",
      expirationDate: "",
      doctorInsuranceBoardNumber: "",
      evaluationDate2: "",
      expirationDate2: "",
      numberOfBeds: "",
      numberOfClinics: "",
      totalSpaceInSqM: "",
      privateWaitingArea: "",
      infectionControlOfficer: "",
      medicalWasteDepartment: "",
      sterilizationDepartment: "",
      pharmacyDepartment: "",
      medicalRecordsDepartment: "",
      labDepartment: "",
      bloodBank: "",
      ambulanceMedicalTransport: "",
      radiologyDepartment: "",
      physiotherapyDepartment: "",
      dentalDepartment: "",
      psychiatryDepartment: "",
      nutritionDieteticsDepartment: "",
      medicalEducation: "",
      publicRelationsDepartment: "",
      dermatologySkinCare: "",
      internalMedicine: "",
      cardiologyDepartment: "",
      pediatricsChildCare: "",
      medicalBoardDepartment: "",
      medicalStaff: "",
      educationalStaff: "",
      nurseTraining: "",
      employeeAccommodation: "",
      facilityPhotosOutside: [],
      facilityPhotosInside: [],
    },
    step2: {
      generalMedicalOperation: "",
      subspecialties: "",
      specializedUnits: "",
      knowledgeOfThe: "",
      icuMom: "",
      cardiacTeam: "",
      doctorsConsultationUnit: "",
      intensiveCareUnit: "",
      pediatricsIntensiveCareUnit: "",
      nonMedicalIntensiveCareUnit: "",
      intermediateCareUnit: "",
      isolationUnit: "",
      emergencyUnit: "",
      dialysisUnit: "",
      comprehensiveRehabilitationCenter: "",
      nursery: "",
      maternityUnit: "",
      organDonationTransplantCenter: "",
      drugAddictionUnit: "",
    },
    step3: {
      radiologyDepartment: "",
      pathologyDepartment: "",
      laboratoryDepartment: "",
      anesthesiologyDepartment: "",
      availabilityOfMedicalEquipment: "",
      totalNumberOfBeds: "",
    },
    step4: {
      totalStaff: "",
      numberOfLeadEmployees: "",
      numberOfForeignEmployees: "",
      numberOfGeneralDoctor: "",
      numberOfSpecialistDoctor: "",
      numberOfGeneralPractitioner: "",
      numberOfConsultantDoctor: "",
      numberOfEmergencyMedicine: "",
      numberOfAnesthesiaDoctor: "",
      numberOfSpecialistDentist: "",
      numberOfGeneralDentist: "",
      numberOfNursingOrParamedical: "",
      numberOfPharmacist: "",
      numberOfMidwives: "",
      numberOfTechnicianDoctor: "",
      numberOfRadiologyTechnician: "",
      numberOfLaboratoryTechnician: "",
      numberOfDentalTechnician: "",
      numberOfOtherHealthcareSchedules: "",
      numberOfDentalAssistant: "",
      numberOfNursingOrParamedicalAssistant: "",
      numberOfDentalHygienist: "",
      numberOfPublicHealthNurse: "",
      numberOfPublicHealthTechnician: "",
      numberOfOrthopedicTechnician: "",
      numberOfSocialPsychologistOrSocialWorker: "",
      numberOfCardioPulmonaryTechnician: "",
      numberOfOtherGroupOfTechnicalAndProfessionalStaff: "",
      numberOfContractOrTemporaryStaff: "",
      numberOfOtherStaff: "",
      numberOfMedicalRecordsStaff: "",
      numberOfPhysiotherapistSchedules: "",
      numberOfOtherGroupOfTechnicalAndProfessionalStaffSpecify: "",
      numberOfContractOrTemporaryStaffSpecify: "",
    },
    step5: {
      itNetworkTechnicians: "",
      maintenanceDepartment: "",
      itStaffShop: "",
      priceListFile: null,
    },
    step6: {
      healthAwarenessSupplements: "",
      epidemicControlDepartment: "",
      patientEducationServices: "",
      socialServices: "",
      medicalEquipmentRepairWorkshop: "",
      availabilityOfLongTermHospitalizationRiskManagement: "",
      availabilityOfHomecareServices: "",
      availabilityOfElderlyCareServices: "",
      availabilityOfMedicalEquipmentAndToolsStorage: "",
      availabilityOfMedicalEquipmentAnalysisStorage: "",
    },
  });

  const stepTitles = [
    "Administrative & Organizational Standards",
    "Medical Standards",
    "Technical Standards",
    "Human Resource Standards",
    "Service & Logistics Standards",
    "Public Health & Prevention Standards",
  ];

  const totalSteps = 6;

  const handleStepDataChange = (step: keyof AllStepsData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [step]: data,
    }));
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to save all form data
      console.log("Saving form data:", formData);
      await updateUpsertAdministrativeOrganizationalStandards(
        777, // user ID
        0, // AdmOrgId
        2, // UserType
        3, // SubTypeId
        formData
      );

      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Form submitted successfully!");
      navigate("/service-dashboard/category/1/service/1/action/order");
    } catch (err) {
      console.error("Error saving form:", err);
      setError("Failed to save form data");
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Administrative
            data={formData.step1}
            onChange={(data) => handleStepDataChange("step1", data)}
          />
        );
      case 2:
        return (
          <Step2Medical
            data={formData.step2}
            onChange={(data) => handleStepDataChange("step2", data)}
          />
        );
      case 3:
        return (
          <Step3Technical
            data={formData.step3}
            onChange={(data) => handleStepDataChange("step3", data)}
          />
        );
      case 4:
        return (
          <Step4HumanResource
            data={formData.step4}
            onChange={(data) => handleStepDataChange("step4", data)}
          />
        );
      case 5:
        return (
          <Step5ServiceLogistics
            data={formData.step5}
            onChange={(data) => handleStepDataChange("step5", data)}
          />
        );
      case 6:
        return (
          <Step6PublicHealth
            data={formData.step6}
            onChange={(data) => handleStepDataChange("step6", data)}
          />
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() =>
              navigate("/service-dashboard/category/1/service/1/action/order")
            }
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <StepperLayout
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepTitles={stepTitles}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onFinish={handleFinish}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === totalSteps}
        isLoading={loading}
      >
        {renderCurrentStep()}
      </StepperLayout>
    </DashboardLayout>
  );
};

export default Service11Details;
