
import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import DashboardLayout from "../layouts/DashboardLayout";
import type { OrderRecord, RentalServicesState } from "./RentalServices";

interface FlowNode {
  id: string;
  title: string;
  description: string;
  icon?: string;
  options?: FlowNode[];
  payload?: RentalServicesState;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  flow?: FlowNode[];
}

const ORDER_TEMPLATE: OrderRecord[] = [
  {
    id: 1,
    orderNo: "#0033",
    orderTitle: "MRI Machine Lease",
    deviceName: "Siemens MAGNETOM",
    fdaNumber: "FDA1234567",
    deviceType: "Medical Imaging",
    approvalNumber: "APP-99812",
    date: "Jan 15, 2024",
    country: "Saudi Arabia",
    region: "Region 1",
    city: "Riyadh",
    status: "Pending",
  },
  {
    id: 2,
    orderNo: "#0045",
    orderTitle: "Clinic Automation",
    deviceName: "Steris AMSCO",
    fdaNumber: "FDA2233445",
    deviceType: "Sterilization",
    approvalNumber: "APP-99835",
    date: "Jan 12, 2024",
    country: "Saudi Arabia",
    region: "Region 2",
    city: "Jeddah",
    status: "Approved",
  },
  {
    id: 3,
    orderNo: "#0046",
    orderTitle: "Dialysis Chairs",
    deviceName: "Fresenius 5008",
    fdaNumber: "FDA5566771",
    deviceType: "Dialysis",
    approvalNumber: "APP-99838",
    date: "Jan 10, 2024",
    country: "Saudi Arabia",
    region: "Region 3",
    city: "Dammam",
    status: "Rejected",
  },
  {
    id: 4,
    orderNo: "#0047",
    orderTitle: "Portable X-Ray Fleet",
    deviceName: "GE Optima",
    fdaNumber: "FDA1112233",
    deviceType: "Radiology",
    approvalNumber: "APP-99842",
    date: "Jan 09, 2024",
    country: "Saudi Arabia",
    region: "Region 4",
    city: "Abha",
    status: "Published",
  },
  {
    id: 5,
    orderNo: "#0048",
    orderTitle: "Clinic Refurbishment",
    deviceName: "Hillrom Beds",
    fdaNumber: "FDA8899770",
    deviceType: "Facilities",
    approvalNumber: "APP-99844",
    date: "Jan 07, 2024",
    country: "Saudi Arabia",
    region: "Region 1",
    city: "Riyadh",
    status: "Pending",
  },
  {
    id: 6,
    orderNo: "#0049",
    orderTitle: "Dental Imaging Suite",
    deviceName: "Carestream CS 8100",
    fdaNumber: "FDA4455667",
    deviceType: "Dental",
    approvalNumber: "APP-99847",
    date: "Jan 05, 2024",
    country: "Saudi Arabia",
    region: "Region 2",
    city: "Mecca",
    status: "Approved",
  },
  {
    id: 7,
    orderNo: "#0050",
    orderTitle: "Maternal Care Unit",
    deviceName: "Philips Avalon",
    fdaNumber: "FDA3344556",
    deviceType: "Monitoring",
    approvalNumber: "APP-99849",
    date: "Jan 04, 2024",
    country: "Saudi Arabia",
    region: "Region 3",
    city: "Tabuk",
    status: "Pending",
  },
  {
    id: 8,
    orderNo: "#0051",
    orderTitle: "Operating Room Lights",
    deviceName: "Maquet PowerLED",
    fdaNumber: "FDA6677889",
    deviceType: "Surgical",
    approvalNumber: "APP-99854",
    date: "Jan 02, 2024",
    country: "Saudi Arabia",
    region: "Region 4",
    city: "Medina",
    status: "Published",
  },
  {
    id: 9,
    orderNo: "#0052",
    orderTitle: "Cath Lab Upgrade",
    deviceName: "Siemens Artis",
    fdaNumber: "FDA7788990",
    deviceType: "Cardiology",
    approvalNumber: "APP-99856",
    date: "Dec 30, 2023",
    country: "Saudi Arabia",
    region: "Region 2",
    city: "Jeddah",
    status: "Rejected",
  },
  {
    id: 10,
    orderNo: "#0053",
    orderTitle: "ICU Ventilators",
    deviceName: "Drager Evita",
    fdaNumber: "FDA9900112",
    deviceType: "Respiratory",
    approvalNumber: "APP-99860",
    date: "Dec 28, 2023",
    country: "Saudi Arabia",
    region: "Region 1",
    city: "Riyadh",
    status: "Approved",
  },
  {
    id: 11,
    orderNo: "#0054",
    orderTitle: "Physiotherapy Equipment",
    deviceName: "Chattanooga Intelect",
    fdaNumber: "FDA2233557",
    deviceType: "Rehab",
    approvalNumber: "APP-99861",
    date: "Dec 26, 2023",
    country: "Saudi Arabia",
    region: "Region 3",
    city: "Hail",
    status: "Pending",
  },
  {
    id: 12,
    orderNo: "#0055",
    orderTitle: "Emergency Vehicles",
    deviceName: "Mercedes Sprinter",
    fdaNumber: "FDA6677000",
    deviceType: "Fleet",
    approvalNumber: "APP-99863",
    date: "Dec 24, 2023",
    country: "Saudi Arabia",
    region: "Region 4",
    city: "Najran",
    status: "Published",
  },
];
const sanitizePrefix = (value: string) => {
  const cleaned = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();
  return cleaned.slice(0, 3) || "SRV";
};

