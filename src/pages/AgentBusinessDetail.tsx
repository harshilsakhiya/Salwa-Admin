import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { businessAgents } from "../data/agents";

const AgentBusinessDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showSuccess, setShowSuccess] = useState(false);

  const agent = useMemo(() => {
    const lookupId = `#B${(id ?? "").replace(/[^0-9]/g, "")}`;
    return businessAgents.find((row) => row.id === lookupId) ?? businessAgents[0];
  }, [id]);

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 pb-16">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-gray-200 bg-white px-8 py-6 shadow-sm">
          <button className="inline-flex items-center gap-2 text-sm font-semibold text-primary" onClick={() => navigate("/agents")}> 
            <ArrowLeftIcon />
            Back
          </button>
          <div className="text-sm font-semibold text-gray-500">
            <span className="text-gray-400">Agent Code:</span> <span className="text-primary">{agent.code}</span>
          </div>
        </header>

        <section className="space-y-8 rounded-[32px] border border-gray-200 bg-white px-8 py-10 shadow-sm">
          <Section title="General Information">
            <div className="grid gap-4 sm:grid-cols-3">
              <Select label="Individual / Business" options={["Business"]} defaultValue="Business" />
              <Input label="Business License" defaultValue="BL-00990" />
              <Input label="Business Type" defaultValue="Hospital" />
              <Input label="Insurance Code" defaultValue="INS-0001" />
              <Select label="Do you have Branches?" options={["Yes", "No"]} defaultValue="Yes" />
              <Input label="Branch Number" defaultValue="5" />
              <Input label="Facility Name" defaultValue="Kings Medical" />
              <Input label="Facility License" defaultValue="FAC-22345" />
              <Input label="Birth Name" defaultValue="Ahmed Mohammed" />
              <Input label="Birth Number" defaultValue="998188188" />
              <Input label="National ID Number" defaultValue="1234567890" />
            </div>
          </Section>

          <Section title="Location">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input label="Country" defaultValue={agent.country} />
              <Input label="Region" defaultValue={agent.region} />
              <Input label="City" defaultValue={agent.city} />
              <Input label="National Address - SPL (Short Address)" defaultValue="M0000111" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Address" defaultValue="King Abdul Aziz Road, Riyadh" />
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Location Map</p>
                <div className="h-40 rounded-[24px] border border-gray-200 bg-[#f6f7fb]" />
              </div>
            </div>
          </Section>

          <Section title="Admin Information">
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="General Manager Information" defaultValue="Omar Salem" />
              <Input label="Phone Number" defaultValue="+966 055 8822 11" />
              <Input label="Company Email" defaultValue="info@kingsmedical.com" />
              <Input label="Human Resource Information" defaultValue="Hassan Ibrahim" />
              <Input label="Phone Number" defaultValue="+966 055 7788 11" />
              <Input label="Company Email" defaultValue="hr@kingsmedical.com" />
              <Input label="Purchase Manager Information" defaultValue="Mona Al Harbi" />
              <Input label="Phone Number" defaultValue="+966 055 6677 11" />
              <Input label="Company Email" defaultValue="purchase@kingsmedical.com" />
            </div>
          </Section>

          <Section title="Service Insurance Information">
            <div className="grid gap-4 sm:grid-cols-4">
              <Input label="Number of Employees" defaultValue="65" />
              <Input label="Insurance Company" defaultValue="Tawuniya" />
              <Input label="Insurance Policy" defaultValue="POL-98765" />
              <Input label="Insurance Discount" defaultValue="8%" />
            </div>
          </Section>

          <Section title="Add Discount">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input label="Registration Commission %" defaultValue="4" />
              <Input label="Service Commission %" defaultValue="7" />
              <Input label="Registration Discount %" defaultValue="5" />
              <Input label="Service Discount %" defaultValue="6" />
            </div>
          </Section>

          <div className="flex justify-end gap-3">
            <button className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#030447]" onClick={() => setShowSuccess(true)}>
              Save
            </button>
            <button className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-500 hover:border-primary">Print</button>
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

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{title}</p>
    </div>
    {children}
  </div>
);

const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
    {label}
    <input {...props} className="w-full rounded-[18px] border border-gray-200 bg-[#f7f8fd] px-4 py-3 text-sm text-gray-600 shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
  </label>
);

const Select = ({ label, options, defaultValue }: { label: string; options: string[]; defaultValue?: string }) => (
  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
    {label}
    <select defaultValue={defaultValue} className="w-full rounded-[18px] border border-gray-200 bg-[#f7f8fd] px-4 py-3 text-sm text-gray-600 shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
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

export default AgentBusinessDetail;


