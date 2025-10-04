import { useEffect, useId, useState, type ChangeEvent, type DragEvent, type FC, type FormEvent } from "react";
import { useToast } from "./ToastProvider";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ProfileInfo = {
  fullName: string;
  nationalId: string;
  email: string;
  phone: string;
  userType: string;
  userCode: string;
};

type ExpiryInfo = {
  iqamaNumber: string;
  expiryDate: string;
};

type LocationInfo = {
  country: string;
  region: string;
  city: string;
  nationalAddress: string;
  address: string;
};

type UploadedDocument = {
  id: string;
  name: string;
  size?: number;
};

const createInitialProfile = (): ProfileInfo => ({
  fullName: "Ahmed Mohammad Alsuqmi",
  nationalId: "123456789",
  email: "abc@salwa.com",
  phone: "7000000000",
  userType: "Master",
  userCode: "SNPIA20250512000001",
});

const createInitialExpiry = (): ExpiryInfo => ({
  iqamaNumber: "123456789",
  expiryDate: "2026-12-31",
});

const createInitialLocation = (): LocationInfo => ({
  country: "Saudi Arabia",
  region: "Makkah",
  city: "Jeddah",
  nationalAddress: "YAD03344",
  address: "Idara St, King Abdul Aziz University, Jeddah",
});

const createInitialDocuments = (): UploadedDocument[] => [
  {
    id: `doc-${Date.now()}`,
    name: "document.pdf",
    size: 278000,
  },
];

const inputClasses =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

const sectionTitleClasses = "text-xs font-semibold uppercase tracking-[0.2em] text-gray-400";