const createOrders = (serviceTitle: string, prefix: string): OrderRecord[] =>
  ORDER_TEMPLATE.map((order, index) => {
    const sequence = (index + 1).toString().padStart(4, "0");
    const code = sanitizePrefix(prefix);
    return {
      ...order,
      orderNo: `${prefix}${sequence}`,
      orderTitle: `${serviceTitle} ${index + 1}`,
      deviceName: serviceTitle,
      deviceType: serviceTitle,
      fdaNumber: `${code}-${sequence}`,
      approvalNumber: `${code}-APP-${sequence}`,
    };
  });

const createPayload = (config: {
  categoryId: string;
  serviceId: string;
  serviceTitle: string;
  optionId: string;
  optionTitle: string;
  baseRoute: string;
  items: OrderRecord[];
}): RentalServicesState => ({
  categoryId: config.categoryId,
  serviceId: config.serviceId,
  serviceTitle: config.serviceTitle,
  optionId: config.optionId,
  optionTitle: config.optionTitle,
  baseRoute: config.baseRoute,
  items: config.items,
});

const buildFlowLeaf = (config: {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  serviceId: string;
  serviceTitle: string;
  optionId: string;
  optionTitle: string;
  baseRoute: string;
  orderPrefix: string;
  orderLabel: string;
}): FlowNode => ({
  id: config.id,
  title: config.title,
  description: config.description,
  payload: createPayload({
    categoryId: config.categoryId,
    serviceId: config.serviceId,
    serviceTitle: config.serviceTitle,
    optionId: config.optionId,
    optionTitle: config.optionTitle,
    baseRoute: config.baseRoute,
    items: createOrders(config.orderLabel, config.orderPrefix),
  }),
});

const BASE_ROUTES = {
  insurance: "/service-dashboard/insurance-services",
  rental: "/service-dashboard/rental-services",
  sell: "/service-dashboard/sell-services",
  medicalLegal: "/service-dashboard/medical-legal-services",
  medicalStaff: "/service-dashboard/medical-staff-services",
  healthMarketplace: "/service-dashboard/health-marketplace-services",
  medicalRealEstate: "/service-dashboard/medical-real-estate-services",
  general: "/service-dashboard/general-services",
  food: "/service-dashboard/food-services",
  nonMedical: "/service-dashboard/non-medical-services",
} as const;

