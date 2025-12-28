import React from "react";
import { useTranslation } from "react-i18next";
import InputField from "../../antd/InputField";
import SelectField from "../../antd/SelectField";
import DateField from "../../antd/DateField";
import { YesNoEnum } from "../../utils/statusEnum";

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

interface Step1Props {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
}

const Step1Administrative: React.FC<Step1Props> = ({ data, onChange }) => {
  const { t } = useTranslation();

  const handleInputChange = (
    field: keyof Step1Data,
    value: string | File[]
  ) => {
    console.log("Field Changed:", field, value);
    onChange({
      ...data,
      [field]: value,
    });
  };

  const renderYesNoDropdown = (field: keyof Step1Data, label: string) => (
    // <div>
    //   <label className="block text-sm font-medium text-gray-700 mb-1">
    //     {label}
    //   </label>
    //   <select
    //     value={data[field] as string}
    //     onChange={(e:any) => handleInputChange(field, e.target.value)}
    //     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //   >
    //     <option value="">{t("selectOption")}</option>
    //     <option value="Yes">{t("yes")}</option>
    //     <option value="No">{t("no")}</option>
    //   </select>
    // </div>
    <SelectField
      label={label}
      value={YesNoEnum.find((x) => x.value === data[field])}
      options={YesNoEnum}
      onChange={(e: any) => handleInputChange(field, e)}
    />
  );

  const renderTextInput = (field: keyof Step1Data, label: string) => (
    <InputField
      label={label}
      value={data[field] as string}
      onChange={(e: any) => handleInputChange(field, e.target.value)}
    />
  );

  const renderDateInput = (field: keyof Step1Data, label: string) => (
    // <div>
    //   <label className="block text-sm font-medium text-gray-700 mb-1">
    //     {label}
    //   </label>
    //   <div className="relative">
    //     <input
    //       type="date"
    //       value={data[field] as string}
    //       onChange={(e:any) => handleInputChange(field, e.target.value)}
    //       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //     />
    //     <svg
    //       className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    //       />
    //     </svg>
    //   </div>
    // </div>
    <DateField
      label={label}
      value={data[field] as string}
      onChange={(date: any) => handleInputChange(field, date)}
    />
  );

  const renderImageUpload = (
    field: "FacilityPhotosOutside" | "FacilityPhotosInside",
    label: string
  ) => (
    <div className="p-4">
      <label className="block text-[17px] font-medium text-gray-500 mb-4">
        {label}
      </label>
      <div className="grid grid-cols-6 gap-2.5">
        {Array.from({ length: 6 }, (_, index) => {
          const file = data[field][index];
          return (
            <div
              key={index}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
            >
              {file ? (
                <div className="space-y-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                  <p className="text-xs text-gray-600 truncate">{file.name}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <svg
                    className="mx-auto h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-xs text-gray-500">{t("uploadImage")}</p>
                </div>
              )}

              <InputField
                type="file"
                accept="image/*"
                label={file ? t("change") : t("upload")}
                onChange={(e: { target: { files: any } }) => {
                  const files = e.target.files;
                  if (files && files[0]) {
                    const newFiles = [...data[field]];
                    newFiles[index] = files[0];
                    handleInputChange(field, newFiles);
                  }
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
      {renderTextInput("FacilityName", t("Facility Name"))}
      {renderTextInput("FacilityType", t("Facility Type"))}
      {renderTextInput("FacilityArea", t("Facility Area"))}
      {renderYesNoDropdown(
        "AreTherePrivateRooms",
        t("Are There Private Rooms?")
      )}
      {renderTextInput("NumberOfPrivateRooms", t("Number of Private Rooms"))}
      {renderYesNoDropdown("AreThereICURooms", t("Are There vip Rooms?"))}
      {renderTextInput("NumberOfICURooms", t("Number of vip Rooms"))}
      {renderTextInput(
        "NumberOfOperatingRooms",
        t("Number of Operating Rooms")
      )}
      {renderTextInput(
        "NumberOfDaySurgeryRooms",
        t("Number of day surgery Rooms")
      )}
      {renderYesNoDropdown("AreTherePharmacy", t("Is There a Pharmacy?"))}
      {renderYesNoDropdown("AreTherePostOpRoom", t("AreTherePostOpRoom"))}
      {renderYesNoDropdown("AreThereER", t("AreThereER"))}
      <div className="md:col-span-3">
        {renderTextInput(
          "NumberOfDialysisMachines",
          t("numberOfDialysisMachines")
        )}
      </div>

      {/* Address and Location */}
      <div className="md:col-span-3 flex gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
          <div className="md:col-span-2">
            {renderTextInput("FacilityAddress", t("Facility Address"))}
          </div>
          {renderTextInput("Country", t("Country"))}
          {renderTextInput("Region", t("Region"))}
          <div className="md:col-span-2">
            {renderTextInput("City", t("City"))}
          </div>
          <div className="md:col-span-2">
            {renderTextInput("District", t("District"))}
          </div>
        </div>
        <div className="flex items-center flex-col min-w-[218px] gap-4">
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="mx-auto h-8 w-8 text-gray-400 mb-2"
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
              <p className="text-sm text-gray-500">{t("mapLocation")}</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-black w-full text-white hover:bg-blue-700">
            {t("Get Direction")}
          </button>
        </div>
      </div>

      {/* Additional Facility Details */}
      {renderTextInput(
        "TypeOfFacilityBranches",
        t("Type of Facility Branches")
      )}
      {renderYesNoDropdown(
        "AreThereEmergencyDepartment",
        t("Is There an Emergency deparment?")
      )}
      {renderYesNoDropdown(
        "AreThereParking",
        t("Is There a Parking Lot for Patients?")
      )}
      {renderTextInput(
        "NumberOfParkingSlots",
        t("Number of Patient Parking Lots")
      )}
      {renderYesNoDropdown(
        "AreThereAmbulanceService",
        t("AreThereAmbulanceService")
      )}
      {renderTextInput("NumberOfAmbulanceCars", t("numberOfAmbulanceCars"))}

      {/* Time and Date Fields */}
      {renderTextInput(
        "WaitingTimeForConsultation",
        t("waitingTimeForConsultation")
      )}
      {renderDateInput("EvaluationDate", t("Issuance date"))}
      {renderDateInput("ExpirationDate", t("Expiration date"))}
      {renderTextInput(
        "DoctorInsuranceBoardNumber",
        t("Social insurance board number")
      )}
      {renderDateInput("EvaluationDate2", t("Issuance date"))}
      {renderDateInput("ExpirationDate2", t("Expiration date"))}

      {/* Capacity and Space */}
      {renderTextInput("NumberOfBeds", t("Number of Beds"))}
      {renderTextInput("NumberOfClinics", t("Number of Clinics"))}
      {renderTextInput("TotalSpaceInSqM", t("totalSpaceInSqM"))}

      {/* Department and Service Availability */}
      {renderYesNoDropdown("PrivateWaitingArea", t("privateWaitingArea"))}
      {renderYesNoDropdown(
        "InfectionControlOfficer",
        t("infectionControlOfficer")
      )}
      {renderYesNoDropdown(
        "MedicalWasteDepartment",
        t("medicalWasteDepartment")
      )}
      {renderYesNoDropdown(
        "SterilizationDepartment",
        t("sterilizationDepartment")
      )}
      {renderYesNoDropdown("PharmacyDepartment", t("pharmacyDepartment"))}
      {renderYesNoDropdown(
        "MedicalRecordsDepartment",
        t("medicalRecordsDepartment")
      )}
      {renderYesNoDropdown("LabDepartment", t("labDepartment"))}
      {renderYesNoDropdown("BloodBank", t("bloodBank"))}
      {renderYesNoDropdown(
        "AmbulanceMedicalTransport",
        t("ambulanceMedicalTransport")
      )}
      {renderYesNoDropdown("RadiologyDepartment", t("radiologyDepartment"))}
      {renderYesNoDropdown(
        "PhysiotherapyDepartment",
        t("physiotherapyDepartment")
      )}
      {renderYesNoDropdown("DentalDepartment", t("dentalDepartment"))}
      {renderYesNoDropdown("PsychiatryDepartment", t("psychiatryDepartment"))}
      {renderYesNoDropdown(
        "NutritionDieteticsDepartment",
        t("nutritionDieteticsDepartment")
      )}
      {renderYesNoDropdown("MedicalEducation", t("medicalEducation"))}
      {renderYesNoDropdown(
        "PublicRelationsDepartment",
        t("publicRelationsDepartment")
      )}
      {renderYesNoDropdown("DermatologySkinCare", t("dermatologySkinCare"))}
      {renderYesNoDropdown("InternalMedicine", t("internalMedicine"))}
      {renderYesNoDropdown("CardiologyDepartment", t("cardiologyDepartment"))}
      {renderYesNoDropdown("PediatricsChildCare", t("pediatricsChildCare"))}
      {renderYesNoDropdown(
        "MedicalBoardDepartment",
        t("medicalBoardDepartment")
      )}
      {renderYesNoDropdown("MedicalStaff", t("Medical Library"))}
      {renderYesNoDropdown("EducationalStaff", t("Educational Halls"))}
      {renderYesNoDropdown("NurseTraining", t("Basic Training Centers"))}
      <div className="md:col-span-3">
        {renderYesNoDropdown(
          "EmployeeAccommodation",
          t("Employee Accommodation")
        )}
      </div>

      {/* Image Upload Sections */}
      <div className="border border-[#e5e7eb] rounded-[16px] md:col-span-3">
        {renderImageUpload(
          "FacilityPhotosInside",
          t("A Picture of the Facility from the Inside")
        )}
      </div>
      <div className="border border-[#e5e7eb] rounded-[16px] md:col-span-3">
        {renderImageUpload(
          "FacilityPhotosOutside",
          t("A Picture of the Facility from the Outside")
        )}
      </div>
    </div>
  );
};

export default Step1Administrative;
