import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  updateUpsertAdministrativeOrganizationalStandards,
  updateUpsertHumanResourceStandard,
  updateUpsertMedicalStandards,
  updateUpsertPublicHealthAndPreventionStandards,
  updateUpsertServiceLogisticsStandards,
  updateUpsertTechnicalStandards,
} from "../../services/AdministrativeAndOrganizationalStandards";

// Step Data Interfaces
interface Step1Data {
  FacilityName: string;
  FacilityType: string;
  FacilityArea: string;
  AreTherePrivateRooms: string;
  NumberOfPrivateRooms: string;
  AreThereICURooms: string;
  NumberOfICURooms: string;
  NumberOfOperatingRooms: string;
  NumberOfDaySurgeryRooms: string;
  AreTherePharmacy: string;
  AreTherePostOpRoom: string;
  AreThereER: string;
  NumberOfDialysisMachines: string;
  FacilityAddress: string;
  Country: string;
  Region: string;
  City: string;
  District: string;
  TypeOfFacilityBranches: string;
  AreThereEmergencyDepartment: string;
  AreThereParking: string;
  NumberOfParkingSlots: string;
  AreThereAmbulanceService: string;
  NumberOfAmbulanceCars: string;
  WaitingTimeForConsultation: string;
  EvaluationDate: string;
  ExpirationDate: string;
  DoctorInsuranceBoardNumber: string;
  EvaluationDate2: string;
  ExpirationDate2: string;
  NumberOfBeds: string;
  NumberOfClinics: string;
  TotalSpaceInSqM: string;
  PrivateWaitingArea: string;
  InfectionControlOfficer: string;
  MedicalWasteDepartment: string;
  SterilizationDepartment: string;
  PharmacyDepartment: string;
  MedicalRecordsDepartment: string;
  LabDepartment: string;
  BloodBank: string;
  AmbulanceMedicalTransport: string;
  RadiologyDepartment: string;
  PhysiotherapyDepartment: string;
  DentalDepartment: string;
  PsychiatryDepartment: string;
  NutritionDieteticsDepartment: string;
  MedicalEducation: string;
  PublicRelationsDepartment: string;
  DermatologySkinCare: string;
  InternalMedicine: string;
  CardiologyDepartment: string;
  PediatricsChildCare: string;
  MedicalBoardDepartment: string;
  MedicalStaff: string;
  EducationalStaff: string;
  NurseTraining: string;
  EmployeeAccommodation: string;
  FacilityPhotosOutside: File[];
  FacilityPhotosInside: File[];
}

interface Step2Data {
  GeneralMedicalOperation: string;
  Subspecialties: string;
  SpecializedUnits: string;
  KnowledgeOfThe: string;
  IcuMom: string;
  CardiacTeam: string;
  DoctorsConsultationUnit: string;
  IntensiveCareUnit: string;
  PediatricsIntensiveCareUnit: string;
  NonMedicalIntensiveCareUnit: string;
  IntermediateCareUnit: string;
  IsolationUnit: string;
  EmergencyUnit: string;
  DialysisUnit: string;
  ComprehensiveRehabilitationCenter: string;
  Nursery: string;
  MaternityUnit: string;
  OganDonationTransplantCenter: string;
  DrugAddictionUnit: string;
}

interface Step3Data {
  RadiologyDepartment: string;
  PathologyDepartment: string;
  LaboratoryDepartment: string;
  AnesthesiologyDepartment: string;
  AvailabilityOfMedicalEquipment: string;
  TotalNumberOfBeds: string;
}

interface Step4Data {
  TotalStaff: string;
  NumberOfLeadEmployees: string;
  NumberOfForeignEmployees: string;
  NumberOfGeneralDoctor: string;
  NumberOfSpecialistDoctor: string;
  NumberOfGeneralPractitioner: string;
  NumberOfConsultantDoctor: string;
  NumberOfEmergencyMedicine: string;
  NumberOfAnesthesiaDoctor: string;
  NumberOfSpecialistDentist: string;
  NumberOfGeneralDentist: string;
  NumberOfNursingOrParamedical: string;
  NumberOfPharmacist: string;
  NumberOfMidwives: string;
  NumberOfTechnicianDoctor: string;
  NumberOfRadiologyTechnician: string;
  NumberOfLaboratoryTechnician: string;
  NumberOfDentalTechnician: string;
  NumberOfOtherHealthcareSchedules: string;
  NumberOfDentalAssistant: string;
  NumberOfNursingOrParamedicalAssistant: string;
  NumberOfDentalHygienist: string;
  NumberOfPublicHealthNurse: string;
  NumberOfPublicHealthTechnician: string;
  NumberOfOrthopedicTechnician: string;
  NumberOfSocialPsychologistOrSocialWorker: string;
  NumberOfCardioPulmonaryTechnician: string;
  NumberOfOtherGroupOfTechnicalAndProfessionalStaff: string;
  NumberOfContractOrTemporaryStaff: string;
  NumberOfOtherStaff: string;
  NumberOfMedicalRecordsStaff: string;
  NumberOfPhysiotherapistSchedules: string;
  NumberOfOtherGroupOfTechnicalAndProfessionalStaffSpecify: string;
  NumberOfContractOrTemporaryStaffSpecify: string;
}

