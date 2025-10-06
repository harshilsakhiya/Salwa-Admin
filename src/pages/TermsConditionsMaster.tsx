import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

type ActiveTab = "registration" | "services";
type ModalState = "edit" | "confirm" | "success" | "history" | null;

interface TermsRow {
  id: string;
  category: string;
  userType: string;
  subType: string;
  terms: string;
  version: string;
}

interface HistoryItem {
  date: string;
  version: string;
  description: string;
}

const stats = [
  { label: "Total Reviews", value: "244" },
  { label: "Total Unique B2B Query", value: "22" },
  { label: "Total B2B Query", value: "266" },
];

const tableRows: TermsRow[] = [
  {
    id: "#0023",
    category: "Individual",
    userType: "Doctor",
    subType: "-",
    terms: "Lorem ipsum dolor sit amet",
    version: "2.5.1",
  },
  {
    id: "#0025",
    category: "Individual",
    userType: "Transition Students",
    subType: "University",
    terms: "Lorem ipsum dolor sit amet",
    version: "2.4.9",
  },
  {
    id: "#0028",
    category: "Business",
    userType: "Commercial service provider",
    subType: "Food sector",
    terms: "Lorem ipsum dolor sit amet",
    version: "2.5.0",
  },
];

const historyItems: HistoryItem[] = [
  {
    date: "17/06/2025",
    version: "2.5.1",
    description: "Collaborated Terms & Conditions updated via program",
  },
  {
    date: "10/06/2025",
    version: "2.5.0",
    description: "Collaborated Terms & Conditions",
  },
  {
    date: "27/05/2025",
    version: "2.4.8",
    description: "Collaborated Terms & Conditions",
  },
];

