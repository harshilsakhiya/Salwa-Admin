import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { ModalOverlay, RejectReasonModal, StatusSuccessModal } from "../components/rentalServices/Modals";
import type { OrderRecord, Status } from "./RentalServices";

type NotificationStatus = Extract<Status, "Approved" | "Published" | "Rejected">;

interface NotificationRecord {
  id: string;
  orderNo: string;
  orderTitle: string;
  status: NotificationStatus;
  timestamp: string;
  reason?: string;
}

interface NavigationState {
  order?: OrderRecord;
  reason?: string;
  timestamp?: string;
  serviceTitle?: string;
  optionTitle?: string;
  baseRoute?: string;
}

const STATUS_COPY: Record<NotificationStatus, { verb: string; cta: string }> = {
  Approved: { verb: "accepted", cta: "to review the order." },
  Published: { verb: "published", cta: "to review the published order." },
  Rejected: { verb: "rejected", cta: "for further details." },
};

const STATUS_BADGE_STYLES: Record<NotificationStatus, string> = {
  Approved: "bg-emerald-50 text-emerald-600",
  Published: "bg-blue-50 text-blue-600",
  Rejected: "bg-rose-50 text-rose-600",
};

const DEFAULT_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: "n-003",
    orderNo: "#0046",
    orderTitle: "Medical Yearly Contracts",
    status: "Rejected",
    timestamp: new Date("2025-09-30T07:35:00Z").toISOString(),
    reason:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi et dolore magni ipsa tenetur omnis iusto, minus?",
  },
  {
    id: "n-002",
    orderNo: "#0033",
    orderTitle: "MRI Machine Lease",
    status: "Approved",
    timestamp: new Date("2025-09-29T14:22:00Z").toISOString(),
  },
  {
    id: "n-001",
    orderNo: "#0047",
    orderTitle: "Portable X-Ray Fleet",
    status: "Published",
    timestamp: new Date("2025-09-28T09:10:00Z").toISOString(),
  },
];

const RentalServiceNotifications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = location.state as NavigationState | undefined;

  const baseRoute = navigationState?.baseRoute ?? "/service-dashboard/rental-services";
  const headingTitle = navigationState?.serviceTitle ?? "Notifications";
  const headingSubtitle = navigationState?.optionTitle
    ? `Check the latest updates for ${navigationState.optionTitle}.`
    : "Check the latest updates and order actions";

  const [searchTerm, setSearchTerm] = useState("");
  const [activeNotification, setActiveNotification] = useState<NotificationRecord | null>(null);

  const initialNotifications = useMemo(() => {
    if (navigationState?.order && navigationState.order.status !== "Pending") {
      const status = navigationState.order.status as NotificationStatus;
      const timestamp = navigationState.timestamp ?? new Date().toISOString();

      return [
        {
          id: `incoming-${navigationState.order.id}`,
          orderNo: navigationState.order.orderNo,
          orderTitle: navigationState.order.orderTitle,
          status,
          timestamp,
          reason: navigationState.reason,
        },
        ...DEFAULT_NOTIFICATIONS,
      ];
    }
    return DEFAULT_NOTIFICATIONS;
  }, [navigationState]);

  const [notifications] = useState<NotificationRecord[]>(initialNotifications);

  useEffect(() => {
    if (navigationState) {
      navigate(".", { replace: true, state: null });
    }
  }, [navigate, navigationState]);

  const filteredNotifications = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return notifications;
    }
    return notifications.filter((item) => {
      const haystack = `${item.orderNo} ${item.orderTitle} ${item.status}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [notifications, searchTerm]);

  const handleOpenNotification = (notification: NotificationRecord) => {
    setActiveNotification(notification);
  };

  const handleCloseModal = () => {
    setActiveNotification(null);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full  flex-col gap-8 pb-3">
        <section className="space-y-8 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-[#030447]"
              onClick={() => navigate(baseRoute)}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
                </svg>
              </span>
              Back to Service Category
            </button>
            <div className="text-right text-xs uppercase tracking-[0.28em] text-gray-400">
              <p>Service Category</p>
              <p className="text-primary">All Services</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-helveticaBold text-primary">{headingTitle}</h1>
              <p className="text-sm text-gray-500">{headingSubtitle}</p>
            </div>
            <div className="relative w-full max-w-xs">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search notifications"
                className="w-full rounded-full border border-gray-200 bg-[#f7f8fd] px-10 py-2 text-sm text-gray-600 shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
                  <circle cx="11" cy="11" r="6" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 20l-2.6-2.6" />
                </svg>
              </span>
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-200">
            {filteredNotifications.length > 0 ? (
              <NotificationTable notifications={filteredNotifications} onOpen={handleOpenNotification} />
            ) : (
              <div className="px-6 py-16 text-center text-sm text-gray-500">
                No notifications match your search.
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 px-6 py-4 text-xs text-gray-400">
              <p>
                Showing data 1 to {filteredNotifications.length} of {notifications.length} entries
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-400 transition hover:border-primary hover:text-primary"
                  disabled
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-400 transition hover:border-primary hover:text-primary"
                  disabled
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {activeNotification && (
        <ModalOverlay>
          {activeNotification.status === "Rejected" ? (
            <RejectReasonModal
              reason={activeNotification.reason ?? "No reason provided."}
              orderTitle={`${activeNotification.orderTitle} (${activeNotification.orderNo})`}
              mode="view"
              onCancel={handleCloseModal}
            />
          ) : (
            <StatusSuccessModal
              orderNo={activeNotification.orderNo}
              orderTitle={activeNotification.orderTitle}
              status={activeNotification.status}
              actionDate={activeNotification.timestamp}
              onClose={handleCloseModal}
            />
          )}
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};

const NotificationTable = ({
  notifications,
  onOpen,
}: {
  notifications: NotificationRecord[];
  onOpen: (notification: NotificationRecord) => void;
}) => (
  <div className="overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full text-left text-sm text-gray-600">
        <thead className="bg-[#f6f7fb] text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
          <tr>
            <th className="px-6 py-4">Messages</th>
            <th className="px-6 py-4">Date &amp; Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {notifications.map((notification) => (
            <tr key={notification.id}>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-[#f7f8fd] px-3 py-1 font-semibold text-primary">
                      {notification.orderNo}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 font-semibold ${STATUS_BADGE_STYLES[notification.status]}`}
                    >
                      {notification.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your <span className="font-semibold text-primary">{notification.orderTitle}</span> order has been {STATUS_COPY[notification.status].verb}.{' '}
                    <button
                      type="button"
                      className="font-semibold text-primary underline underline-offset-4"
                      onClick={() => onOpen(notification)}
                    >
                      CLICK HERE
                    </button>{' '}
                    {STATUS_COPY[notification.status].cta}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{formatDateTime(notification.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const formatDateTime = (isoString: string) => {
  const value = new Date(isoString);
  const now = new Date();
  const todayLabel = value.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayLabel = value.toDateString() === yesterday.toDateString();

  const dateLabel = todayLabel
    ? "Today"
    : yesterdayLabel
      ? "Yesterday"
      : value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const timeLabel = value.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${dateLabel}, ${timeLabel}`;
};

export default RentalServiceNotifications;
