import React from "react";
import { useTranslation } from "react-i18next";
import InputField from "../../antd/InputField";
import SelectField from "../../antd/SelectField";

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

interface Step2Props {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
}

const Step2Medical: React.FC<Step2Props> = ({ data, onChange }) => {
  const { t } = useTranslation();
  const handleInputChange = (field: keyof Step2Data, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const renderTextInput = (field: keyof Step2Data, label: string) => (
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

  const renderYesNoDropdown = (field: keyof Step2Data, label: string) => (
    // <div>
    //   <label className="block text-sm font-medium text-gray-700 mb-1">
    //     {label}
    //   </label>
    //   <select
    //     value={data[field]}
    //     onChange={(e:any) => handleInputChange(field, e.target.value)}
    //     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //   >
    //     <option value="">{t('steps.step1.selectOption')}</option>
    //     <option value="Yes">{t('steps.step1.yes')}</option>
    //     <option value="No">{t('steps.step1.no')}</option>
    //   </select>
    // </div>
    <SelectField
      label={label}
      value={data[field]}
      onChange={(e: any) => handleInputChange(field, e.target.value)}
    />
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
      {/* General Medical Information */}
      {renderTextInput(
        "GeneralMedicalOperation",
        t("General Medical Specialties")
      )}
      {renderTextInput("Subspecialties", t("Subspecialties"))}
      {renderTextInput("SpecializedUnits", t("Specialized Units"))}

      {/* Medical Units and Departments */}
      {renderYesNoDropdown("KnowledgeOfThe", t("steps.step2.knowledgeOfThe"))}
      {renderYesNoDropdown("IcuMom", t("steps.step2.icuMom"))}
      {renderYesNoDropdown("CardiacTeam", t("steps.step2.cardiacTeam"))}
      {renderYesNoDropdown(
        "DoctorsConsultationUnit",
        t("steps.step2.doctorsConsultationUnit")
      )}
      {renderYesNoDropdown(
        "IntensiveCareUnit",
        t("steps.step2.intensiveCareUnit")
      )}
      {renderYesNoDropdown(
        "PediatricsIntensiveCareUnit",
        t("steps.step2.pediatricsIntensiveCareUnit")
      )}
      {renderYesNoDropdown(
        "NonMedicalIntensiveCareUnit",
        t("steps.step2.nonMedicalIntensiveCareUnit")
      )}
      {renderYesNoDropdown(
        "IntermediateCareUnit",
        t("steps.step2.intermediateCareUnit")
      )}
      {renderYesNoDropdown("IsolationUnit", t("steps.step2.isolationUnit"))}
      {renderYesNoDropdown("EmergencyUnit", t("steps.step2.emergencyUnit"))}
      {renderYesNoDropdown("DialysisUnit", t("steps.step2.dialysisUnit"))}
      {renderYesNoDropdown(
        "ComprehensiveRehabilitationCenter",
        t("steps.step2.comprehensiveRehabilitationCenter")
      )}
      {renderYesNoDropdown("Nursery", t("steps.step2.nursery"))}
      {renderYesNoDropdown("MaternityUnit", t("steps.step2.maternityUnit"))}
      {renderYesNoDropdown(
        "OganDonationTransplantCenter",
        t("steps.step2.organDonationTransplantCenter")
      )}

      <div className="md:col-span-3">
        {renderYesNoDropdown(
          "DrugAddictionUnit",
          t("steps.step2.drugAddictionUnit")
        )}
      </div>
    </div>
  );
};

export default Step2Medical;