const buildDualStatusLeaves = (config: {
  categoryId: string;
  serviceId: string;
  serviceTitle: string;
  baseRoute: string;
  orderPrefix: string;
  orderLabel: string;
  newTitle?: string;
  newDescription?: string;
  publishTitle?: string;
  publishDescription?: string;
}): FlowNode[] => [
  buildFlowLeaf({
    id: `${config.serviceId}-new`,
    title: config.newTitle ?? "New Requests",
    description: config.newDescription ?? "Review new submissions awaiting action.",
    categoryId: config.categoryId,
    serviceId: config.serviceId,
    serviceTitle: config.serviceTitle,
    optionId: `${config.serviceId}-new`,
    optionTitle: config.newTitle ?? "New Requests",
    baseRoute: config.baseRoute,
    orderPrefix: `${config.orderPrefix}N-`,
    orderLabel: `${config.orderLabel} - New`,
  }),
  buildFlowLeaf({
    id: `${config.serviceId}-published`,
    title: config.publishTitle ?? "Published Orders",
    description: config.publishDescription ?? "Monitor orders that have been accepted and published.",
    categoryId: config.categoryId,
    serviceId: config.serviceId,
    serviceTitle: config.serviceTitle,
    optionId: `${config.serviceId}-published`,
    optionTitle: config.publishTitle ?? "Published Orders",
    baseRoute: config.baseRoute,
    orderPrefix: `${config.orderPrefix}P-`,
    orderLabel: `${config.orderLabel} - Published`,
  }),
];
const insuranceFlow: FlowNode[] = [
  {
    id: "insuranceStrategy",
    title: "Insurance Strategy Programs",
    description: "Manage enterprise and retail coverage offerings.",
    icon: "/theme-icons/insurance-service.png",
    options: [
      {
        id: "corporatePortfolio",
        title: "Corporate Policy Portfolio",
        description: "Track corporate policy onboarding and renewals.",
        options: [
          buildFlowLeaf({
        id: "policyRenewals",
        title: "Renewal Orders",
        description: "Review renewal submissions awaiting approval or publishing.",
        categoryId: "insurance",
        serviceId: "corporatePortfolio",
        serviceTitle: "Corporate Policy Portfolio",
        optionId: "policyRenewals",
        optionTitle: "Renewal Orders",
        baseRoute: BASE_ROUTES.insurance,
        orderPrefix: "INS-",
        orderLabel: "Corporate Policy Renewal",
          }),
        ],
      },
    ],
  },
];

const rentalFlow: FlowNode[] = [
  {
    id: "rentMedicalEquipment",
    title: "Rent Medical Equipment and Facilities",
    description: "Lease medical equipment and supporting facilities on demand.",
    icon: "/theme-icons/rental-service.png",
    options: [
      buildFlowLeaf({
        id: "rentMedicalEquipmentOrders",
        title: "Orders",
        description: "Review onboarding status for submitted rental orders.",
        categoryId: "rental",
        serviceId: "rentMedicalEquipment",
        serviceTitle: "Rent Medical Equipment and Facilities",
        optionId: "rentMedicalEquipmentOrders",
        optionTitle: "Orders",
        baseRoute: BASE_ROUTES.rental,
        orderPrefix: "RNT-",
        orderLabel: "Rental Equipment Order",
      }),
    ],
  },
  {
    id: "clinicRental",
    title: "Clinic Rental",
    description: "Manage clinic rental requests from hospitals and providers.",
    icon: "/theme-icons/rental-service.png",
    options: [
      buildFlowLeaf({
        id: "clinicRentalOrders",
        title: "Orders",
        description: "Track clinic rental approvals and publishing status.",
        categoryId: "rental",
        serviceId: "clinicRental",
        serviceTitle: "Clinic Rental",
        optionId: "clinicRentalOrders",
        optionTitle: "Orders",
        baseRoute: BASE_ROUTES.rental,
        orderPrefix: "CLN-",
        orderLabel: "Clinic Rental Request",
      }),
    ],
  },
];

const sellFlow: FlowNode[] = [
  {
    id: "assetMarketplace",
    title: "Medical Asset Listings",
    description: "Oversee sale listings for medical devices and services.",
    options: [
      buildFlowLeaf({
        id: "assetMarketplaceOrders",
        title: "Orders",
        description: "Track acceptance and publishing status for sale orders.",
        categoryId: "sell",
        serviceId: "assetMarketplace",
        serviceTitle: "Medical Asset Listings",
        optionId: "assetMarketplaceOrders",
        optionTitle: "Orders",
        baseRoute: BASE_ROUTES.sell,
        orderPrefix: "SEL-",
        orderLabel: "Asset Sale Order",
      }),
    ],
  },
];

