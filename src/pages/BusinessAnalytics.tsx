// BusinessAnalytics.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ReactNode,
} from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import ComanTable, {
  type TableColumn,
  type ActionButton,
  type SortState,
} from "../components/common/ComanTable";
import {
  exportBusinessIdeaPartners,
  getIndividualIdeaPartnerById,
  UpsertIndividualIdeaPartnerUserComment,
  UpsertIndividualIdeaPartnerUserCommentsReaction,
} from "../services/BusinessAnalyticsService";

/* ---------------------------
   Types & endpoints
   --------------------------- */

type ActiveTab = "registration" | "services"; // keep internal values (no change to API)
// type TabToType = { readonly registration: 1; readonly services: 2 };
// const TAB_TO_TYPE: TabToType = { registration: 1, services: 2 };

interface IdeaPartner {
  ideaPartnerId: number;
  userId: number;
  userType?: number | null;
  ideaName?: string | null;
  businessName?: string | null;
  isRegistered?: boolean | null;
  registrationDate?: string | null;
  ideaDescription?: string | null;
  mediaFilePath?: string | null;
  isActive?: boolean | null;
  statusId?: number | null;
  createdDate?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  district?: string | null;
  email?: string | null;
  phone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  nationalAddress?: string | null;
  comments?: any[];
}

type UserTypeOption = { id: number; label: string };

const LIST_ENDPOINT =
  "https://apisalwa.rushkarprojects.in/api/SupportTickets/GetAllBusinessIdeaPartner";

/* ---------------------------
   Helpers
   --------------------------- */

const parseResponse = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const messageFromPayload = (payload: unknown, fallback: string) => {
  if (typeof payload === "string" && payload.trim()) return payload;
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
};

