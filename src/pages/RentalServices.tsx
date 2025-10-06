/* eslint-disable react-refresh/only-export-components */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  ModalOverlay,
  RejectReasonModal,
  StatusSuccessModal,
} from "../components/rentalServices/Modals";

export type Status = "Pending" | "Approved" | "Rejected" | "Published";

export interface OrderRecord {
  id: number;
  orderNo: string;
  orderTitle: string;
  deviceName: string;
  fdaNumber: string;
  deviceType: string;
  approvalNumber: string;
  date: string;
  country: string;
  region: string;
  city: string;
  status: Status;
}

export interface RentalServicesState {
  categoryId: string | null;
  serviceId: string;
  serviceTitle: string;
  optionId: string;
  optionTitle: string;
  baseRoute: string;
  items: OrderRecord[];
}

export interface RentalServiceDetailState {
  order: OrderRecord;
  gallery: string[];
  secondaryImages: string[];
  address: string;
  city: string;
  country: string;
  daysRemaining: number;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  keyDetailsLeft: Array<{ label: string; value: string }>;
  keyDetailsRight: Array<{ label: string; value: string }>;
  terms: string;
  damageNotes: string;
  mapNote: string;
}

export const StatusActionLabel = {
  approve: "Approve",
  reject: "Reject",
  publish: "Publish",
  markPending: "Mark Pending",
  reopen: "Reopen",
};

export const STATUS_BADGE_CLASSES: Record<Status, string> = {
  Pending: "border border-amber-200 bg-amber-50 text-amber-700",
  Approved: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border border-rose-200 bg-rose-50 text-rose-700",
  Published: "border border-blue-200 bg-blue-50 text-blue-700",
};

export const PRIMARY_ACTION_CLASSES =
  "rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white shadow transition hover:bg-[#030447]";
export const OUTLINE_ACTION_CLASSES =
  "rounded-full border border-primary/40 px-4 py-1 text-xs font-semibold text-primary transition hover:border-primary";
export const DANGER_ACTION_CLASSES =
  "rounded-full border border-rose-400 px-4 py-1 text-xs font-semibold text-rose-600 transition hover:border-rose-500 hover:text-rose-700";

const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1280&q=80",
  "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=1280&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1280&q=80",
];

const DEFAULT_SECONDARY = [
  "https://images.unsplash.com/photo-1576765973412-3f7bc60f3f58?auto=format&fit=crop&w=480&q=80",
  "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=480&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=480&q=80",
  "https://images.unsplash.com/photo-1527368912707-85145e43e9ff?auto=format&fit=crop&w=480&q=80",
];