const medicalLegalFlow: FlowNode[] = [
  {
    id: "complianceSupport",
    title: "Compliance Support",
    description: "Coordinate medical legal documentation and reviews.",
    options: [
      buildFlowLeaf({
        id: "complianceSupportOrders",
        title: "Orders",
        description: "Monitor legal cases awaiting acceptance or publishing.",
        categoryId: "medicalLegal",
        serviceId: "complianceSupport",
        serviceTitle: "Compliance Support",
        optionId: "complianceSupportOrders",
        optionTitle: "Orders",
        baseRoute: BASE_ROUTES.medicalLegal,
        orderPrefix: "LEG-",
        orderLabel: "Legal Compliance Case",
      }),
    ],
  },
];

const medicalStaffFlow: FlowNode[] = [
  {
    id: "staffingPortal",
    title: "Staffing Portal",
    description: "Manage medical staffing requests and contracts.",
    icon: "/theme-icons/medical-staff-services.png",
    options: [
      buildFlowLeaf({
        id: "staffingPortalOrders",
        title: "Orders",
        description: "Review staffing assignments awaiting review.",
        categoryId: "medicalStaff",
        serviceId: "staffingPortal",
        serviceTitle: "Staffing Portal",
        optionId: "staffingPortalOrders",
        optionTitle: "Orders",
        baseRoute: BASE_ROUTES.medicalStaff,
        orderPrefix: "STF-",
        orderLabel: "Staff Assignment Order",
      }),
    ],
  },
];

const healthMarketplaceFlow: FlowNode[] = [
  {
    id: "supplierMarketplace",
    title: "Supplier Marketplace",
    description: "Coordinate supplier onboarding for the marketplace.",
    options: buildDualStatusLeaves({
      categoryId: "healthMarketplace",
      serviceId: "supplierMarketplace",
      serviceTitle: "Supplier Marketplace",
      baseRoute: BASE_ROUTES.healthMarketplace,
      orderPrefix: "HMP-SUP-",
      orderLabel: "Supplier Marketplace",
    }),
  },
  {
    id: "deviceAuctions",
    title: "Device Auctions",
    description: "Manage auction-based listings for devices and equipment.",
    options: buildDualStatusLeaves({
      categoryId: "healthMarketplace",
      serviceId: "deviceAuctions",
      serviceTitle: "Device Auctions",
      baseRoute: BASE_ROUTES.healthMarketplace,
      orderPrefix: "HMP-AUC-",
      orderLabel: "Device Auction",
      newDescription: "Review new auction submissions awaiting approval.",
    }),
  },
  {
    id: "digitalSolutions",
    title: "Digital Health Solutions",
    description: "Track digital solutions and app marketplace entries.",
    options: buildDualStatusLeaves({
      categoryId: "healthMarketplace",
      serviceId: "digitalSolutions",
      serviceTitle: "Digital Health Solutions",
      baseRoute: BASE_ROUTES.healthMarketplace,
      orderPrefix: "HMP-DIG-",
      orderLabel: "Digital Solution",
    }),
  },
];
const realEstateProcesses = [
  {
    id: "leasePipeline",
    title: "Lease Pipeline",
    description: "Handle new lease submissions and reviews.",
    suffix: "LEASE",
  },
  {
    id: "managementContracts",
    title: "Management Contracts",
    description: "Manage active facility management agreements.",
    suffix: "MGMT",
  },
  {
    id: "renovationPrograms",
    title: "Renovation Programs",
    description: "Supervise renovation and upgrade requests.",
    suffix: "RENO",
  },
];

const buildRealEstateProcess = (parentId: string, parentTitle: string, prefix: string): FlowNode[] =>
  realEstateProcesses.map((process) => ({
    id: `${parentId}-${process.id}`,
    title: process.title,
    description: process.description,
    options: buildDualStatusLeaves({
      categoryId: "medicalRealEstate",
      serviceId: `${parentId}-${process.id}`,
      serviceTitle: `${parentTitle} - ${process.title}`,
      baseRoute: BASE_ROUTES.medicalRealEstate,
      orderPrefix: `${prefix}${process.suffix}-`,
      orderLabel: `${parentTitle} ${process.title}`,
      newTitle: "New Submissions",
      publishTitle: "Active Contracts",
      publishDescription: "Monitor approved projects and active contracts.",
    }),
  }));

