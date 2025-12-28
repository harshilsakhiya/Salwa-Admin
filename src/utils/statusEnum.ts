export const StatusEnum = {
  PENDING: 99,
  APPROVED: 100,
  REJECTED: 101,
  PUBLISHED: 102,
  EXPIRED: 103,
  FULLFILLED: 104,
  APPROVED_BY_GOVERNMENT: 105,
  CHECK_IN: 115,
  CHECK_OUT: 116,
  REJECTED_BY_GOVERNMENT: 128,
} as const;

export type StatusEnum = (typeof StatusEnum)[keyof typeof StatusEnum];

// Status helper functions
export const getStatusName = (statusId: number): string => {
  switch (statusId) {
    case StatusEnum.PENDING:
      return "Pending";
    case StatusEnum.APPROVED:
      return "Approved";
    case StatusEnum.REJECTED:
      return "Rejected";
    case StatusEnum.PUBLISHED:
      return "Published";
    case StatusEnum.EXPIRED:
      return "Expired";
    case StatusEnum.FULLFILLED:
      return "FullFilled";
    case StatusEnum.APPROVED_BY_GOVERNMENT:
      return "Approved By Government";
    case StatusEnum.CHECK_IN:
      return "Check In";
    case StatusEnum.CHECK_OUT:
      return "Check Out";
    case StatusEnum.REJECTED_BY_GOVERNMENT:
      return "Rejected by Government";
    default:
      return "Unknown";
  }
};

export const getStatusBadgeClass = (statusId: number): string => {
  switch (statusId) {
    case StatusEnum.PENDING:
      return "border border-amber-200 bg-amber-50 text-amber-700";
    case StatusEnum.APPROVED:
    case StatusEnum.APPROVED_BY_GOVERNMENT:
      return "border border-emerald-200 bg-emerald-50 text-emerald-700";
    case StatusEnum.REJECTED:
    case StatusEnum.REJECTED_BY_GOVERNMENT:
      return "border border-rose-200 bg-rose-50 text-rose-700";
    case StatusEnum.PUBLISHED:
      return "border border-blue-200 bg-blue-50 text-blue-700";
    case StatusEnum.EXPIRED:
      return "border border-gray-200 bg-gray-50 text-gray-700";
    case StatusEnum.FULLFILLED:
      return "border border-green-200 bg-green-50 text-green-700";
    case StatusEnum.CHECK_IN:
      return "border border-indigo-200 bg-indigo-50 text-indigo-700";
    case StatusEnum.CHECK_OUT:
      return "border border-purple-200 bg-purple-50 text-purple-700";
    default:
      return "border border-gray-200 bg-gray-50 text-gray-700";
  }
};

// Legacy status mapping for backward compatibility
export const getLegacyStatusName = (statusId: number): string => {
  switch (statusId) {
    case 1:
      return "Pending";
    case 2:
      return "Approved";
    case 3:
      return "Rejected";
    case 4:
      return "Published";
    default:
      return "Pending";
  }
};

export const getLegacyStatusBadgeClass = (statusId: number): string => {
  switch (statusId) {
    case 1:
      return "bg-orange-500 text-white";
    case 2:
      return "bg-green-500 text-white";
    case 3:
      return "bg-red-500 text-white";
    case 4:
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export const formatDate = (
  input: string | number | Date,
  toFormat = "display"
) => {
  if (!input) return "";

  try {
    // Convert ISO → Display (e.g. "2025-11-21T00:00:00" → "Nov 21, 2025")
    if (toFormat === "display") {
      const date = new Date(input);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    // Convert Display → ISO (e.g. "Jan 15, 2024" → "2024-01-15T00:00:00")
    if (toFormat === "iso") {
      const date = new Date(input);
      return date.toISOString().split(".")[0];
    }

    return "";
  } catch (error) {
    console.error("Invalid date:", input, error);
    return "";
  }
};

export const YesNoEnum = [
  { label: "Yes", value: 1 },
  { label: "No", value: 0 },
];
