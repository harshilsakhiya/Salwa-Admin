import { useMemo, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import DashboardLayout from "../layouts/DashboardLayout";
import type { RentalServicesState } from "./RentalServices";
import CommonServices from "../services/CommonServices/CommonServices";

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  hasSubServices?: boolean;
  categoryId?: string;
  serviceId?: string;
  serviceTitle?: string;
  optionId?: string;
  optionTitle?: string;
  baseRoute?: string;
  payload?: RentalServicesState;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
}

interface ApiCategory {
  Id: string;
  Name: string;
  icon: string;
  description: string;
  isActive?: boolean;
  sortOrder?: number;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

const ServiceDashboard = () => {
  const navigate = useNavigate();
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentServices, setCurrentServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalSubtitle, setModalSubtitle] = useState<string>("");
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [subServices, setSubServices] = useState<Service[]>([]);
  const [subServicesLoading, setSubServicesLoading] = useState(false);
  const [selectedSubService, setSelectedSubService] = useState<Service | null>(null);
  const [isOrderReportModalOpen, setIsOrderReportModalOpen] = useState(false);

  // API function to fetch services by category ID
  const fetchServicesByCategory = async (categoryId: string) => {
    try {
      setServicesLoading(true);
      const response = (await CommonServices.CommonApi({
        Parameter: `{"ParentId":${categoryId}}`,
        SPName: "USP_GetAdminCategoryServices",
        Language: "EN",
      } )) as ApiResponse;

      if (response?.success && response?.data) {
        const services: Service[] = JSON.parse(response.data).map(
          (apiService: any) => ({
            id: apiService.Id,
            title: apiService.Name,
            description: apiService.Description || "Service description",
            icon: apiService.Icon || "/theme-icons/genral-service.png",
            hasSubServices: apiService.HasSubServices || false,
            categoryId: categoryId,
            serviceId: apiService.Id,
            serviceTitle: apiService.Name,
          })
        );
        return services;
      }
      return [];
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    } finally {
      setServicesLoading(false);
    }
  };

  // API function to fetch sub-services by service ID
  const fetchSubServices = async (serviceId: string) => {
    try {
      setSubServicesLoading(true);
      const response = (await CommonServices.CommonApi({
        Parameter: `{"ParentId":${serviceId}}`,
        SPName: "USP_GetAdminServiceSubServices",
        Language: "EN",
      })) as ApiResponse;

      if (response?.success && response?.data) {
        const subServices: Service[] = JSON.parse(response.data).map(
          (apiService: any) => ({
            id: apiService.Id,
            title: apiService.Name,
            description: apiService.Description || "Sub-service description",
            icon: apiService.Icon || "/theme-icons/genral-service.png",
            hasSubServices: false, // Sub-services typically don't have further sub-services
            categoryId: selectedServices[0]?.categoryId,
            serviceId: serviceId,
            serviceTitle: selectedServices[0]?.serviceTitle,
            optionId: apiService.Id,
            optionTitle: apiService.Name,
            baseRoute: `/service-dashboard/${selectedServices[0]?.categoryId}-services`,
          })
        );
        return subServices;
      }
      return [];
    } catch (error) {
      console.error("Error fetching sub-services:", error);
      return [];
    } finally {
      setSubServicesLoading(false);
    }
  };