const medicalRealEstateFlow: FlowNode[] = [
  {
    id: "hospitalCampuses",
    title: "Hospital Campuses",
    description: "Manage hospital campus leasing and development.",
    icon: "/theme-icons/medical-real-estate.png",
    options: buildRealEstateProcess("hospitalCampuses", "Hospital Campuses", "REA-HC-"),
  },
  {
    id: "clinicSuites",
    title: "Clinic Suites",
    description: "Oversee clinic suite rentals and management agreements.",
    options: buildRealEstateProcess("clinicSuites", "Clinic Suites", "REA-CS-"),
  },
  {
    id: "logisticsWarehouses",
    title: "Logistics Warehouses",
    description: "Control storage and logistics facility leasing.",
    options: buildRealEstateProcess("logisticsWarehouses", "Logistics Warehouses", "REA-LW-"),
  },
];

const generalServicesFlow: FlowNode[] = [
  {
    id: "facilityMaintenance",
    title: "Facility Maintenance",
    description: "Coordinate maintenance requests and vendor approvals.",
    options: [
      buildFlowLeaf({
        id: "facilityMaintenanceOrders",
        title: "Orders",
        description: "Review incoming maintenance service requests.",
        categoryId: "general",
        serviceId: "facilityMaintenance",
        serviceTitle: "Facility Maintenance",
        optionId: "facilityMaintenanceOrders",
        optionTitle: "Orders",
        baseRoute: BASE_ROUTES.general,
        orderPrefix: "GEN-MTN-",
        orderLabel: "Maintenance Service",
      }),
    ],
  },
  {
    id: "administrativeSupport",
    title: "Administrative Support",
    description: "Handle administrative support service requests and publishing.",
    options: [
      buildFlowLeaf({
        id: "administrativeSupportOrders",
        title: "Orders",
        description: "Monitor admin support orders awaiting review.",
        categoryId: "general",
        serviceId: "administrativeSupport",
        serviceTitle: "Administrative Support",
        optionId: "administrativeSupportOrders",
        optionTitle: "Orders",
        baseRoute: BASE_ROUTES.general,
        orderPrefix: "GEN-ADM-",
        orderLabel: "Administrative Support",
      }),
    ],
  },
  {
    id: "technologyServices",
    title: "Technology Services",
    description: "Manage technology enablement service catalog.",
    options: [
      buildFlowLeaf({
        id: "technologyServicesOrders",
        title: "Orders",
        description: "Review technology service onboarding requests.",
        categoryId: "general",
        serviceId: "technologyServices",
        serviceTitle: "Technology Services",
        optionId: "technologyServicesOrders",
        optionTitle: "Orders",
        baseRoute: BASE_ROUTES.general,
        orderPrefix: "GEN-TECH-",
        orderLabel: "Technology Service",
      }),
    ],
  },
];

const foodServicesFlow: FlowNode[] = [
  {
    id: "foodOperations",
    title: "Food Operations",
    description: "Manage food service providers and caterers.",
    options: buildDualStatusLeaves({
      categoryId: "food",
      serviceId: "foodOperations",
      serviceTitle: "Food Operations",
      baseRoute: BASE_ROUTES.food,
      orderPrefix: "FOD-",
      orderLabel: "Food Service",
      newTitle: "New Requests",
    }),
  },
];

