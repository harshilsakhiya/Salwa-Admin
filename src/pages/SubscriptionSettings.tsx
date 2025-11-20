import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getAllIndividualSubscriptions,
  getBusinessSubscriptions,
} from "../services/SubsettingServices/SubsettingsServies";
import PrimaryButton from "../antd/PrimaryButton";
import SelectField from "../antd/SelectField";
import SearchField from "../antd/SearchField";

const INDIVIDUAL_CATEGORIES = [
  "Insurance Card Holder",
  "Doctors",
  "Transition Students",
  "Salwa Network Programs",
  "Medical Real State Owner",
];

const BUSINESS_CATEGORIES = [
  "Service Providers / Food Sector / Healthy Food Business � Small Facilities",
  "Service Providers / Food Sector / Healthy Food Business � Medium Facilities",
  "Service Providers / Food Sector / Healthy Food Business � Large Facilities",
  "Service Providers / Food Sector / Healthy Food Business � Mega Facilities",
];

const DURATIONS = ["1 Year", "2 Year", "3 Year"];

const SubscriptionSettings = () => {
  const [activeTab, setActiveTab] = useState<"individuals" | "business">(
    "individuals"
  );
  const [categoryFilter, setCategoryFilter] = useState("All Category");
  const [subCategoryFilter, setSubCategoryFilter] = useState("All Subcategory");
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  console.log(subscriptionData, loading);
  const categories =
    activeTab === "individuals" ? INDIVIDUAL_CATEGORIES : BUSINESS_CATEGORIES;

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setLoading(true);
      try {
        if (activeTab === "business") {
          // Call business subscription API with static IDs for now
          const data = await getBusinessSubscriptions(29, 34);
          setSubscriptionData(data);
        } else {
          const data = await getAllIndividualSubscriptions();
          setSubscriptionData(data);
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [activeTab]);

  const filteredCategories = categories.filter((title) => {
    const matchesCategory =
      categoryFilter === "All Category" || title.includes(categoryFilter);
    const matchesSubCategory =
      subCategoryFilter === "All Subcategory" ||
      title.includes(subCategoryFilter);
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSubCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full  flex-col gap-8 pb-3">
        <Header />
        <section className="space-y-8 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-primary">
                Subscription Manage
              </h2>
              <p className="text-sm text-gray-400">
                Configure product plans for every audience
              </p>
            </div>
            <PrimaryButton Children="Save" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-500">
              Subscription Type
            </span>
            <div className="flex rounded-full border border-gray-200 bg-[#f7f8fd] p-1 text-sm font-semibold text-gray-500">
              <ToggleButton
                label="Individuals"
                isActive={activeTab === "individuals"}
                onClick={() => setActiveTab("individuals")}
              />
              <ToggleButton
                label="Business"
                isActive={activeTab === "business"}
                onClick={() => setActiveTab("business")}
              />
            </div>
          </div>

          <FilterBar
            category={categoryFilter}
            subCategory={subCategoryFilter}
            search={searchTerm}
            onCategoryChange={setCategoryFilter}
            onSubCategoryChange={setSubCategoryFilter}
            onSearchChange={setSearchTerm}
          />

          <div className="space-y-10">
            {filteredCategories.map((title) => (
              <PlanSection key={title} title={title} />
            ))}
            {filteredCategories.length === 0 && (
              <div className="rounded-[28px] border border-dashed border-gray-300 bg-[#f7f8fd] px-6 py-12 text-center text-sm text-gray-500">
                No plans match the current filters.
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

const ToggleButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-4 py-2 transition ${isActive
      ? "bg-white text-primary shadow"
      : "text-gray-500 hover:text-primary"
      }`}
  >
    {label}
  </button>
);

const FilterBar = ({
  category,
  subCategory,
  search,
  onCategoryChange,
  onSubCategoryChange,
  onSearchChange,
}: {
  category: string;
  subCategory: string;
  search: string;
  onCategoryChange: (value: string) => void;
  onSubCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}) => {
  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="flex flex-wrap items-center gap-3 rounded-[28px] border border-gray-200 bg-[#f7f8fd] px-4 py-4"
    >
      <div className="grid grid-cols-2 w-full gap-2">
        <div className="grid grid-cols-2 gap-2">
          <Select
            label="Category"
            value={category}
            options={[
              "All Category",
              "Insurance",
              "Doctors",
              "Food Sector",
              "Education",
              "Hospitality",
            ]}
            onChange={(event) => onCategoryChange(event.target.value)}
          />
          <Select
            label="Sub Category"
            value={subCategory}
            options={[
              "All Subcategory",
              "Small Facilities",
              "Medium Facilities",
              "Large Facilities",
              "Mega Facilities",
            ]}
            onChange={(event) => onSubCategoryChange(event.target.value)}
          />
        </div>
        <SearchField
          label="Search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    </form>
  );
};

const PlanSection = ({ title }: { title: string }) => (
  <section className="space-y-5">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
      <div>
        <h3 className="text-xl font-semibold text-primary">{title}</h3>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
          Plan Packages
        </p>
      </div>
      <button className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-primary hover:border-primary">
        Templates
      </button>
    </header>
    <div className="grid gap-4 lg:grid-cols-3">
      {DURATIONS.map((duration) => (
        <PlanCard key={duration} duration={duration} />
      ))}
    </div>
  </section>
);

const PlanCard = ({ duration }: { duration: string }) => (
  <article className="space-y-4 rounded-[28px] border border-gray-200 bg-[#f7f8fd] p-6 shadow-inner">
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-semibold text-primary">{duration}</h4>
      <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
        SAR 50
      </span>
    </div>
    <div className="space-y-3">
      <Input label="Plan name" placeholder="Plan name" />
      <Input label="Discount" placeholder="0%" />
      <Input label="Amount" placeholder="0 SAR" />
      <Input label="Subscription Amount" placeholder="0 SAR" />
    </div>
    <div className="grid gap-2 sm:grid-cols-2">
      <Input label="Additional Discount" placeholder="0%" />
      <Input label="Bonus Commission" placeholder="0 SAR" />
    </div>
    <button className="w-full rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-primary hover:border-primary">
      Apply Changes
    </button>
  </article>
);

const Input = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => (
  <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
    {label}
    <input
      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-normal text-gray-600 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      placeholder={placeholder}
    />
  </label>
);

const Select = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <SelectField
    label={label}
    value={value}
    options={options.map((option) => (
      <option key={option}>{option}</option>
    ))}
    onChange={onChange}
  />
);

const Header = () => (
  <div className="flex items-center gap-4 rounded-[28px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
    <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary">
      <Icon />
    </div>
    <div>
      <h1 className="text-2xl font-semibold text-primary">
        Subscription Settings
      </h1>
      <p className="text-sm text-gray-400">
        Manage plan tiers for every customer type
      </p>
    </div>
  </div>
);

const Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 72 72"
    className="h-10 w-10"
    fill="#050668"
  >
    <path d="M54 12H18a6 6 0 0 0-6 6v36a6 6 0 0 0 6 6h36a6 6 0 0 0 6-6V18a6 6 0 0 0-6-6Zm-21 36H21v-6h12Zm0-12H21v-6h12Zm18 12H39v-6h12Zm0-12H39v-6h12Z" />
  </svg>
);

export default SubscriptionSettings;