interface Step5Data {
  ItNetworkTechnicians: string;
  MaintenanceDepartment: string;
  ItStaffShop: string;
  PriceListFile: File | null;
}

interface Step6Data {
  HealthAwarenessSupplements: string;
  EpidemicControlDepartment: string;
  PatientEducationServices: string;
  SocialServices: string;
  MedicalEquipmentRepairWorkshop: string;
  AvailabilityOfLongTermHospitalizationRiskManagement: string;
  AvailabilityOfHomecareServices: string;
  AvailabilityOfElderlyCareServices: string;
  AvailabilityOfMedicalEquipmentAndToolsStorage: string;
  AvailabilityOfMedicalEquipmentAnalysisStorage: string;
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

  // Initialize form data with empty values
  const [formData, setFormData] = useState<AllStepsData>({
    step1: {
      FacilityName: "",
      FacilityType: "",
      FacilityArea: "",
      AreTherePrivateRooms: "",
      NumberOfPrivateRooms: "",
      AreThereICURooms: "",
      NumberOfICURooms: "",
      NumberOfOperatingRooms: "",
      NumberOfDaySurgeryRooms: "",
      AreTherePharmacy: "",
      AreTherePostOpRoom: "",
      AreThereER: "",
      NumberOfDialysisMachines: "",
      FacilityAddress: "",
      Country: "",
      Region: "",
      City: "",
      District: "",
      TypeOfFacilityBranches: "",
      AreThereEmergencyDepartment: "",
      AreThereParking: "",
      NumberOfParkingSlots: "",
      AreThereAmbulanceService: "",
      NumberOfAmbulanceCars: "",
      WaitingTimeForConsultation: "",
      EvaluationDate: "",
      ExpirationDate: "",
      DoctorInsuranceBoardNumber: "",
      EvaluationDate2: "",
      ExpirationDate2: "",
      NumberOfBeds: "",
      NumberOfClinics: "",
      TotalSpaceInSqM: "",
      PrivateWaitingArea: "",
      InfectionControlOfficer: "",
      MedicalWasteDepartment: "",
      SterilizationDepartment: "",
      PharmacyDepartment: "",
      MedicalRecordsDepartment: "",
      LabDepartment: "",
      BloodBank: "",
      AmbulanceMedicalTransport: "",
      RadiologyDepartment: "",
      PhysiotherapyDepartment: "",
      DentalDepartment: "",
      PsychiatryDepartment: "",
      NutritionDieteticsDepartment: "",
      MedicalEducation: "",
      PublicRelationsDepartment: "",
      DermatologySkinCare: "",
      InternalMedicine: "",
      CardiologyDepartment: "",
      PediatricsChildCare: "",
      MedicalBoardDepartment: "",
      MedicalStaff: "",
      EducationalStaff: "",
      NurseTraining: "",
      EmployeeAccommodation: "",
      FacilityPhotosOutside: [],
      FacilityPhotosInside: [],
    },
    step2: {
      GeneralMedicalOperation: "",
      Subspecialties: "",
      SpecializedUnits: "",
      KnowledgeOfThe: "",
      IcuMom: "",
      CardiacTeam: "",
      DoctorsConsultationUnit: "",
      IntensiveCareUnit: "",
      PediatricsIntensiveCareUnit: "",
      NonMedicalIntensiveCareUnit: "",
      IntermediateCareUnit: "",
      IsolationUnit: "",
      EmergencyUnit: "",
      DialysisUnit: "",
      ComprehensiveRehabilitationCenter: "",
      Nursery: "",
      MaternityUnit: "",
      OganDonationTransplantCenter: "",
      DrugAddictionUnit: "",
    },
    step3: {
      RadiologyDepartment: "",
      PathologyDepartment: "",
      LaboratoryDepartment: "",
      AnesthesiologyDepartment: "",
      AvailabilityOfMedicalEquipment: "",
      TotalNumberOfBeds: "",
    },
    step4: {
      TotalStaff: "",
      NumberOfLeadEmployees: "",
      NumberOfForeignEmployees: "",
      NumberOfGeneralDoctor: "",
      NumberOfSpecialistDoctor: "",
      NumberOfGeneralPractitioner: "",
      NumberOfConsultantDoctor: "",
      NumberOfEmergencyMedicine: "",
      NumberOfAnesthesiaDoctor: "",
      NumberOfSpecialistDentist: "",
      NumberOfGeneralDentist: "",
      NumberOfNursingOrParamedical: "",
      NumberOfPharmacist: "",
      NumberOfMidwives: "",
      NumberOfTechnicianDoctor: "",
      NumberOfRadiologyTechnician: "",
      NumberOfLaboratoryTechnician: "",
      NumberOfDentalTechnician: "",
      NumberOfOtherHealthcareSchedules: "",
      NumberOfDentalAssistant: "",
      NumberOfNursingOrParamedicalAssistant: "",
      NumberOfDentalHygienist: "",
      NumberOfPublicHealthNurse: "",
      NumberOfPublicHealthTechnician: "",
      NumberOfOrthopedicTechnician: "",
      NumberOfSocialPsychologistOrSocialWorker: "",
      NumberOfCardioPulmonaryTechnician: "",
      NumberOfOtherGroupOfTechnicalAndProfessionalStaff: "",
      NumberOfContractOrTemporaryStaff: "",
      NumberOfOtherStaff: "",
      NumberOfMedicalRecordsStaff: "",
      NumberOfPhysiotherapistSchedules: "",
      NumberOfOtherGroupOfTechnicalAndProfessionalStaffSpecify: "",
      NumberOfContractOrTemporaryStaffSpecify: "",
    },
    step5: {
      ItNetworkTechnicians: "",
      MaintenanceDepartment: "",
      ItStaffShop: "",
      PriceListFile: null,
    },
    step6: {
      HealthAwarenessSupplements: "",
      EpidemicControlDepartment: "",
      PatientEducationServices: "",
      SocialServices: "",
      MedicalEquipmentRepairWorkshop: "",
      AvailabilityOfLongTermHospitalizationRiskManagement: "",
      AvailabilityOfHomecareServices: "",
      AvailabilityOfElderlyCareServices: "",
      AvailabilityOfMedicalEquipmentAndToolsStorage: "",
      AvailabilityOfMedicalEquipmentAnalysisStorage: "",
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

  const saveCurrentStep = async () => {
    try {
      setLoading(true);

      switch (currentStep) {
        case 1:
          await updateUpsertAdministrativeOrganizationalStandards(
            777, // user ID
            0, // AdmOrgId
            2, // UserType
            3, // SubTypeId
            formData.step1 as Step1Data
          );
          break;

        case 2:
          await updateUpsertTechnicalStandards(
            777, // user ID
            0, // AdmOrgId
            2, // UserType
            3, // SubTypeId
            formData.step1 as Step1Data
          );
          break;

        case 3:
          await updateUpsertMedicalStandards(
            777, // user ID
            0, // AdmOrgId
            2, // UserType
            3, // SubTypeId
            formData.step1 as Step1Data
          );
          break;

        case 4:
          await updateUpsertHumanResourceStandard(
            777, // user ID
            0, // AdmOrgId
            2, // UserType
            3, // SubTypeId
            formData.step1 as Step1Data
          );
          break;

        case 5:
          await updateUpsertServiceLogisticsStandards(
            777, // user ID
            0, // AdmOrgId
            2, // UserType
            3, // SubTypeId
            formData.step1 as Step1Data
          );
          break;

        case 6:
          await updateUpsertPublicHealthAndPreventionStandards(
            777, // user ID
            0, // AdmOrgId
            2, // UserType
            3, // SubTypeId
            formData.step1 as Step1Data
          );
          break;

        default:
          break;
      }
    } catch (err) {
      console.error("Error saving step data:", err);
      setError("Failed to save form data");
      throw err; // so next/prev can decide what to do
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = async () => {
    if (currentStep > 1) {
      await saveCurrentStep();
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      await saveCurrentStep();
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to save all form data
      // console.log("Saving form data:", formData);
      // await updateUpsertAdministrativeOrganizationalStandards(
      //   777, // user ID
      //   0, // AdmOrgId
      //   2, // UserType
      //   3, // SubTypeId
      //   formData.step1 as Step1Data
      // );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

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
