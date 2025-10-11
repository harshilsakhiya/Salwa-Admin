import { useNavigate } from "react-router-dom";

const RentalMedicalEquipmentLink = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_20px_40px_rgba(5,6,104,0.08)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Rental Medical Equipment
            </h3>
            <p className="text-gray-600">
              Manage and view available rental medical equipment
            </p>
          </div>
          <button
            onClick={() => navigate("/rental-medical-equipment")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            View Equipment
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalMedicalEquipmentLink;