const TermsConditionsMaster = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("registration");
  const [modalState, setModalState] = useState<ModalState>(null);
  const [englishText, setEnglishText] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
  const [arabicText, setArabicText] = useState("Arabic placeholder content");
  const [selectedRow, setSelectedRow] = useState<TermsRow | null>(null);

  const openEdit = (row: TermsRow) => {
    setSelectedRow(row);
    setModalState("edit");
  };

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full  flex-col gap-8 pb-3">
        <Header />
        <section className="space-y-8 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 rounded-full bg-[#f7f8fd] p-1 text-sm font-semibold text-gray-500">
              <TabButton label="Registration" isActive={activeTab === "registration"} onClick={() => setActiveTab("registration")} />
              <TabButton label="Services" isActive={activeTab === "services"} onClick={() => setActiveTab("services")} />
            </div>
            <SearchField />
          </div>

          <StatsRow />
          <ChartPlaceholder />

          <div className="overflow-hidden rounded-[28px] border border-gray-200">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-[#f6f7fb] text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                <tr>
                  <th className="px-6 py-4">T&amp;C No</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">User Type</th>
                  <th className="px-6 py-4">Sub-User Type</th>
                  <th className="px-6 py-4">Terms &amp; Condition</th>
                  <th className="px-6 py-4">Version</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {tableRows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-6 py-4 font-semibold text-primary">{row.id}</td>
                    <td className="px-6 py-4 text-gray-700">{row.category}</td>
                    <td className="px-6 py-4 text-gray-500">{row.userType}</td>
                    <td className="px-6 py-4 text-gray-500">{row.subType}</td>
                    <td className="px-6 py-4 text-gray-500">{row.terms}</td>
                    <td className="px-6 py-4 text-gray-500">{row.version}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <IconButton label="Edit" onClick={() => openEdit(row)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton label="History" onClick={() => setModalState("history")}>
                          <HistoryIcon />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {modalState && (
        <ModalOverlay>
          {modalState === "edit" && selectedRow && (
            <EditModal
              onClose={() => setModalState(null)}
              onSubmit={() => setModalState("confirm")}
              englishText={englishText}
              arabicText={arabicText}
              onEnglishChange={setEnglishText}
              onArabicChange={setArabicText}
            />
          )}
          {modalState === "confirm" && selectedRow && (
            <ConfirmModal
              version={selectedRow.version}
              onClose={() => setModalState(null)}
              onCancel={() => setModalState("edit")}
              onConfirm={() => setModalState("success")}
            />
          )}
          {modalState === "success" && selectedRow && (
            <SuccessModal version={selectedRow.version} onClose={() => setModalState(null)} />
          )}
          {modalState === "history" && (
            <HistoryModal onClose={() => setModalState(null)} items={historyItems} />
          )}
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};

const Header = () => (
  <div className="flex items-center gap-4 rounded-[28px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
    <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" className="h-10 w-10" fill="#050668">
        <path d="M18 54h36V18H18Zm6-24h24v18H24Z" />
      </svg>
    </div>
    <div>
      <h1 className="text-2xl font-semibold text-primary">Terms &amp; Condition Master</h1>
      <p className="text-sm text-gray-400">Manage policy updates for each subscription group</p>
    </div>
  </div>
);

const TabButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-5 py-2 transition ${isActive ? "bg-white text-primary shadow" : "text-gray-500 hover:text-primary"}`}
  >
    {label}
  </button>
);

const SearchField = () => (
  <div className="relative w-full max-w-xs">
    <input
      className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 pl-10 text-sm text-gray-600 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      placeholder="Search here"
    />
    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
      <SearchIcon />
    </span>
  </div>
);

const StatsRow = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {stats.map((item) => (
      <div key={item.label} className="rounded-[28px] border border-gray-200 bg-[#f7f8fd] px-6 py-8 text-center shadow-[0_20px_40px_rgba(5,6,104,0.08)]">
        <p className="text-4xl font-semibold text-primary">{item.value}</p>
        <p className="mt-2 text-sm text-gray-500">{item.label}</p>
      </div>
    ))}
  </div>
);

const ChartPlaceholder = () => (
  <div className="rounded-[28px] border border-gray-200 bg-[#f6f7fb] px-6 py-10 text-center text-sm text-gray-500">
    Analytics chart placeholder
  </div>
);

const IconButton = ({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-primary hover:text-primary"
    aria-label={label}
  >
    {children}
  </button>
);

const ModalOverlay = ({ children }: { children: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-[6px] px-4">
    {children}
  </div>
);

const ModalShell = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="w-full max-w-2xl rounded-[36px] bg-white px-8 py-10 shadow-[0_40px_90px_rgba(5,6,104,0.18)]">
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
      <button
        type="button"
        aria-label="Close"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7f8fd] text-gray-500 transition hover:bg-primary/10 hover:text-primary"
        onClick={onClose}
      >
        <CloseIcon />
      </button>
    </div>
    <div className="mt-8 space-y-6">{children}</div>
  </div>
);

const EditModal = ({
  onClose,
  onSubmit,
  englishText,
  arabicText,
  onEnglishChange,
  onArabicChange,
}: {
  onClose: () => void;
  onSubmit: () => void;
  englishText: string;
  arabicText: string;
  onEnglishChange: (value: string) => void;
  onArabicChange: (value: string) => void;
}) => (
  <ModalShell title="Edit Terms &amp; Condition" onClose={onClose}>
    <div className="space-y-6">
      <RichTextCard languageLabel="English" value={englishText} onChange={onEnglishChange} />
      <RichTextCard languageLabel="Arabic" value={arabicText} onChange={onArabicChange} />
      <div className="flex justify-end">
        <button
          type="button"
          className="rounded-full bg-primary px-10 py-3 text-sm font-semibold text-white shadow hover:bg-[#030447]"
          onClick={onSubmit}
        >
          Update
        </button>
      </div>
    </div>
  </ModalShell>
);

const RichTextCard = ({
  languageLabel,
  value,
  onChange,
}: {
  languageLabel: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-4 rounded-[28px] border border-gray-200 bg-[#f7f8fd] p-6">
    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
      <span>{languageLabel}</span>
      <ToolbarIconRow />
    </div>
    <textarea
      className="h-32 w-full resize-none rounded-[18px] border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </div>
);

const ToolbarIconRow = () => (
  <div className="flex items-center gap-3 text-xs text-gray-400">
    <span>Undo</span>
    <span>Redo</span>
    <span className="font-semibold">B</span>
    <span className="italic">I</span>
    <span>U</span>
    <span>�</span>
    <span>1.</span>
  </div>
);

const ConfirmModal = ({
  version,
  onClose,
  onCancel,
  onConfirm,
}: {
  version: string;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <ModalShell title="Confirm Update" onClose={onClose}>
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff3d9] text-[#b46a02]">
        <span className="text-4xl">!</span>
      </div>
      <p className="text-sm font-medium text-gray-600">
        Are you sure you want to update the Terms &amp; Condition (Version: {version})?
      </p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-500 hover:border-primary"
          onClick={onCancel}
        >
          No
        </button>
        <button
          type="button"
          className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#030447]"
          onClick={onConfirm}
        >
          Yes
        </button>
      </div>
    </div>
  </ModalShell>
);

const SuccessModal = ({ version, onClose }: { version: string; onClose: () => void }) => (
  <ModalShell title="Update Successful" onClose={onClose}>
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e9fbf3] text-[#09a66d]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
          <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-4-4 1.41-1.42L11 13.17l4.59-4.59L17 10l-6 7Z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-600">
        Terms &amp; Condition (Version {version}) updated successfully.
      </p>
      <div className="flex justify-center">
        <button
          type="button"
          className="rounded-full bg-primary px-10 py-3 text-sm font-semibold text-white shadow hover:bg-[#030447]"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </ModalShell>
);

const HistoryModal = ({ onClose, items }: { onClose: () => void; items: HistoryItem[] }) => (
  <ModalShell title="History" onClose={onClose}>
    <div className="space-y-4">
      <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={`${item.date}-${item.version}`} className="rounded-[20px] border border-gray-200 bg-[#f7f8fd] px-5 py-4 text-left text-sm text-gray-600">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              <span>Date : {item.date}</span>
              <span>Version : {item.version}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-600 hover:border-primary"
          onClick={onClose}
        >
          Print
        </button>
      </div>
    </div>
  </ModalShell>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" d="M20 20l-3-3" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h4l10.5-10.5a1.5 1.5 0 0 0-2.12-2.12L6 17.88V20Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 6.5l3 3" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 1 3 7" />
  </svg>
);

export default TermsConditionsMaster;