const ProfileModal: FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const uploadInputId = useId();
  const [profile, setProfile] = useState<ProfileInfo>(createInitialProfile);
  const [expiry, setExpiry] = useState<ExpiryInfo>(createInitialExpiry);
  const [location, setLocation] = useState<LocationInfo>(createInitialLocation);
  const [documents, setDocuments] = useState<UploadedDocument[]>(createInitialDocuments);
  const [isInfoEditable, setIsInfoEditable] = useState(false);
  const [isExpiryEditable, setIsExpiryEditable] = useState(false);
  const [isLocationEditable, setIsLocationEditable] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsInfoEditable(false);
      setIsExpiryEditable(false);
      setIsLocationEditable(false);
      setIsDragActive(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const initials = profile.fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleProfileChange = (field: keyof ProfileInfo) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleExpiryChange = (field: keyof ExpiryInfo) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setExpiry((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field: keyof LocationInfo) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocation((prev) => ({ ...prev, [field]: value }));
  };

  const addFiles = (files: FileList | File[]) => {
    const nextDocuments = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
    }));

    if (nextDocuments.length > 0) {
      setDocuments((current) => [...current, ...nextDocuments]);
      showToast("File uploaded", "success");
    }
  };

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      addFiles(event.target.files);
      event.target.value = "";
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (event.dataTransfer.files?.length) {
      addFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (!isDragActive) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const nextTarget = event.relatedTarget as Node | null;
    if (nextTarget && event.currentTarget.contains(nextTarget)) {
      return;
    }
    setIsDragActive(false);
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments((current) => current.filter((item) => item.id !== id));
  };

  const formatFileSize = (size?: number) => {
    if (!size || Number.isNaN(size)) {
      return "";
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const resetAndClose = () => {
    setProfile(createInitialProfile());
    setExpiry(createInitialExpiry());
    setLocation(createInitialLocation());
    setDocuments(createInitialDocuments());
    setIsInfoEditable(false);
    setIsExpiryEditable(false);
    setIsLocationEditable(false);
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showToast("Profile details updated", "success");
    setIsInfoEditable(false);
    setIsExpiryEditable(false);
    setIsLocationEditable(false);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/55 px-4 py-10 backdrop-blur-[3px]" role="dialog" aria-modal="true">
      <div className="absolute inset-0" onClick={resetAndClose} aria-hidden="true" />
      <form
        onSubmit={handleSubmit}
        className="relative z-[1000] flex max-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[36px] bg-white shadow-[0_42px_110px_rgba(4,6,80,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow transition hover:bg-primary/10 hover:text-primary"
          onClick={resetAndClose}
        >
          <CloseIcon />
        </button>

        <div className="flex items-center justify-between border-b border-slate-200 bg-[#f7f8fd] px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-lg font-semibold text-white">{initials}</div>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="text-base font-semibold text-primary">{profile.fullName}</p>
              <p>
                National ID / IQAMA number : <span className="font-semibold text-gray-700">{profile.nationalId}</span>
              </p>
              <p>
                Email : <span className="font-semibold text-gray-700">{profile.email}</span>
              </p>
              <p>
                Phone Number : <span className="font-semibold text-gray-700">{profile.phone}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 text-right text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
            <span>
              User Type : <span className="ml-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">{profile.userType}</span>
            </span>
            <span className="text-gray-500">User code : {profile.userCode}</span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary hover:text-white"
              onClick={() => setIsInfoEditable((value) => !value)}
            >
              <EditIcon />
              {isInfoEditable ? "Done" : "Edit"}
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-8 py-10">
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className={sectionTitleClasses}>Profile information</h3>
              <span className="text-xs text-gray-400">Edit your personal details</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={sectionTitleClasses} htmlFor="full-name">
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  value={profile.fullName}
                  onChange={handleProfileChange("fullName")}
                  className={inputClasses}
                  disabled={!isInfoEditable}
                />
              </div>
              <div>
                <label className={sectionTitleClasses} htmlFor="national-id">
                  National ID / IQAMA number
                </label>
                <input
                  id="national-id"
                  type="text"
                  value={profile.nationalId}
                  onChange={handleProfileChange("nationalId")}
                  className={inputClasses}
                  disabled={!isInfoEditable}
                />
              </div>
              <div>
                <label className={sectionTitleClasses} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange("email")}
                  className={inputClasses}
                  disabled={!isInfoEditable}
                />
              </div>
              <div>
                <label className={sectionTitleClasses} htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleProfileChange("phone")}
                  className={inputClasses}
                  disabled={!isInfoEditable}
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className={sectionTitleClasses}>Update the information if it has expired</h3>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-500">Keep your national details current to avoid service interruption.</p>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary hover:text-white"
                onClick={() => setIsExpiryEditable((value) => !value)}
              >
                <EditIcon />
                {isExpiryEditable ? "Done" : "Edit"}
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={sectionTitleClasses} htmlFor="iqama-number">
                  ID Number / IQAMA Number
                </label>
                <input
                  id="iqama-number"
                  type="text"
                  value={expiry.iqamaNumber}
                  onChange={handleExpiryChange("iqamaNumber")}
                  className={inputClasses}
                  disabled={!isExpiryEditable}
                  placeholder="Enter ID / IQAMA number"
                />
              </div>
              <div>
                <label className={sectionTitleClasses} htmlFor="expiry-date">
                  Date of Expiry
                </label>
                <input
                  id="expiry-date"
                  type="date"
                  value={expiry.expiryDate}
                  onChange={handleExpiryChange("expiryDate")}
                  className={inputClasses}
                  disabled={!isExpiryEditable}
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className={sectionTitleClasses}>Update the location</h3>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary hover:text-white"
                onClick={() => setIsLocationEditable((value) => !value)}
              >
                <EditIcon />
                {isLocationEditable ? "Done" : "Edit"}
              </button>
            </div>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={sectionTitleClasses} htmlFor="country">
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    value={location.country}
                    onChange={handleLocationChange("country")}
                    className={inputClasses}
                    disabled={!isLocationEditable}
                  />
                </div>
                <div>
                  <label className={sectionTitleClasses} htmlFor="region">
                    Region
                  </label>
                  <input
                    id="region"
                    type="text"
                    value={location.region}
                    onChange={handleLocationChange("region")}
                    className={inputClasses}
                    disabled={!isLocationEditable}
                  />
                </div>
                <div>
                  <label className={sectionTitleClasses} htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={location.city}
                    onChange={handleLocationChange("city")}
                    className={inputClasses}
                    disabled={!isLocationEditable}
                  />
                </div>
                <div>
                  <label className={sectionTitleClasses} htmlFor="national-address">
                    National Address - SPL (Short Address)
                  </label>
                  <input
                    id="national-address"
                    type="text"
                    value={location.nationalAddress}
                    onChange={handleLocationChange("nationalAddress")}
                    className={inputClasses}
                    disabled={!isLocationEditable}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={sectionTitleClasses} htmlFor="address">
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={location.address}
                    onChange={handleLocationChange("address")}
                    className={inputClasses}
                    disabled={!isLocationEditable}
                  />
                </div>
              </div>
              <div className="flex h-full flex-col justify-between rounded-[28px] border border-dashed border-gray-200 bg-[#f7f8fd] p-6 text-center text-sm text-gray-500">
                <div className="flex flex-1 items-center justify-center">
                  <MapIcon />
                </div>
                <button
                  type="button"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#030447] disabled:cursor-not-allowed disabled:bg-primary/40"
                  disabled={!isLocationEditable}
                >
                  <LocationPinIcon />
                  Get Geocode
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className={sectionTitleClasses}>Please upload all necessary documents that need to be updated</h3>
            <label
              htmlFor={uploadInputId}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`flex flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed ${
                isDragActive ? "border-primary bg-primary/5" : "border-gray-300 bg-[#f9faff]"
              } px-6 py-12 text-center text-sm text-gray-500 transition`}
            >
              <UploadIcon />
              <span className="max-w-md text-sm text-gray-500">
                Drag and Drop file here or <span className="font-semibold text-primary">Choose File</span>
              </span>
              <input id={uploadInputId} type="file" className="sr-only" multiple onChange={handleFilesSelected} />
            </label>
            {documents.length > 0 && (
              <ul className="space-y-3">
                {documents.map((document) => (
                  <li key={document.id} className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-white px-5 py-3 text-sm text-gray-600 shadow-sm">
                    <span className="flex items-center gap-3">
                      <DocumentIcon />
                      {document.name}
                    </span>
                    <span className="flex items-center gap-4 text-xs text-gray-400">
                      {formatFileSize(document.size)}
                      <button
                        type="button"
                        className="rounded-full border border-transparent p-2 text-gray-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove ${document.name}`}
                        onClick={() => handleRemoveDocument(document.id)}
                      >
                        <TrashIcon />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-[#f7f8fd] px-8 py-5">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-600 transition hover:border-primary hover:text-primary"
            onClick={resetAndClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#030447]"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 13.5V16h2.5l7.4-7.4-2.5-2.5L4 13.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 6l1.8-1.8a1.2 1.2 0 0 1 1.7 0l.8.8a1.2 1.2 0 0 1 0 1.7L15 8.5" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-10 w-10 text-primary">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 9l5-5 5 5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4 text-primary">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2h5.5L16 6.5V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 2v4h4" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h14" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5V3h4v2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 5l1 11a1 1 0 0 0 1 .9h4a1 1 0 0 0 1-.9l1-11" />
  </svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-28 w-full text-primary/30">
    <rect x="5" y="5" width="110" height="70" rx="12" ry="12" strokeDasharray="6 10" />
    <path strokeLinecap="round" d="M30 55c8-10 20-10 28 0s20 10 28 0 20-10 28 0" />
    <path strokeLinecap="round" d="M40 30c4-5 10-5 14 0s10 5 14 0 10-5 14 0" />
  </svg>
);

const LocationPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4 text-white">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 18s6-4.5 6-9a6 6 0 1 0-12 0c0 4.5 6 9 6 9z" />
    <circle cx="10" cy="9" r="2.5" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5l10 10M15 5L5 15" />
  </svg>
);

export default ProfileModal;
