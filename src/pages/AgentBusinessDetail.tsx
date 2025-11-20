import { useMemo, useState, type ReactNode, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/DashboardLayout";
import AgentServices from "../services/AgentServices/AgentServices";
import { businessAgents } from "../data/agents";

const AgentBusinessDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [agentData, setAgentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    generalInfo: true,
    location: true,
    adminInfo: true,
    serviceInsurance: true,
    addDiscount: true
  });

  // Discount form state
  const [discountForm, setDiscountForm] = useState({
    discountId: 0,
    userId: 0,
    userType: 2, // 2 for business
    registrationCommission: 0,
    serviceCommission: 0,
    registrationDiscount: 0,
    serviceDiscount: 0
  });

  // Load agent data from API
  useEffect(() => {
    const loadAgentData = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await AgentServices.GetAgentDiscountForBusinessById(id);
          if (response && 'data' in response && response.data) {
            setAgentData(response.data);

            // Populate discount form with existing data
            setDiscountForm(prev => ({
              ...prev,
              discountId: response.data.discountId || 0,
              userId: response.data.userId || parseInt(id) || 0,
              userType: 2, // Business
              registrationCommission: response.data.registrationCommission || 0,
              serviceCommission: response.data.serviceCommission || 0,
              registrationDiscount: response.data.registrationDiscount || 0,
              serviceDiscount: response.data.serviceDiscount || 0
            }));
          }
        } catch (error) {
          console.error('Error loading agent data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAgentData();
  }, [id]);

  const agent = useMemo(() => {
    if (agentData) {
      return agentData;
    }
    const lookupId = `#B${(id ?? "").replace(/[^0-9]/g, "")}`;
    return businessAgents.find((row) => row.id === lookupId) ?? businessAgents[0];
  }, [id, agentData]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle discount form input changes
  const handleDiscountChange = (field: keyof typeof discountForm, value: string | number) => {
    setDiscountForm(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  // Save discount data
  const handleSaveDiscount = async () => {
    try {
      setSaving(true);

      // Prepare the data for the API
      const apiData = {
        ...discountForm,
        userId: parseInt(id || '0') || 0
      };

      const response = await AgentServices.UpsertAgentDiscountForBusinessAndIndividual(apiData);

      if (response && response.success) {
        setShowSuccess(true);
        // Optionally refresh the data
        if (id) {
          const updatedResponse = await AgentServices.GetAgentDiscountForBusinessById(id);
          if (updatedResponse && 'data' in updatedResponse && updatedResponse.data) {
            setAgentData(updatedResponse.data);
          }
        }
      } else {
        console.error('Failed to save discount:', (response as any)?.message || 'Unknown error');
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error('Error saving discount:', error);
      // You might want to show an error message to the user
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">{t('common.loading')}...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full  flex-col gap-8 pb-16">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-gray-200 bg-white px-8 py-6 shadow-sm">
          <button className="inline-flex items-center gap-2 text-sm font-semibold text-primary" onClick={() => navigate("/agents")}>
            <ArrowLeftIcon />
            {t('common.back')}
          </button>
          <div className="text-sm font-semibold text-gray-500">
            <span className="text-gray-400">{t('pages.agents.agentCode')}:</span> <span className="text-primary">{agent.code}</span>
          </div>
        </header>

        <section className="space-y-8 rounded-[32px] border border-gray-200 bg-white px-8 py-10 shadow-sm">
          <ExpandableSection
            title={t('pages.agents.generalInformation')}
            isExpanded={expandedSections.generalInfo}
            onToggle={() => toggleSection('generalInfo')}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Select label={t('pages.agents.individualBusiness')} options={[t('pages.agents.business')]} defaultValue={t('pages.agents.business')} disabled />
              <Input label={t('pages.agents.businessLicense')} defaultValue={agent?.businessLicense || ""} disabled />
              <Input label={t('pages.agents.businessType')} defaultValue={agent?.businessType || ""} disabled />
              <Input label={t('pages.agents.insuranceCode')} defaultValue={agent?.insuranceCode || ""} disabled />
              <Select label={t('pages.agents.doYouHaveBranches')} options={[t('common.yes'), t('common.no')]} defaultValue={agent?.doYouHaveBranches || t('common.yes')} disabled />
              <Input label={t('pages.agents.branchNumber')} defaultValue={agent?.branchNumber || ""} disabled />
              <Input label={t('pages.agents.facilityName')} defaultValue={agent?.facilityName || ""} disabled />
              <Input label={t('pages.agents.facilityLicense')} defaultValue={agent?.facilityLicense || ""} disabled />
              <Input label={t('pages.agents.birthName')} defaultValue={agent?.birthName || ""} disabled />
              <Input label={t('pages.agents.birthNumber')} defaultValue={agent?.birthNumber || ""} disabled />
              <Input label={t('pages.agents.nationalIdNumber')} defaultValue={agent?.nationalIdNumber || ""} disabled />
            </div>
          </ExpandableSection>

          <ExpandableSection
            title={t('pages.agents.location')}
            isExpanded={expandedSections.location}
            onToggle={() => toggleSection('location')}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input label={t('pages.agents.country')} defaultValue={agent?.country || ""} disabled />
              <Input label={t('pages.agents.region')} defaultValue={agent?.region || ""} disabled />
              <Input label={t('pages.agents.city')} defaultValue={agent?.city || ""} disabled />
              <Input label={t('pages.agents.nationalAddress')} defaultValue={agent?.nationalAddress || ""} disabled />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label={t('pages.agents.address')} defaultValue={agent?.address || ""} disabled />
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{t('pages.agents.locationMap')}</p>
                <div className="h-40 rounded-[24px] border border-gray-200 bg-[#f6f7fb] flex items-center justify-center">
                  <span className="text-gray-400 text-sm">📍 {t('pages.agents.mapPlaceholder')}</span>
                </div>
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title={t('pages.agents.adminInformation')}
            isExpanded={expandedSections.adminInfo}
            onToggle={() => toggleSection('adminInfo')}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label={t('pages.agents.generalManagerInfo')} defaultValue={agent?.generalManagerInfo || ""} disabled />
              <Input label={t('pages.agents.phoneNumber')} defaultValue={agent?.generalManagerPhone || ""} disabled />
              <Input label={t('pages.agents.companyEmail')} defaultValue={agent?.generalManagerEmail || ""} disabled />
              <Input label={t('pages.agents.humanResourceInfo')} defaultValue={agent?.humanResourceInfo || ""} disabled />
              <Input label={t('pages.agents.phoneNumber')} defaultValue={agent?.humanResourcePhone || ""} disabled />
              <Input label={t('pages.agents.companyEmail')} defaultValue={agent?.humanResourceEmail || ""} disabled />
              <Input label={t('pages.agents.purchaseManagerInfo')} defaultValue={agent?.purchaseManagerInfo || ""} disabled />
              <Input label={t('pages.agents.phoneNumber')} defaultValue={agent?.purchaseManagerPhone || ""} disabled />
              <Input label={t('pages.agents.companyEmail')} defaultValue={agent?.purchaseManagerEmail || ""} disabled />
            </div>
          </ExpandableSection>

          <ExpandableSection
            title={t('pages.agents.serviceInsuranceInformation')}
            isExpanded={expandedSections.serviceInsurance}
            onToggle={() => toggleSection('serviceInsurance')}
          >
            <div className="grid gap-4 sm:grid-cols-4">
              <Input label={t('pages.agents.numberOfEmployees')} defaultValue={agent?.numberOfEmployees || ""} disabled />
              <Input label={t('pages.agents.insuranceCompany')} defaultValue={agent?.insuranceCompany || ""} disabled />
              <Input label={t('pages.agents.insurancePolicy')} defaultValue={agent?.insurancePolicy || ""} disabled />
              <Input label={t('pages.agents.insuranceDiscount')} defaultValue={agent?.insuranceDiscount || ""} disabled />
            </div>
          </ExpandableSection>

          <ExpandableSection
            title={t('pages.agents.addDiscount')}
            isExpanded={expandedSections.addDiscount}
            onToggle={() => toggleSection('addDiscount')}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                label={t('pages.agents.registrationCommission')}
                type="number"
                value={discountForm.registrationCommission}
                onChange={(e:any) => handleDiscountChange('registrationCommission', e.target.value)}
                placeholder="0"
              />
              <Input
                label={t('pages.agents.serviceCommission')}
                type="number"
                value={discountForm.serviceCommission}
                onChange={(e:any) => handleDiscountChange('serviceCommission', e.target.value)}
                placeholder="0"
              />
              <Input
                label={t('pages.agents.registrationDiscount')}
                type="number"
                value={discountForm.registrationDiscount}
                onChange={(e:any) => handleDiscountChange('registrationDiscount', e.target.value)}
                placeholder="0"
              />
              <Input
                label={t('pages.agents.serviceDiscount')}
                type="number"
                value={discountForm.serviceDiscount}
                onChange={(e:any) => handleDiscountChange('serviceDiscount', e.target.value)}
                placeholder="0"
              />
            </div>
          </ExpandableSection>

          <div className="flex justify-end gap-3">
            <button
              className={`rounded-full px-6 py-2 text-sm font-semibold text-white shadow ${saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-[#030447]'
                }`}
              onClick={handleSaveDiscount}
              disabled={saving}
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {t('common.saving')}...
                </div>
              ) : (
                t('common.save')
              )}
            </button>
            <button className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-500 hover:border-primary">
              {t('common.print')}
            </button>
          </div>
        </section>
      </div>

      {showSuccess && (
        <ModalOverlay>
          <div className="w-full max-w-md rounded-[32px] bg-white px-8 py-12 text-center shadow-[0_30px_60px_rgba(5,6,104,0.18)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9fbf3] text-[#09a66d]">
              <CheckIcon />
            </div>
            <p className="mt-6 text-lg font-semibold text-primary">Business Agent Discount</p>
            <p className="mt-2 text-sm text-gray-500">Business Agent Discount has been added successfully.</p>
            <button className="mt-8 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#030447]" onClick={() => setShowSuccess(false)}>
              Close
            </button>
          </div>
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};

const ExpandableSection = ({
  title,
  children,
  isExpanded,
  onToggle
}: {
  title: string;
  children: ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between cursor-pointer" onClick={onToggle}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{title}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{isExpanded ? 'Collapse' : 'Expand'}</span>
        <ChevronIcon isExpanded={isExpanded} />
      </div>
    </div>
    {isExpanded && (
      <div className="space-y-4">
        {children}
      </div>
    )}
  </div>
);

const Input = ({ label, disabled, value, onChange, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
    {label}
    <input
      {...props}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full rounded-[18px] border border-gray-200 px-4 py-3 text-sm shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-[#f7f8fd] text-gray-600'
        }`}
    />
  </label>
);

const Select = ({ label, options, defaultValue, disabled }: { label: string; options: string[]; defaultValue?: string; disabled?: boolean }) => (
  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
    {label}
    <select
      defaultValue={defaultValue}
      disabled={disabled}
      className={`w-full rounded-[18px] border border-gray-200 px-4 py-3 text-sm shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-[#f7f8fd] text-gray-600'
        }`}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  </label>
);

const ModalOverlay = ({ children }: { children: ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-[6px] px-4 py-6">
    {children}
  </div>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l-7 7 7 7" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
    <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-4-4 1.41-1.42L11 13.17l4.59-4.59L17 10l-6 7Z" />
  </svg>
);

const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default AgentBusinessDetail;