const nonMedicalServicesFlow: FlowNode[] = [
  {
    id: "logisticsSupport",
    title: "Logistics Support",
    description: "Track logistics and courier service requests.",
    options: [
      buildFlowLeaf({
        id: "logisticsSupportOrders",
        title: "Orders",
        description: "Review logistics support orders awaiting action.",
        categoryId: "nonMedical",
        serviceId: "logisticsSupport",
        serviceTitle: "Logistics Support",
        optionId: "logisticsSupportOrders",
        optionTitle: "Orders",
        baseRoute: BASE_ROUTES.nonMedical,
        orderPrefix: "NMS-LOG-",
        orderLabel: "Logistics Support",
      }),
    ],
  },
  {
    id: "facilityServices",
    title: "Facility Services",
    description: "Manage non-medical facility service requests.",
    options: [
      buildFlowLeaf({
        id: "facilityServicesOrders",
        title: "Orders",
        description: "Monitor facility service onboarding.",
        categoryId: "nonMedical",
        serviceId: "facilityServices",
        serviceTitle: "Facility Services",
        optionId: "facilityServicesOrders",
        optionTitle: "Orders",
        baseRoute: BASE_ROUTES.nonMedical,
        orderPrefix: "NMS-FAC-",
        orderLabel: "Facility Service",
      }),
    ],
  },
  {
    id: "corporateSupport",
    title: "Corporate Support",
    description: "Oversee corporate support service engagements.",
    options: [
      buildFlowLeaf({
        id: "corporateSupportOrders",
        title: "Orders",
        description: "Review corporate support service requests.",
        categoryId: "nonMedical",
        serviceId: "corporateSupport",
        serviceTitle: "Corporate Support",
        optionId: "corporateSupportOrders",
        optionTitle: "Orders",
        baseRoute: BASE_ROUTES.nonMedical,
        orderPrefix: "NMS-COR-",
        orderLabel: "Corporate Support",
      }),
    ],
  },
];
const categories: Category[] = [
  {
    id: "insurance",
    title: "Insurance Services",
    icon: "/theme-icons/insurance-service.png",
    description: "Use the Service",
    flow: insuranceFlow,
  },
  {
    id: "rental",
    title: "Rental Services",
    icon: "/theme-icons/rental-service.png",
    description: "Use the Service",
    flow: rentalFlow,
  },
  {
    id: "sell",
    title: "Sell Services",
    icon: "/theme-icons/genral-service.png",
    description: "Use the Service",
    flow: sellFlow,
  },
  {
    id: "medicalLegal",
    title: "Medical Legal Services",
    icon: "/theme-icons/genral-service.png",
    description: "Use the Service",
    flow: medicalLegalFlow,
  },
  {
    id: "medicalStaff",
    title: "Medical Staff Services",
    icon: "/theme-icons/medical-staff-services.png",
    description: "Use the Service",
    flow: medicalStaffFlow,
  },
  {
    id: "healthMarketplace",
    title: "Health Market Place Services",
    icon: "/theme-icons/genral-service.png",
    description: "Use the Service",
    flow: healthMarketplaceFlow,
  },
  {
    id: "medicalRealEstate",
    title: "Medical Real Estate Services",
    icon: "/theme-icons/medical-real-estate.png",
    description: "Use the Service",
    flow: medicalRealEstateFlow,
  },
  {
    id: "general",
    title: "General Services",
    icon: "/theme-icons/general-services.png",
    description: "Use the Service",
    flow: generalServicesFlow,
  },
  {
    id: "food",
    title: "Food Services",
    icon: "/theme-icons/genral-service.png",
    description: "Use the Service",
    flow: foodServicesFlow,
  },
  {
    id: "nonMedical",
    title: "Non Medical Services",
    icon: "/theme-icons/genral-service.png",
    description: "Use the Service",
    flow: nonMedicalServicesFlow,
  },
];
const ServiceDashboard = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id ?? "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedNodes, setSelectedNodes] = useState<FlowNode[]>([]);

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === activeCategoryId) ?? null,
    [activeCategoryId]
  );

  const currentOptions = useMemo(() => {
    if (!activeCategory?.flow?.length) {
      return [] as FlowNode[];
    }
    if (currentStepIndex === 0) {
      return activeCategory.flow;
    }
    const parentNode = selectedNodes[currentStepIndex - 1];
    return parentNode?.options ?? [];
  }, [activeCategory, currentStepIndex, selectedNodes]);

  const currentSelection = selectedNodes[currentStepIndex] ?? null;

  const modalTitle = useMemo(() => {
    if (!activeCategory) {
      return "";
    }
    if (currentStepIndex === 0) {
      return activeCategory.title;
    }
    return selectedNodes[currentStepIndex - 1]?.title ?? activeCategory.title;
  }, [activeCategory, currentStepIndex, selectedNodes]);

  const modalSubtitle = useMemo(() => {
    if (currentStepIndex === 0) {
      return "Choose the service you want to manage.";
    }
    const previous = selectedNodes[currentStepIndex - 1];
    return previous ? `Select an option within ${previous.title}.` : "Select how you want to continue.";
  }, [currentStepIndex, selectedNodes]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = categories.find((entry) => entry.id === categoryId);
    if (category?.flow?.length) {
      setActiveCategoryId(categoryId);
      setCurrentStepIndex(0);
      setSelectedNodes([]);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveCategoryId(null);
    setSelectedNodes([]);
    setCurrentStepIndex(0);
  };

  const handleNodeSelect = (node: FlowNode) => {
    setSelectedNodes((prev) => {
      const next = [...prev];
      next[currentStepIndex] = node;
      return next.slice(0, currentStepIndex + 1);
    });
  };

  const handleNextStep = () => {
    if (!currentSelection) {
      return;
    }

    if (currentSelection.options?.length) {
      setCurrentStepIndex((prev) => prev + 1);
      return;
    }

    if (currentSelection.payload) {
      const payload = currentSelection.payload;
      handleCloseModal();
      navigate(payload.baseRoute, { state: payload });
    }
  };

  const nextDisabled = !currentSelection;
  const nextLabel = currentSelection?.options?.length
    ? "Next"
    : currentSelection?.payload
    ? "View Orders"
    : "Next";

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-16">
        <section className="space-y-8 rounded-2xl border border-slate-200 bg-white px-10 py-10 shadow-card">
          <header className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-helveticaBold text-primary">Welcome to Salwa</h1>
              <p className="max-w-xl text-sm font-textMedium text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
              </p>
            </div>
            <div className="relative w-full max-w-sm">
              <input
                type="search"
                placeholder="Search here"
                className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 pl-12 text-sm text-gray-600 shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
              <span className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-primary/70">
                <img src="/theme-icons/Search ICon.svg" alt="search" className="h-5 w-5" />
              </span>
            </div>
          </header>

          <div className="space-y-4">
            <h2 className="text-lg font-helveticaBold text-primary">Service Category</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  selected={selectedCategory === category.id}
                  onClick={handleCategoryClick}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      {isModalOpen && activeCategory && (
        <ModalOverlay>
          <ModalShell title={modalTitle} subtitle={modalSubtitle} onClose={handleCloseModal}>
            <div className="space-y-6">
              {currentOptions.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {currentOptions.map((option) => (
                    <SelectableCard
                      key={option.id}
                      title={option.title}
                      description={option.description}
                      icon={option.icon ?? activeCategory.icon}
                      selected={currentSelection?.id === option.id}
                      onSelect={() => handleNodeSelect(option)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-[#f7f8fd] px-6 py-10 text-center text-sm text-gray-500">
                  No options available for the selected step.
                </div>
              )}
              <ModalFooter
                onCancel={handleCloseModal}
                onNext={handleNextStep}
                nextDisabled={nextDisabled}
                nextLabel={nextLabel}
              />
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
    <span className={clsx("grid h-12 w-12 place-items-center rounded-xl", selected ? "bg-white/15" : "bg-slate-100")}>
      <img
        src={category.icon}
        alt=""
        className={clsx("h-7 w-7", selected ? "filter brightness-0 invert" : "")}
      />
    </span>
    <div className="space-y-3">
      <p className={clsx("text-base font-helveticaBold", selected ? "text-white" : "text-primary")}>{category.title}</p>
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
        <img src={icon} alt="" className={clsx("h-10 w-10", selected ? "filter brightness-0 invert" : "")} />
      ) : (
        <span className={clsx("text-2xl font-semibold", selected ? "text-white" : "text-primary")}>?</span>
      )}
    </span>
    <div className="space-y-2">
      <p className="text-lg font-helveticaBold">{title}</p>
      <p className={clsx("text-sm text-gray-500", selected && "text-white/80")}>{description}</p>
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
  onNext,
  nextDisabled,
  nextLabel,
}: {
  onCancel: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}) => (
  <div className="flex justify-end gap-3 pt-2">
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
);

const ArrowIcon = ({ selected }: { selected: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={clsx("h-4 w-4 transition", selected ? "text-white" : "text-primary")}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export default ServiceDashboard;