const defaultOrders: OrderRecord[] = [
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
    deviceName: "Dr�ger Evita",
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

const buildDefaultState = (): RentalServicesState => ({
  categoryId: "rental",
  serviceId: "rent-medical-equipment",
  serviceTitle: "Rent Medical Equipment and Facilities",
  optionId: "rent-medical-equipment-orders",
  optionTitle: "Orders",
  baseRoute: "/service-dashboard/rental-services",
  items: defaultOrders,
});

const createDetailPayload = (order: OrderRecord): RentalServiceDetailState => ({
  order,
  gallery: DEFAULT_GALLERY,
  secondaryImages: DEFAULT_SECONDARY,
  address: "123 Healthcare Avenue",
  city: order.city,
  country: order.country,
  daysRemaining: 30,
  contactPerson: "Kings Medical Hospital",
  contactEmail: "care@kingshospital.sa",
  contactPhone: "+966 11 234 5678",
  keyDetailsLeft: [
    { label: "Contact Person Name", value: "Dr. Salma Abdullah" },
    { label: "Choose Order Post Validity Time", value: "30 Days" },
    { label: "Order Title", value: order.orderTitle },
    { label: "Device / Service Type", value: order.deviceType },
    { label: "Post Validity Time", value: "90 Days" },
    { label: "Rent Value", value: "SAR 250,000" },
    { label: "Rent Period", value: "6 Months" },
  ],
  keyDetailsRight: [
    { label: "Contact Person Email", value: "procurement@kingshospital.sa" },
    { label: "Device Name", value: order.deviceName },
    { label: "FDA Number", value: order.fdaNumber },
    { label: "Device Approval Number", value: order.approvalNumber },
    { label: "Security Deposit", value: "SAR 50,000" },
    { label: "Maintenance", value: "Included" },
  ],
  terms:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  damageNotes:
    "Any damaged equipment must be reported within 24 hours to avoid additional charges. Regular maintenance is provided by the vendor.",
  mapNote: "Riyadh Medical Center, 123 Healthcare Avenue, Riyadh, RD 10001",
});

const RentalServices = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = location.state as RentalServicesState | undefined;

  const effectiveState = useMemo<RentalServicesState>(
    () =>
      navigationState && navigationState.items?.length
        ? navigationState
        : buildDefaultState(),
    [navigationState]
  );

  const baseRoute =
    effectiveState.baseRoute || "/service-dashboard/rental-services";

  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    effectiveState.items.map((item, index) => ({ ...item, id: index + 1 }))
  );

  const [rejectModal, setRejectModal] = useState<{
    order: OrderRecord;
    reason: string;
  } | null>(null);

  const [successModal, setSuccessModal] = useState<{
    order: OrderRecord;
    status: Extract<Status, "Approved" | "Published">;
    actionDate: string;
  } | null>(null);

  useEffect(() => {
    setOrders(
      effectiveState.items.map((item, index) => ({ ...item, id: index + 1 }))
    );
  }, [effectiveState]);

  const totals = useMemo(() => {
    const approved = orders.filter(
      (order) => order.status === "Approved"
    ).length;
    const rejected = orders.filter(
      (order) => order.status === "Rejected"
    ).length;
    const total = orders.length;
    return { approved, rejected, total };
  }, [orders]);

  const updateOrderStatus = (orderId: number, nextStatus: Status) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === orderId ? { ...item, status: nextStatus } : item
      )
    );
  };

  const handleStatusUpdate = (order: OrderRecord, nextStatus: Status) => {
    const updatedOrder = { ...order, status: nextStatus };
    updateOrderStatus(order.id, nextStatus);

    if (nextStatus === "Approved" || nextStatus === "Published") {
      setSuccessModal({
        order: updatedOrder,
        status: nextStatus,
        actionDate: new Date().toISOString(),
      });
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectModal) {
      return;
    }
    const reason = rejectModal.reason.trim();
    if (!reason) {
      return;
    }

    const updatedOrder = { ...rejectModal.order, status: "Rejected" as Status };
    updateOrderStatus(rejectModal.order.id, "Rejected");
    setRejectModal(null);

    navigate(`${baseRoute}/notifications`, {
      state: {
        order: updatedOrder,
        reason,
        timestamp: new Date().toISOString(),
      },
    });
  };

  const handleRejectClick = (order: OrderRecord) => {
    setRejectModal({ order, reason: "" });
  };

  const handleApproveClick = (order: OrderRecord) => {
    handleStatusUpdate(order, "Approved");
  };

  const handlePublishClick = (order: OrderRecord) => {
    handleStatusUpdate(order, "Published");
  };

  const handleMarkPending = (order: OrderRecord) => {
    updateOrderStatus(order.id, "Pending");
  };

  const handleReopen = (order: OrderRecord) => {
    updateOrderStatus(order.id, "Pending");
  };

  const handleViewOrder = (order: OrderRecord) => {
    const detailPayload = createDetailPayload(order);
    navigate(`${baseRoute}/${order.id}`, {
      state: detailPayload,
    });
  };

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full  flex-col gap-8 pb-3">
        <section className="space-y-8 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-helveticaBold text-primary">
                {effectiveState.serviceTitle}
              </h1>
              <p className="text-sm text-gray-500">
                {effectiveState.optionTitle}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full border border-gray-200 px-6 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
              <button className="rounded-full bg-primary px-8 py-2 text-sm font-semibold text-white shadow hover:bg-[#030447]">
                Export
              </button>
            </div>
          </header>

          <StatsRow totals={totals} />

          <ChartPlaceholder />

          <OrdersTable
            orders={orders}
            onReject={handleRejectClick}
            onApprove={handleApproveClick}
            onPublish={handlePublishClick}
            onMarkPending={handleMarkPending}
            onReopen={handleReopen}
            onView={handleViewOrder}
          />
        </section>
      </div>

      {rejectModal && (
        <ModalOverlay>
          <RejectReasonModal
            reason={rejectModal.reason}
            orderTitle={`${rejectModal.order.orderTitle} (${rejectModal.order.orderNo})`}
            onReasonChange={(value) =>
              setRejectModal((prev) =>
                prev ? { ...prev, reason: value } : prev
              )
            }
            onCancel={() => setRejectModal(null)}
            onSubmit={handleRejectSubmit}
          />
        </ModalOverlay>
      )}

      {successModal && (
        <ModalOverlay>
          <StatusSuccessModal
            orderNo={successModal.order.orderNo}
            orderTitle={successModal.order.orderTitle}
            status={successModal.status}
            actionDate={successModal.actionDate}
            onClose={() => setSuccessModal(null)}
          />
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};

const StatsRow = ({
  totals,
}: {
  totals: { approved: number; rejected: number; total: number };
}) => (
  <div className="grid gap-4 sm:grid-cols-3">
    <StatCard label="Total Approved" value={totals.approved} />
    <StatCard label="Total Rejected" value={totals.rejected} />
    <StatCard label="Total Orders" value={totals.total} />
  </div>
);

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-[28px] border border-gray-200 bg-[#f7f8fd] px-6 py-8 text-center shadow-[0_20px_40px_rgba(5,6,104,0.08)]">
    <p className="text-4xl font-semibold text-primary">{value}</p>
    <p className="mt-2 text-sm text-gray-500">{label}</p>
  </div>
);

const ChartPlaceholder = () => (
  <div className="rounded-[28px] border border-gray-200 bg-[#f6f7fb] px-6 py-10 text-center text-sm text-gray-500">
    Analytics chart placeholder
  </div>
);

const OrdersTable = ({
  orders,
  onReject,
  onApprove,
  onPublish,
  onMarkPending,
  onReopen,
  onView,
}: {
  orders: OrderRecord[];
  onReject: (order: OrderRecord) => void;
  onApprove: (order: OrderRecord) => void;
  onPublish: (order: OrderRecord) => void;
  onMarkPending: (order: OrderRecord) => void;
  onReopen: (order: OrderRecord) => void;
  onView: (order: OrderRecord) => void;
}) => (
  <div className="overflow-hidden rounded-[28px] border border-gray-200">
    <div className="overflow-x-auto">
      <table className="min-w-[1200px] w-full text-left text-sm text-gray-600">
        <thead className="bg-[#f6f7fb] text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
          <tr>
            <th className="px-6 py-4">Order No</th>
            <th className="px-6 py-4">Order Title</th>
            <th className="px-6 py-4">Device Name</th>
            <th className="px-6 py-4">FDA Number</th>
            <th className="px-6 py-4">Device Type</th>
            <th className="px-6 py-4">Device Approval Number</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Country</th>
            <th className="px-6 py-4">Region</th>
            <th className="px-6 py-4">City</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 font-semibold text-primary">
                {order.orderNo}
              </td>
              <td className="px-6 py-4 text-gray-700">{order.orderTitle}</td>
              <td className="px-6 py-4 text-gray-500">{order.deviceName}</td>
              <td className="px-6 py-4 text-gray-500">{order.fdaNumber}</td>
              <td className="px-6 py-4 text-gray-500">{order.deviceType}</td>
              <td className="px-6 py-4 text-gray-500">
                {order.approvalNumber}
              </td>
              <td className="px-6 py-4 text-gray-500">{order.date}</td>
              <td className="px-6 py-4 text-gray-500">{order.country}</td>
              <td className="px-6 py-4 text-gray-500">{order.region}</td>
              <td className="px-6 py-4 text-gray-500">{order.city}</td>
              <td className="px-6 py-4">
                <span
                  className={clsx(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                    STATUS_BADGE_CLASSES[order.status]
                  )}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <IconButton label="View order" onClick={() => onView(order)}>
                    <EyeIcon />
                  </IconButton>
                  {order.status === "Pending" && (
                    <>
                      <ActionButton
                        label={StatusActionLabel.approve}
                        className={PRIMARY_ACTION_CLASSES}
                        onClick={() => onApprove(order)}
                      />
                      <ActionButton
                        label={StatusActionLabel.reject}
                        className={DANGER_ACTION_CLASSES}
                        onClick={() => onReject(order)}
                      />
                    </>
                  )}
                  {order.status === "Approved" && (
                    <>
                      <ActionButton
                        label={StatusActionLabel.publish}
                        className={PRIMARY_ACTION_CLASSES}
                        onClick={() => onPublish(order)}
                      />
                      <ActionButton
                        label={StatusActionLabel.markPending}
                        className={OUTLINE_ACTION_CLASSES}
                        onClick={() => onMarkPending(order)}
                      />
                    </>
                  )}
                  {order.status === "Rejected" && (
                    <ActionButton
                      label={StatusActionLabel.reopen}
                      className={OUTLINE_ACTION_CLASSES}
                      onClick={() => onReopen(order)}
                    />
                  )}
                  {order.status === "Published" && (
                    <span className="text-xs text-gray-500">Published</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ActionButton = ({
  label,
  className,
  onClick,
}: {
  label: string;
  className: string;
  onClick: () => void;
}) => (
  <button type="button" className={className} onClick={onClick}>
    {label}
  </button>
);

const IconButton = ({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    aria-label={label}
    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-primary hover:text-primary"
    onClick={onClick}
  >
    {children}
  </button>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M1.5 12s3.5-7 10.5-7 10.5 7 10.5 7-3.5 7-10.5 7-10.5-7-10.5-7Z"
    />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

export default RentalServices;