const extractList = (payload: unknown): IdeaPartner[] => {
  if (Array.isArray(payload)) return payload as IdeaPartner[];
  if (payload && typeof payload === "object" && "data" in payload) {
    const { data } = payload as { data?: unknown };
    if (Array.isArray(data)) return data as IdeaPartner[];
  }
  return [];
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const padId = (id: number) => `#${String(id).padStart(4, "0")}`;

const mapStatus = (statusId?: number | null) => {
  switch (statusId) {
    case 98:
      return { label: "Pending", colorClass: "bg-[#fff3d9] text-[#b46a02]" };
    case 99:
      return { label: "Approved", colorClass: "bg-[#e9fbf3] text-[#0f7b4d]" };
    case 100:
      return { label: "Reject", colorClass: "bg-[#ffe6e6] text-[#c03636]" };
    case 101:
      return { label: "Developed", colorClass: "bg-[#eef2ff] text-[#3730a3]" };
    default:
      return {
        label: statusId != null ? String(statusId) : "-",
        colorClass: "bg-gray-100 text-gray-700",
      };
  }
};

/* ---------------------------
   Component
   --------------------------- */

const DEFAULT_USER_TYPES: UserTypeOption[] = [
  { id: 1, label: "Individual" },
  { id: 2, label: "Business" },
  { id: 3, label: "Government" },
];

const BusinessAnalytics = () => {
  const { authFetch } = useAuth();
  const { showToast } = useToast();

  // UI state (matching PromocodeSettings structure)
  const [activeTab, setActiveTab] = useState<ActiveTab>("registration");
  const [searchTerm, setSearchTerm] = useState("");

  const [items, setItems] = useState<IdeaPartner[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const [, setUserTypeOptions] =
    useState<UserTypeOption[]>(DEFAULT_USER_TYPES);

  // form modal controls retained to keep same UI; Add/Edit are placeholders for now
  // const [isFormOpen, setIsFormOpen] = useState(false);
  // const [formLoading, setFormLoading] = useState(false);
  // const [formSubmitting, setFormSubmitting] = useState(false);

  // status/delete placeholders
  const [statusTarget, setStatusTarget] = useState<{
    ideaPartnerId: number;
    currentStatus: boolean;
    tab?: ActiveTab;
  } | null>(null);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    ideaPartnerId: number;
  } | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortState, setSortState] = useState<SortState[]>([]);

  // Add chat board state and handlers (fixes runtime error)
  const [openReactionFor, setOpenReactionFor] = useState<number | null>(null);
  const [openAllFor, setOpenAllFor] = useState<number | null>(null);
  const [sendingReaction, setSendingReaction] = useState(false);

  // Emoji lists
  const EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];
  const ALL_EMOJIS = [
    "👍","👎","❤️","💔","😂","😅","😊","😮","😲","😢","😭","😡","👏","🙌","🤝","🎉","🔥","⭐","💯","➕"
  ];

  // Chat message sending state
  const [sendingChat, setSendingChat] = useState(false);

  // Handler for sending chat message (now calls API with required schema)
  const handleSendChatMessage = async () => {
    if (sendingChat || searchTerm.trim() === "" || !viewTarget) return;
    setSendingChat(true);
    try {
      const payload = {
        id: 0,
        ideaPartnerId: viewTarget.ideaPartnerId,
        fromId: 1, // adapt to actual current user id if available
        toId: viewTarget.userId ?? 0,
        commentType: 1,
        comment: searchTerm,
        commentURL: "",
      };
      const res = await UpsertIndividualIdeaPartnerUserComment(payload);
      const created = res && (res.data ?? res) ? (res.data ?? res) : null;

      setViewTarget((prev) => {
        if (!prev) return prev;
        const newComment = created && typeof created === "object"
          ? created
          : {
              comment: searchTerm,
              createdDate: new Date().toISOString(),
              fromId: payload.fromId,
              reactions: [],
            };
        const updatedComments = Array.isArray(prev.comments)
          ? [...prev.comments, newComment]
          : [newComment];
        return { ...prev, comments: updatedComments };
      });

      setSearchTerm("");
    } catch (err) {
      // fallback: append locally
      setViewTarget((prev) => {
        if (!prev) return prev;
        const newComment = {
          comment: searchTerm,
          createdDate: new Date().toISOString(),
          fromId: 1,
          reactions: [],
        };
        const updatedComments = Array.isArray(prev.comments)
          ? [...prev.comments, newComment]
          : [newComment];
        return { ...prev, comments: updatedComments };
      });
      setSearchTerm("");
    } finally {
      setSendingChat(false);
    }
  };

  // Helper: robust date formatting for comments/reactions
  const formatCommentDate = (c: any) => {
    if (!c) return "";
    const raw =
      c.createdDate ??
      c.createdOn ??
      c.createdAt ??
      c.createdUtc ??
      c.date ??
      c.createdOnDate ??
      c.CreatedDate ??
      null;
    if (!raw) return "";
    let d: Date | null = null;
    if (raw instanceof Date) d = raw;
    else if (typeof raw === "number") d = new Date(raw);
    else if (typeof raw === "string") {
      const iso = Date.parse(raw);
      if (!isNaN(iso)) d = new Date(iso);
      else d = new Date(raw);
    }
    if (d && !isNaN(d.getTime())) {
      return formatDate(d.toISOString());
    }
    return raw;
  };

  // Send reply in detail view (use same API shape)
  const handleSendReply = async () => {
    if (!viewTarget || sendingChat || !searchTerm.trim()) return;
    setSendingChat(true);
    try {
      const payload = {
        id: 0,
        ideaPartnerId: viewTarget.ideaPartnerId,
        fromId: 1,
        toId: viewTarget.userId ?? 0,
        commentType: 1,
        comment: searchTerm,
        commentURL: "",
      };
      const res = await UpsertIndividualIdeaPartnerUserComment(payload);
      const created = res && (res.data ?? res) ? (res.data ?? res) : null;

      setViewTarget((prev) => {
        if (!prev) return prev;
        const newComment = created && typeof created === "object"
          ? created
          : {
              comment: searchTerm,
              createdDate: new Date().toISOString(),
              fromId: payload.fromId,
              reactions: [],
            };
        const updatedComments = Array.isArray(prev.comments)
          ? [...prev.comments, newComment]
          : [newComment];
        return { ...prev, comments: updatedComments };
      });

      setSearchTerm("");
    } catch {
      // fallback local append
      setViewTarget((prev) => {
        if (!prev) return prev;
        const newComment = {
          comment: searchTerm,
          createdDate: new Date().toISOString(),
          fromId: 1,
          reactions: [],
        };
        const updatedComments = Array.isArray(prev.comments)
          ? [...prev.comments, newComment]
          : [newComment];
        return { ...prev, comments: updatedComments };
      });
      setSearchTerm("");
    } finally {
      setSendingChat(false);
    }
  };

  // Toggle emoji reaction for a comment in detail view (calls API)
  const handleSendReaction = async (commentIndex: number, emoji: string) => {
    if (!viewTarget || !Array.isArray(viewTarget.comments)) return;
    setSendingReaction(true);
    try {
      const comment = viewTarget.comments[commentIndex];
      const commentId =
        comment?.commentId ?? comment?.id ?? comment?.commentID ?? null;
      if (!commentId) {
        // No server id; cannot persist reaction — toggle locally
        setViewTarget((prev) => {
          if (!prev) return prev;
          const comments = [...(prev.comments ?? [])];
          const target = { ...(comments[commentIndex] ?? {}) };
          const existing = Array.isArray(target.reactions) ? [...target.reactions] : [];
          const idx = existing.findIndex((r: any) => (r.emojiCode ?? r.emoji ?? r) === emoji);
          if (idx >= 0) existing.splice(idx, 1);
          else existing.push({ emojiCode: emoji });
          target.reactions = existing;
          comments[commentIndex] = target;
          return { ...prev, comments };
        });
        return;
      }

      // call API to upsert reaction
      const payload = { id: 0, commentId, emojiCode: emoji };
      const res = await UpsertIndividualIdeaPartnerUserCommentsReaction(payload);
      const resp = res && (res.data ?? res) ? (res.data ?? res) : null;

      setViewTarget((prev) => {
        if (!prev) return prev;
        const comments = [...(prev.comments ?? [])];
        const target = { ...(comments[commentIndex] ?? {}) };

        // try to extract updated reactions from response
        const updatedReactions =
          resp?.reactions ?? resp?.Reactions ?? resp?.reactionsList ?? null;

        if (updatedReactions && Array.isArray(updatedReactions)) {
          target.reactions = updatedReactions;
        } else {
          // fallback: toggle locally
          const existing = Array.isArray(target.reactions) ? [...target.reactions] : [];
          const idx = existing.findIndex((r: any) => (r.emojiCode ?? r.emoji ?? r) === emoji);
          if (idx >= 0) existing.splice(idx, 1);
          else existing.push({ emojiCode: emoji });
          target.reactions = existing;
        }

        comments[commentIndex] = target;
        return { ...prev, comments };
      });
    } catch (err) {
      // on error toggle locally as fallback
      setViewTarget((prev) => {
        if (!prev) return prev;
        const comments = [...(prev.comments ?? [])];
        const target = { ...(comments[commentIndex] ?? {}) };
        const existing = Array.isArray(target.reactions) ? [...target.reactions] : [];
        const idx = existing.findIndex((r: any) => (r.emojiCode ?? r.emoji ?? r) === emoji);
        if (idx >= 0) existing.splice(idx, 1);
        else existing.push({ emojiCode: emoji });
        target.reactions = existing;
        comments[commentIndex] = target;
        return { ...prev, comments };
      });
    } finally {
      setSendingReaction(false);
      setOpenReactionFor(null);
      setOpenAllFor(null);
    }
  };

  /* Data loader */
  const loadItems = useCallback(
    async (
      tab: ActiveTab,
      page: number = pageNumber,
      size: number = pageSize
    ) => {
      setListLoading(true);
      setListError(null);
      try {
        const url = `${LIST_ENDPOINT}?pageNumber=${page}&pageSize=${size}`;
        const response = await authFetch(url, {
          method: "GET",
          headers: { accept: "application/json" },
        });

        const payload = await parseResponse(response);
        if (!response.ok) {
          throw new Error(messageFromPayload(payload, "Unable to load data."));
        }

        const data = extractList(payload);
        const total =
          typeof (payload && (payload as any).totalRecords) === "number"
            ? (payload as any).totalRecords
            : data.length;

        setItems(data);
        setUserTypeOptions((prev) => {
          const map = new Map(prev.map((o) => [o.id, o]));
          data.forEach((it) => {
            if (typeof it.userType === "number" && !map.has(it.userType)) {
              map.set(it.userType, {
                id: it.userType,
                label: `Type ${it.userType}`,
              });
            }
          });
          return Array.from(map.values());
        });

        setTotalCount(total);
        setTotalPages(Math.max(1, Math.ceil(total / size)));
        setPageNumber(page);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load data.";
        setItems([]);
        setListError(message);
        showToast(message, "error");
      } finally {
        setListLoading(false);
      }
    },
    [authFetch, pageNumber, pageSize, showToast]
  );

  useEffect(() => {
    void loadItems(activeTab);
  }, [activeTab, loadItems]);

  /* Search & filter */
  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;
    return items.filter((it) => {
      const haystack = [
        it.ideaName,
        it.businessName,
        it.ideaDescription,
        String(it.userId),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [items, searchTerm]);

  /* Table columns (same visual layout as promotions) */
  const tableColumns: TableColumn<IdeaPartner>[] = useMemo(
    () => [
      {
        label: "Sr No",
        value: (row) => {
          const idx = filteredItems.findIndex(
            (it) => it.ideaPartnerId === row.ideaPartnerId
          );
          const display =
            idx >= 0 ? padId((pageNumber - 1) * pageSize + idx + 1) : "-";
          return <span className="font-semibold text-primary">{display}</span>;
        },
        sortKey: "ideaPartnerId",
        isSort: true,
      },
      {
        label: "Individual Partner Name",
        value: (row) => (
          <span className="text-gray-700">
            {row.businessName ?? `User #${row.userId}`}
          </span>
        ),
        sortKey: "businessName",
        isSort: true,
      },
      {
        label: "Email",
        value: () => <span className="text-gray-500">-</span>,
        sortKey: "email",
        isSort: true,
      },
      {
        label: "Phone number",
        value: () => <span className="text-gray-500">-</span>,
        sortKey: "phone",
        isSort: true,
      },
      {
        label: "Country",
        value: (row) => (
          <span className="text-gray-500">{row.country ?? "-"}</span>
        ),
        sortKey: "country",
        isSort: true,
      },
      {
        label: "Region",
        value: (row) => (
          <span className="text-gray-500">{row.region ?? "-"}</span>
        ),
        sortKey: "region",
        isSort: true,
      },
      {
        label: "City",
        value: (row) => (
          <span className="text-gray-500">{row.city ?? "-"}</span>
        ),
        sortKey: "city",
        isSort: true,
      },
      {
        label: "District",
        value: (row) => (
          <span className="text-gray-500">{row.district ?? "-"}</span>
        ),
        sortKey: "district",
        isSort: true,
      },
      {
        label: "Idea Name",
        value: (row) => (
          <span className="text-gray-500">{row.ideaName ?? "-"}</span>
        ),
        sortKey: "ideaName",
        isSort: true,
      },
      {
        label: "Status",
        value: (row) => {
          const s = mapStatus(row.statusId);
          return (
            <button
              type="button"
              className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer border border-transparent hover:border-current ${s.colorClass}`}
              title={`Status: ${s.label}`}
            >
              {s.label}
            </button>
          );
        },
        sortKey: "statusId",
        isSort: true,
      },
    ],
    [pageNumber, pageSize, filteredItems]
  );

  /* Actions (View + Delete placeholders) */
  const [viewTarget, setViewTarget] = useState<IdeaPartner | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const actionButtons: ActionButton<IdeaPartner>[] = useMemo(
    () => [
      {
        label: "View",
        iconType: "view",
        onClick: async (row) => {
          setViewLoading(true);
          try {
            const detail = await getIndividualIdeaPartnerById(row.ideaPartnerId);
            // Support response shaped as { data: {...} } or direct object
            const payload = detail && (detail.data ?? detail);
            if (payload) {
              setViewTarget(payload);
              // ensure detail area is visible
              setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
            } else {
              setViewTarget(null);
            }
          } finally {
            setViewLoading(false);
          }
        },
      },
      {
        label: "Delete",
        iconType: "delete",
        onClick: (row) => setDeleteTarget({ ideaPartnerId: row.ideaPartnerId }),
      },
    ],
    []
  );

  /* Pagination handlers */
  const handlePageChange = (page: number) => {
    setPageNumber(page);
    void loadItems(activeTab, page, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageNumber(1);
    void loadItems(activeTab, 1, size);
  };

  const handleSortChange = (newSortState: SortState[]) => {
    setSortState(newSortState);
  };

  /* Confirm Delete placeholder */
  const handleConfirmDelete = async () => {
    if (!deleteTarget || deleteSubmitting) return;
    setDeleteSubmitting(true);
    try {
      showToast(
        "Delete endpoint not provided. Implement server API to perform delete.",
        "info"
      );
      setDeleteTarget(null);
    } catch {
      showToast("Unable to delete item.", "error");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  /* Confirm Status placeholder */
  const handleConfirmStatus = async () => {
    if (!statusTarget || statusSubmitting) return;
    setStatusSubmitting(true);
    try {
      showToast(
        "Change status endpoint not provided. Implement server API to update status.",
        "info"
      );
      setStatusTarget(null);
    } catch {
      showToast("Unable to update status.", "error");
    } finally {
      setStatusSubmitting(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportBusinessIdeaPartners(filteredItems);
      showToast("Export completed successfully!", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showToast("Export failed!", "error");
    }
  };

  /* ---------------------------
     Render - Top header updated to match your screenshot:
        - left: "Business Idea Partner" + pill tabs (labels changed to Individual/Business)
        - center: large heading area
        - right: Export button + search field
     --------------------------- */
  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full flex-col gap-8 pb-3">
        <section className="space-y-6 rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm">
          {/* TOP ROW: left title + tabs, center heading, right export + search */}
          <div className="flex items-center justify-between gap-4">
            {/* left: title + tabs */}
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Business Idea Partner
                </h2>
              </div>

              {/* Tabs: visually same as promo UI but labels changed */}
              <div className="flex items-center gap-3 rounded-full bg-[#f7f8fd] p-1 text-sm font-semibold text-gray-500">
                <TabButton
                  label="Individual"
                  isActive={activeTab === "registration"}
                  onClick={() => setActiveTab("registration")}
                />
                <TabButton
                  label="Business"
                  isActive={activeTab === "services"}
                  onClick={() => setActiveTab("services")}
                />
              </div>
            </div>

            {/* right: export + search */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleExport}
                className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Export
              </button>

              <div className="w-64">
                <SearchField value={searchTerm} onChange={setSearchTerm} />
              </div>
            </div>
          </div>

          {/* error banner */}
          {listError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {listError}
            </div>
          )}

          {/* Main content: show either detail view or table/stats */}
          {viewLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500 text-lg">Loading details...</div>
            </div>
          ) : viewTarget ? (
            <div className="space-y-6">
              {/* Top: Back + Status */}
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  className="text-primary text-base font-semibold flex items-center gap-2"
                  onClick={() => setViewTarget(null)}
                >
                  <span className="text-xl">&larr;</span> Back
                </button>
                <span className={`px-4 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800`}>
                  {mapStatus(viewTarget.statusId).label}
                </span>
              </div>

              {/* Individual Partner Information */}
              <div className="mb-2">
                <div className="text-xs font-semibold text-gray-500 mb-2">Individual Partner Information</div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="mb-1">
                      <span className="font-semibold text-gray-700">Name:</span>
                      <span className="ml-2">{viewTarget.businessName ?? "-"}</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-semibold text-gray-700">Email:</span>
                      <span className="ml-2">{viewTarget.email ?? "-"}</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-semibold text-gray-700">Phone no:</span>
                      <span className="ml-2">{viewTarget.phone ?? "-"}</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-semibold text-gray-700">Address:</span>
                      <span className="ml-2">{viewTarget.address ?? "-"}</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-semibold text-gray-700">National Address:</span>
                      <span className="ml-2">{viewTarget.nationalAddress ?? "-"}</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-semibold text-gray-700">Country/Region/City/District:</span>
                      <span className="ml-2">{`${viewTarget.country ?? "-"}${viewTarget.region ? ', ' + viewTarget.region : ''}${viewTarget.city ? ', ' + viewTarget.city : ''}${viewTarget.district ? ', ' + viewTarget.district : ''}`}</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-semibold text-gray-700">Latitude/Longitude:</span>
                      <span className="ml-2">{viewTarget.latitude ?? "-"}, {viewTarget.longitude ?? "-"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1">
                      <span className="font-semibold text-gray-700">Idea Name</span>
                      <div className="ml-2">{viewTarget.ideaName ?? "-"}</div>
                    </div>
                    <div className="mb-1">
                      <span className="font-semibold text-gray-700">Idea Description</span>
                      <div className="ml-2">{viewTarget.ideaDescription ?? "-"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description box */}
              <div>
                <textarea
                  className="w-full border rounded p-3 bg-gray-50 text-sm resize-none"
                  value={viewTarget.ideaDescription ?? ""}
                  readOnly
                  rows={3}
                  style={{ minHeight: "70px" }}
                />
              </div>

              {/* Media */}
              {viewTarget.mediaFilePath && (
                <div className="mb-2">
                  <div className="text-xs font-semibold text-gray-500 mb-1">Media</div>
                  <img
                    src={viewTarget.mediaFilePath}
                    alt="media"
                    className="max-h-40 rounded"
                  />
                </div>
              )}

              {/* Chat Board (from API comments) */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">Conversation</h4>
                <div className="space-y-3 max-h-96 overflow-auto mb-3">
                  {Array.isArray(viewTarget.comments) && viewTarget.comments.length > 0 ? (
                    viewTarget.comments.map((c: any, idx: number) => {
                      const text = c.comment ?? c.issueComment ?? c.message ?? c.text ?? "";
                      const created = formatCommentDate(c);
                      const sender = c.fromId === 1 ? "You" : `User ${c.fromId}`;
                      const isCurrentUser = c.fromId === 1;
                      return (
                        <div key={idx} className={`flex items-end ${isCurrentUser ? 'justify-end' : 'justify-start'} relative`}>
                          {!isCurrentUser && (
                            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mr-3 font-bold text-lg shadow">{(sender && sender[0]) || 'U'}</div>
                          )}
                          <div className="max-w-[60%]">
                            {!isCurrentUser && (
                              <div className="text-xs font-semibold text-gray-700 mb-1">{sender}</div>
                            )}
                            {/* Updated bubble: ensure wrapping and explicit color for dark background */}
                            <div
                              className={`rounded-lg px-4 py-3 text-sm break-words whitespace-pre-wrap ${isCurrentUser ? 'bg-[#f5f7fa] text-gray-800' : 'bg-black text-white'}`}
                              style={isCurrentUser ? undefined : { color: '#ffffff' }}
                            >
                              {text}
                            </div>
                            {created && <div className="text-xs text-gray-400 mt-1">{created}</div>}
                            {/* Reactions */}
                            {Array.isArray(c.reactions) && c.reactions.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                                {c.reactions.map((r: any, ri: number) => (
                                  <span key={ri} className="px-1">{r.emojiCode}</span>
                                ))}
                              </div>
                            )}
                            {/* Emoji pickers */}
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => { setOpenAllFor(null); setOpenReactionFor(openReactionFor === idx ? null : idx); }}
                                className="text-sm text-gray-500"
                                aria-label="React"
                                type="button"
                              >
                                😊
                              </button>
                              <button
                                onClick={() => { setOpenReactionFor(null); setOpenAllFor(openAllFor === idx ? null : idx); }}
                                className="text-sm text-gray-500"
                                aria-label="More emojis"
                                type="button"
                              >
                                ➕
                              </button>
                              {openReactionFor === idx && (
                                <div className="absolute z-20 mt-8 bg-white border rounded p-2 shadow flex gap-2">
                                  {EMOJIS.map((e) => (
                                    <button
                                      key={e}
                                      onClick={() => handleSendReaction(idx, e)}
                                      disabled={sendingReaction}
                                      className="text-lg"
                                      type="button"
                                      aria-label={`React with ${e}`}
                                    >
                                      {e}
                                    </button>
                                  ))}
                                </div>
                              )}
                              {openAllFor === idx && (
                                <div className="absolute z-30 mt-8 bg-white border rounded p-3 shadow grid grid-cols-8 gap-2 max-h-40 overflow-auto">
                                  {ALL_EMOJIS.map((e) => (
                                    <button
                                      key={e}
                                      onClick={() => handleSendReaction(idx, e)}
                                      disabled={sendingReaction}
                                      className="text-lg p-1"
                                      type="button"
                                      aria-label={`React with ${e}`}
                                    >
                                      {e}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {isCurrentUser && (
                            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center ml-3 font-bold text-lg shadow">R</div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-500">No conversation yet</div>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    className="flex-1 border rounded p-2"
                    placeholder="Reply"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Reply"
                  />
                  <button
                    className="px-4 py-2 bg-black text-white rounded"
                    onClick={handleSendChatMessage}
                    disabled={sendingChat || searchTerm.trim() === ""}
                  >
                    {sendingChat ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>

              {/* Approve/Reject buttons */}
              <div className="flex justify-end gap-3 pt-6">
                <button
                  className="rounded-md border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-500 hover:border-primary"
                  // TODO: bind reject logic
                >
                  Reject
                </button>
                <button
                  className="rounded-md bg-black px-6 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800"
                  // TODO: bind approve logic
                >
                  Approve
                </button>
              </div>
            </div>
          ) : (
            // Table/stats view (default)
            <>
              <StatsRow />
              {/* <ChartPlaceholder /> */}
              {listError ? (
                <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600">
                  {listError}
                </div>
              ) : (
                <ComanTable
                  columns={tableColumns}
                  data={filteredItems}
                  actions={actionButtons}
                  page={pageNumber}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  onPageChange={handlePageChange}
                  sortState={sortState}
                  onSortChange={handleSortChange}
                  pageSize={pageSize}
                  onPageSizeChange={handlePageSizeChange}
                  loading={listLoading}
                />
              )}
            </>
          )}
        </section>
      </div>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <ModalOverlay>
          <DeleteConfirmModal
            isSubmitting={deleteSubmitting}
            onCancel={() => {
              if (!deleteSubmitting) setDeleteTarget(null);
            }}
            onConfirm={handleConfirmDelete}
          />
        </ModalOverlay>
      )}

      {/* Status Confirm Modal */}
      {statusTarget && (
        <ModalOverlay>
          <StatusConfirmModal
            isActive={statusTarget.currentStatus}
            isSubmitting={statusSubmitting}
            onCancel={() => {
              if (!statusSubmitting) setStatusTarget(null);
            }}
            onConfirm={handleConfirmStatus}
          />
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};

/* ---------------------------
   Reused small components & UI pieces (kept same style as promo)
   --------------------------- */

const TabButton = ({
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
    className={`rounded-full px-5 py-2 ${
      isActive
        ? "bg-white text-primary shadow"
        : "bg-transparent text-gray-500 hover:text-primary"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const SearchField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) => (
  <div className="relative w-full max-w-xs input-filed-block">
    <input
      type="search"
      id="search_bar_business_analytics"
      placeholder="Search here"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-md border border-slate-200 bg-white pl-3 pr-11 py-2 text-base text-gray-600 shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 peer placeholder-transparent disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD]"
    />
    <label
      htmlFor="search_bar_business_analytics"
      className={`
        label-filed absolute left-2.5 top-2 text-[#A0A3BD] text-base transition-all duration-200
        peer-placeholder-shown:top-2 peer-placeholder-shown:left-2.5 peer-placeholder-shown:text-base cursor-text
        peer-focus:-top-3 peer-focus:left-2.5 peer-focus:text-[13px] peer-focus:text-[#070B68]
        bg-white px-1 ${
          value && value.trim() !== "" ? "!-top-3 !text-[13px] " : ""
        } 
      `}
    >
      Search here
    </label>
    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
      <SearchIcon />
    </span>
  </div>
);

const StatsRow = () => (
  <div className="flex flex-col lg:flex-row items-stretch gap-6">
    <div className="flex gap-6 flex-1 items-center justify-start">
      {stats.map((s) => (
        <div key={s.label} className="min-w-[180px] flex-1">
          <div className="text-4xl lg:text-5xl font-extrabold text-black leading-none">{s.value}</div>
          <div className="mt-4 text-sm font-semibold text-gray-700 whitespace-pre-line">{s.label}</div>
        </div>
      ))}
    </div>

    <div className="w-full lg:w-1/2">
      <ChartPlaceholder />
    </div>
  </div>
);

/**
 * Simple responsive SVG bar chart using the static monthlyValues array.
 * - Bars scale to the max value
 * - Numeric value shown above each bar
 * - Month label shown below each bar
 */
const ChartPlaceholder = () => {
  const values = monthlyValues;
  const labels = monthLabels;
  const max = Math.max(...values);
  const padding = { top: 20, right: 12, bottom: 36, left: 30 };
  const barGap = 10;

  // responsive size — will scale with container width using viewBox
  const viewWidth = 800;
  const viewHeight = 220;
  const chartWidth = viewWidth - padding.left - padding.right;
  const chartHeight = viewHeight - padding.top - padding.bottom;
  const barCount = values.length;
  const barWidth = Math.max(12, Math.floor((chartWidth - barGap * (barCount - 1)) / barCount));

  return (
    <div className="rounded-[12px] border border-gray-200 bg-white p-4">
      <div className="text-xs text-gray-600 mb-3">Report by Month</div>
      <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} width="100%" height="220" preserveAspectRatio="xMidYMid meet" aria-hidden>
        {/* y axis grid lines (optional lightweight) */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = padding.top + chartHeight * (1 - t);
          return (
            <line
              key={i}
              x1={padding.left}
              x2={viewWidth - padding.right}
              y1={y}
              y2={y}
              stroke="#efefef"
              strokeWidth={1}
            />
          );
        })}

        {/* bars */}
        {values.map((val, i) => {
          const x = padding.left + i * (barWidth + barGap);
          const barHeight = max === 0 ? 0 : (val / max) * chartHeight;
          const y = padding.top + (chartHeight - barHeight);
          const labelY = y - 6;
          return (
            <g key={i} transform={`translate(${x},0)`}>
              {/* numeric label above bar */}
              <text x={barWidth / 2} y={labelY} textAnchor="middle" fontSize="11" fill="#111" style={{ fontWeight: 700 }}>
                {val}
              </text>

              {/* bar rectangle */}
              <rect
                x={0}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={3}
                fill="#111"
                opacity={0.95}
              />

              {/* month label */}
              <text
                x={barWidth / 2}
                y={padding.top + chartHeight + 16}
                textAnchor="middle"
                fontSize="11"
                fill="#6b7280"
              >
                {labels[i]}
              </text>
            </g>
          );
        })}

        {/* y-axis left label (0 and max) */}
        <text x={8} y={padding.top + chartHeight + 4} fontSize="10" fill="#9ca3af">0</text>
        <text x={8} y={padding.top + 10} fontSize="10" fill="#9ca3af">{max}</text>
      </svg>
    </div>
  );
};

const ModalOverlay = ({ children }: { children: ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1787b8] px-4">
    {children}
  </div>
);

const ModalShell = ({
  title,
  onClose,
  children,
  modalShellClassName,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  modalShellClassName?: string;
}) => (
  <div
    className={`w-full max-w-xl rounded-md bg-white px-6 py-6 shadow-[0_40px_90px_rgba(5,6,104,0.18)] ${modalShellClassName}`}
  >
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
      <button
        type="button"
        aria-label="Close"
        className="flex h-8 w-8 items-center justify-center rounded-full text-[#1B1787] transition"
        onClick={onClose}
      >
        <CloseIcon />
      </button>
    </div>
    <div className="mt-8 space-y-6">{children}</div>
  </div>
);

const StatusConfirmModal = ({
  isActive,
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  isActive: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <ModalShell
    title={`${isActive ? "Deactivate" : "Activate"} Idea Partner`}
    onClose={onCancel}
  >
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff3d9] text-[#b46a02]">
        <span className="text-4xl">!</span>
      </div>
      <p className="text-sm font-medium text-gray-600">
        Are you sure you want to {isActive ? "deactivate" : "activate"} this
        record?
      </p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-500 hover:border-primary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#030447] disabled:cursor-not-allowed disabled:bg-primary/70"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Yes"}
        </button>
      </div>
    </div>
  </ModalShell>
);

const DeleteConfirmModal = ({
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <ModalShell title="Delete Idea Partner" onClose={onCancel}>
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ffe6e6] text-[#c03636]">
        <TrashIcon />
      </div>
      <p className="text-sm font-medium text-gray-600">
        This action will permanently delete the record. Do you want to continue?
      </p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-500 hover:border-primary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-full bg-[#ff4d4f] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#e34040] disabled:cursor-not-allowed disabled:bg-[#ff4d4f]/70"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </ModalShell>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-8 w-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 6l12 12M18 6L6 18"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    className="h-4 w-4"
  >
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 20l-3-3" />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    className="h-4 w-4"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7V5h6v2" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"
    />
  </svg>
);

const stats = [
  { label: "Total Number\nof Ideas", value: "244" },
  { label: "Total Approved\nIdeas", value: "22" },
  { label: "Total Developed\nIdeas", value: "266" },
];

// monthly data shown in image (Jan..Dec)
const monthlyValues = [30, 37, 117, 50, 74, 22, 90, 60, 80, 50, 110, 75];
const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];

export default BusinessAnalytics;
