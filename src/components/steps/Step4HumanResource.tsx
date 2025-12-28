import React from "react";
import { useTranslation } from "react-i18next";
import InputField from "../../antd/InputField";

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

interface Step4Props {
  data: Step4Data;
  onChange: (data: Step4Data) => void;
}

const Step4HumanResource: React.FC<Step4Props> = ({ data, onChange }) => {
  const { t } = useTranslation();
  const handleInputChange = (field: keyof Step4Data, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const renderTextInput = (field: keyof Step4Data, label: string) => (
    // <div>
    //   <label className="block text-sm font-medium text-gray-700 mb-1">
    //     {label}
    //   </label>
    //   <input
    //     type="text"
    //     value={data[field]}
    //     onChange={(e:any) => handleInputChange(field, e.target.value)}
    //     placeholder={placeholder}
    //     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //   />
    // </div>
    <InputField
      label={label}
      value={data[field]}
      onChange={(e: any) => handleInputChange(field, e.target.value)}
    />
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
      {renderTextInput("TotalStaff", t("Total Staff"))}
      {renderTextInput(
        "NumberOfLeadEmployees",
        t("steps.step4.NumberOfLeadEmployees")
      )}
      {renderTextInput(
        "NumberOfForeignEmployees",
        t("steps.step4.NumberOfForeignEmployees")
      )}
      {renderTextInput(
        "NumberOfGeneralDoctor",
        t("steps.step4.NumberOfGeneralDoctor")
      )}
      {renderTextInput(
        "NumberOfSpecialistDoctor",
        t("steps.step4.NumberOfSpecialistDoctor")
      )}
      {renderTextInput(
        "NumberOfGeneralPractitioner",
        t("steps.step4.NumberOfGeneralPractitioner")
      )}
      {renderTextInput(
        "NumberOfConsultantDoctor",
        t("steps.step4.NumberOfConsultantDoctor")
      )}
      {renderTextInput(
        "NumberOfEmergencyMedicine",
        t("steps.step4.NumberOfEmergencyMedicine")
      )}
      {renderTextInput(
        "NumberOfAnesthesiaDoctor",
        t("steps.step4.NumberOfAnesthesiaDoctor")
      )}
      {renderTextInput(
        "NumberOfSpecialistDentist",
        t("steps.step4.NumberOfSpecialistDentist")
      )}
      {renderTextInput(
        "NumberOfGeneralDentist",
        t("steps.step4.NumberOfGeneralDentist")
      )}
      {renderTextInput(
        "NumberOfNursingOrParamedical",
        t("steps.step4.NumberOfNursingOrParamedical")
      )}
      {renderTextInput(
        "NumberOfPharmacist",
        t("steps.step4.NumberOfPharmacist")
      )}
      {renderTextInput("NumberOfMidwives", t("steps.step4.NumberOfMidwives"))}
      {renderTextInput(
        "NumberOfTechnicianDoctor",
        t("steps.step4.NumberOfTechnicianDoctor")
      )}
      {renderTextInput(
        "NumberOfRadiologyTechnician",
        t("steps.step4.NumberOfRadiologyTechnician")
      )}
      {renderTextInput(
        "NumberOfLaboratoryTechnician",
        t("steps.step4.NumberOfLaboratoryTechnician")
      )}
      {renderTextInput(
        "NumberOfDentalTechnician",
        t("steps.step4.NumberOfDentalTechnician")
      )}
      {renderTextInput(
        "NumberOfOtherHealthcareSchedules",
        t("steps.step4.NumberOfOtherHealthcareSchedules")
      )}
      {renderTextInput(
        "NumberOfDentalAssistant",
        t("steps.step4.NumberOfDentalAssistant")
      )}
      {renderTextInput(
        "NumberOfNursingOrParamedicalAssistant",
        t("steps.step4.NumberOfNursingOrParamedicalAssistant")
      )}
      {renderTextInput(
        "NumberOfDentalHygienist",
        t("steps.step4.NumberOfDentalHygienist")
      )}
      {renderTextInput(
        "NumberOfPublicHealthNurse",
        t("steps.step4.NumberOfPublicHealthNurse")
      )}
      {renderTextInput(
        "NumberOfPublicHealthTechnician",
        t("steps.step4.NumberOfPublicHealthTechnician")
      )}
      {renderTextInput(
        "NumberOfOrthopedicTechnician",
        t("steps.step4.NumberOfOrthopedicTechnician")
      )}
      {renderTextInput(
        "NumberOfSocialPsychologistOrSocialWorker",
        t("steps.step4.NumberOfSocialPsychologistOrSocialWorker")
      )}
      {renderTextInput(
        "NumberOfCardioPulmonaryTechnician",
        t("steps.step4.NumberOfCardioPulmonaryTechnician")
      )}
      {renderTextInput(
        "NumberOfOtherGroupOfTechnicalAndProfessionalStaff",
        t("steps.step4.NumberOfOtherGroupOfTechnicalAndProfessionalStaff")
      )}
      {renderTextInput(
        "NumberOfContractOrTemporaryStaff",
        t("steps.step4.NumberOfContractOrTemporaryStaff")
      )}
      {renderTextInput(
        "NumberOfOtherStaff",
        t("steps.step4.NumberOfOtherStaff")
      )}
      {renderTextInput(
        "NumberOfMedicalRecordsStaff",
        t("steps.step4.NumberOfMedicalRecordsStaff")
      )}
      {renderTextInput(
        "NumberOfPhysiotherapistSchedules",
        t("steps.step4.NumberOfPhysiotherapistSchedules")
      )}
    </div>
  );
};

export default Step4HumanResource;