  // Fetch categories from API on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = (await CommonServices.CommonApi({
          Parameter: "",
          SPName: "USP_GetAllAdminCategory",
          Language: "EN",
        })) as ApiResponse;

        if (response?.success && response?.data) {
          // Transform API data to match Category interface
          const transformedCategories: Category[] = JSON.parse(
            response.data
          ).map((apiCategory: ApiCategory) => ({
            id: apiCategory.Id,
            title: apiCategory.Name,
            icon: apiCategory.icon || "/theme-icons/genral-service.png", // fallback icon
            description: apiCategory.description || "Use the Service",
          }));

          setDynamicCategories(transformedCategories);
          if (transformedCategories.length > 0) {
            setSelectedCategory(transformedCategories[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load service categories");
        // Fallback to static categories on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return dynamicCategories;
    }

    const searchLower = searchTerm.toLowerCase();
    return dynamicCategories.filter(
      (category) =>
        category.title.toLowerCase().includes(searchLower) ||
        category.description.toLowerCase().includes(searchLower)
    );
  }, [dynamicCategories, searchTerm]);

  const activeCategory = useMemo(
    () =>
      dynamicCategories.find((category) => category.id === activeCategoryId) ??
      null,
    [activeCategoryId, dynamicCategories]
  );

  const currentSelection = selectedServices[currentStepIndex] ?? null;

  const handleCategoryClick = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = filteredCategories.find(
      (entry) => entry.id === categoryId
    );
    if (category) {
      setActiveCategoryId(categoryId);
      setCurrentStepIndex(0);
      setSelectedServices([]);
      setModalTitle(category.title);
      setModalSubtitle("Choose the service you want to manage.");

      // Fetch services for this category
      const services = await fetchServicesByCategory(categoryId);
      setCurrentServices(services);
      setIsModalOpen(true);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveCategoryId(null);
    setSelectedServices([]);
    setCurrentStepIndex(0);
    setCurrentServices([]);
  };

  const handleServiceSelect = async (service: Service) => {
    setSelectedService(service);
    setModalTitle(service.title);
    setModalSubtitle("Select sub-service or proceed to orders.");
    
    // Fetch sub-services for this service
    const subServicesData = await fetchSubServices(service.id);
    setSubServices(subServicesData);
    
    // Close main modal and open service modal
    setIsModalOpen(false);
    setIsServiceModalOpen(true);
  };

  const handleNextStep = () => {
    // This is now just for the main modal - services will open service modal
    if (currentSelection) {
      handleServiceSelect(currentSelection);
    }
  };

  const handleSubServiceSelect = (subService: Service) => {
    setSelectedSubService(subService);
  };

  const handleSubServiceNext = () => {
    // Close sub-service modal and open Order/Report modal
    setIsServiceModalOpen(false);
    setIsOrderReportModalOpen(true);
  };

  const handleActionSelect = (action: 'order' | 'report') => {
    // Log the required data
    const logData = {
      categoryId: selectedService?.categoryId,
      serviceId: selectedService?.serviceId,
      subServiceId: selectedSubService?.id || null,
      action: action
    };
    
    console.log('Action Selected:', logData);
    
    // Navigate to dashboard
    // handleCloseOrderReportModal();
    // navigate('/dashboard', {
    //   state: {
    //     ...logData,
    //     categoryTitle: activeCategory?.title,
    //     serviceTitle: selectedService?.serviceTitle,
    //     subServiceTitle: selectedSubService?.title,
    //   }
    // });
  };

  const handleCloseOrderReportModal = () => {
    setIsOrderReportModalOpen(false);
    setSelectedService(null);
    setSelectedSubService(null);
    setSubServices([]);
    setIsModalOpen(true); // Return to main modal
  };



  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedService(null);
    setSubServices([]);
    setSelectedSubService(null);
    setIsModalOpen(true); // Return to main modal
  };

  const handleBackStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      // Reset to previous level services
      if (currentStepIndex === 1) {
        // Go back to main services
        fetchServicesByCategory(activeCategoryId!).then(setCurrentServices);
        setModalTitle(activeCategory?.title || "");
        setModalSubtitle("Choose the service you want to manage.");
      }
    }
  };

  const nextDisabled = !currentSelection || servicesLoading;
  const nextLabel = "View Orders";

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full  flex-col gap-8 pb-3">
        <section className="space-y-8 rounded-2xl border border-slate-200 bg-white px-10 py-10 shadow-card">
          <header className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-helveticaBold text-primary">
                Welcome to Salwa
              </h1>
              <p className="max-w-xl text-sm font-textMedium text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim in eros elementum tristique.
              </p>
            </div>
            <div className="relative w-full max-w-sm">
              <input
                type="search"
                placeholder="Search here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 pl-12 pr-10 text-sm text-gray-600 shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
              <span className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-primary/70">
                <img
                  src="/theme-icons/Search ICon.svg"
                  alt="search"
                  className="h-5 w-5"
                />
              </span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-4 grid place-items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6l12 12M18 6L6 18"
                    />
                  </svg>
                </button>
              )}
            </div>
          </header>

          <div className="space-y-4">
            <h2 className="text-lg font-helveticaBold text-primary">
              Service Category
            </h2>
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {[...Array(10)].map((_, index) => (
                  <div
                    key={index}
                    className="flex h-44 animate-pulse flex-col justify-between rounded-2xl border border-slate-200 bg-slate-100 px-6 py-5"
                  >
                    <div className="h-12 w-12 rounded-xl bg-slate-200"></div>
                    <div className="space-y-3">
                      <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                      <div className="h-3 w-1/2 rounded bg-slate-200"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
                <p className="text-red-600 mb-2">Error loading categories</p>
                <p className="text-sm text-red-500">{error}</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      selected={selectedCategory === category.id}
                      onClick={handleCategoryClick}
                    />
                  ))
                ) : (
                  <div className="col-span-full rounded-2xl border border-gray-100 bg-[#f7f8fd] px-6 py-10 text-center text-sm text-gray-500">
                    No categories found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {isModalOpen && activeCategory && (
        <ModalOverlay>
          <ModalShell
            title={modalTitle}
            subtitle={modalSubtitle}
            onClose={handleCloseModal}
          >
            <div className="space-y-6">
              {servicesLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="flex h-32 animate-pulse flex-col justify-between rounded-2xl border border-slate-200 bg-slate-100 px-6 py-5"
                    >
                      <div className="h-12 w-12 rounded-xl bg-slate-200"></div>
                      <div className="space-y-3">
                        <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                        <div className="h-3 w-1/2 rounded bg-slate-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentServices.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {currentServices.map((service) => (
                    <SelectableCard
                      key={service.id}
                      title={service.title}
                      description={service.description}
                      icon={service.icon ?? activeCategory.icon}
                      selected={currentSelection?.id === service.id}
                      onSelect={() => handleServiceSelect(service)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-[#f7f8fd] px-6 py-10 text-center text-sm text-gray-500">
                  No services available for this category.
                </div>
              )}
              <ModalFooter
                onCancel={handleCloseModal}
                onBack={currentStepIndex > 0 ? handleBackStep : undefined}
                onNext={handleNextStep}
                nextDisabled={nextDisabled}
                nextLabel={nextLabel}
              />
            </div>
          </ModalShell>
        </ModalOverlay>
      )}

      {/* Service Modal for Sub-services */}
      {isServiceModalOpen && selectedService && (
        <ModalOverlay>
          <ModalShell
            title={modalTitle}
            subtitle={modalSubtitle}
            onClose={handleCloseServiceModal}
          >
            <div className="space-y-6">
              {subServicesLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="flex h-32 animate-pulse flex-col justify-between rounded-2xl border border-slate-200 bg-slate-100 px-6 py-5"
                    >
                      <div className="h-12 w-12 rounded-xl bg-slate-200"></div>
                      <div className="space-y-3">
                        <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                        <div className="h-3 w-1/2 rounded bg-slate-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : subServices.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {subServices.map((subService) => (
                    <SelectableCard
                      key={subService.id}
                      title={subService.title}
                      description={subService.description}
                      icon={subService.icon ?? selectedService.icon}
                      selected={selectedSubService?.id === subService.id}
                      onSelect={() => handleSubServiceSelect(subService)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-[#f7f8fd] px-6 py-10 text-center text-sm text-gray-500">
                  <p className="mb-4">No sub-services available for this service.</p>
                  <p className="text-xs">Click Next to proceed to Order/Report selection.</p>
                </div>
              )}
              
              <ModalFooter
                onCancel={handleCloseServiceModal}
                onNext={handleSubServiceNext}
                nextDisabled={subServicesLoading || (subServices.length > 0 && !selectedSubService)}
                nextLabel="Next"
              />
            </div>
          </ModalShell>
        </ModalOverlay>
      )}

      {/* Order/Report Selection Modal */}
      {isOrderReportModalOpen && selectedService && (
        <ModalOverlay>
          <ModalShell
            title="Select Option"
            subtitle="Choose what you want to do"
            onClose={handleCloseOrderReportModal}
          >
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <ActionCard
                  title="Order"
                  description="Create and manage orders"
                  icon="/theme-icons/orders-icon.png"
                  onClick={() => handleActionSelect('order')}
                />
                <ActionCard
                  title="Report"
                  description="View and generate reports"
                  icon="/theme-icons/report.png"
                  onClick={() => handleActionSelect('report')}
                />
              </div>
              
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-500 transition hover:border-primary hover:text-primary"
                  onClick={handleCloseOrderReportModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </ModalShell>
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};
const CategoryCard = ({
  category,
  selected,
  onClick,
}: {
  category: Category;
  selected: boolean;
  onClick: (id: string) => void;
}) => (
  <button
    type="button"
    onClick={() => onClick(category.id)}
    className={clsx(
      "flex h-44 flex-col justify-between rounded-2xl border px-6 py-5 text-left transition duration-200 shadow",
      selected
        ? "border-transparent bg-[linear-gradient(180deg,#05055C_0%,#0D0D78_100%)] text-white"
        : "border-slate-200 bg-white text-primary hover:border-primary/40 hover:shadow-lg"
    )}
  >
    <span
      className={clsx(
        "grid h-12 w-12 place-items-center rounded-xl",
        selected ? "bg-white/15" : "bg-slate-100"
      )}
    >
      <img
        src={category.icon}
        alt=""
        className={clsx(
          "h-7 w-7",
          selected ? "filter brightness-0 invert" : ""
        )}
      />
    </span>
    <div className="space-y-3">
      <p
        className={clsx(
          "text-base font-helveticaBold",
          selected ? "text-white" : "text-primary"
        )}
      >
        {category.title}
      </p>
      <span
        className={clsx(
          "inline-flex items-center gap-2 text-sm font-textMedium",
          selected ? "text-white" : "text-primary"
        )}
      >
        {category.description}
        <ArrowIcon selected={selected} />
      </span>
    </div>
  </button>
);

const SelectableCard = ({
  title,
  description,
  icon,
  selected,
  onSelect,
}: {
  title: string;
  description: string;
  icon?: string;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={clsx(
      "flex h-full flex-col gap-5 rounded-[28px] border px-6 py-6 text-left transition shadow-sm",
      selected
        ? "border-transparent bg-[linear-gradient(180deg,#05055C_0%,#0D0D78_100%)] text-white"
        : "border-gray-200 bg-white text-primary hover:border-primary/40 hover:shadow-lg"
    )}
  >
    <span
      className={clsx(
        "grid h-16 w-16 place-items-center rounded-2xl",
        selected ? "bg-white/15" : "bg-slate-100 text-primary"
      )}
    >
      {icon ? (
        <img
          src={icon}
          alt=""
          className={clsx(
            "h-10 w-10",
            selected ? "filter brightness-0 invert" : ""
          )}
        />
      ) : (
        <span
          className={clsx(
            "text-2xl font-semibold",
            selected ? "text-white" : "text-primary"
          )}
        >
          ?
        </span>
      )}
    </span>
    <div className="space-y-2">
      <p className="text-lg font-helveticaBold">{title}</p>
      <p className={clsx("text-sm text-gray-500", selected && "text-white/80")}>
        {description}
      </p>
    </div>
    <span
      className={clsx(
        "mt-auto inline-flex items-center gap-2 text-sm font-semibold",
        selected ? "text-white" : "text-primary"
      )}
    >
      Proceed
      <ArrowIcon selected={selected} />
    </span>
  </button>
);

const ModalOverlay = ({ children }: { children: ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-[6px] px-4">
    {children}
  </div>
);

const ModalShell = ({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) => (
  <div className="w-full max-w-3xl rounded-[36px] bg-white px-8 py-10 shadow-[0_40px_90px_rgba(5,6,104,0.18)]">
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-5">
      <div>
        <h3 className="text-xl font-semibold text-primary">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      <button
        type="button"
        aria-label="Close"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7f8fd] text-gray-500 transition hover:bg-primary/10 hover:text-primary"
        onClick={onClose}
      >
        <CloseIcon />
      </button>
    </div>
    <div className="mt-8 space-y-6">{children}</div>
  </div>
);

const ModalFooter = ({
  onCancel,
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
}: {
  onCancel: () => void;
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}) => (
  <div className="flex justify-between pt-2">
    <div>
      {onBack && (
        <button
          type="button"
          className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-500 transition hover:border-primary hover:text-primary"
          onClick={onBack}
        >
          Back
        </button>
      )}
    </div>
    <div className="flex gap-3">
      <button
        type="button"
        className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-500 transition hover:border-primary hover:text-primary"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="button"
        className="rounded-full bg-primary px-10 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#030447] disabled:cursor-not-allowed disabled:bg-primary/70"
        onClick={onNext}
        disabled={Boolean(nextDisabled)}
      >
        {nextLabel ?? "Next"}
      </button>
    </div>
  </div>
);

const ArrowIcon = ({ selected }: { selected: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={clsx(
      "h-4 w-4 transition",
      selected ? "text-white" : "text-primary"
    )}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 12h14M13 6l6 6-6 6"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 6l12 12M18 6L6 18"
    />
  </svg>
);

const ActionCard = ({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-32 flex-col gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-5 text-left transition shadow-sm hover:border-primary/40 hover:shadow-lg"
  >
    <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-primary">
      <img
        src={icon}
        alt=""
        className="h-8 w-8"
      />
    </span>
    <div className="space-y-2">
      <p className="text-lg font-helveticaBold text-primary">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </button>
);

export default ServiceDashboard;
