
import { useCallback, useEffect, useMemo, useState } from "react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";

type FormMode = "create" | "edit";

interface EmployeeCategoryAssignmentItem {
  assignmentId: number;
  employeeId: number;
  employeeName?: string | null;
  officialEmail?: string | null;
  telephone?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  serviceId?: number | null;
  serviceName?: string | null;
  subServiceId?: number | null;
  subServiceName?: string | null;
}

interface FormState {
  assignmentId: number | null;
  employeeId: string;
  employeeName: string;
  officialEmail: string;
  telephone: string;
  categoryId: string;
  categoryName: string;
  serviceId: string;
  serviceName: string;
  subServiceId: string;
  subServiceName: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface EmployeeOption extends SelectOption {
  email: string;
  phone: string;
}

const LIST_ENDPOINT =
  "https://apisalwa.rushkarprojects.in/api/AdminAddEmployeeAndCategoryAssign/GetAllServiceManageMentEmployeeCategoryAssign";
const DETAIL_ENDPOINT =
  "https://apisalwa.rushkarprojects.in/api/AdminAddEmployeeAndCategoryAssign/GetServiceManageMentEmployeeCategoryAssignById";
const UPSERT_ENDPOINT =
  "https://apisalwa.rushkarprojects.in/api/AdminAddEmployeeAndCategoryAssign/UpsertServiceManageMentEmployeeCategoryAssign";

const createDefaultFormState = (): FormState => ({
  assignmentId: null,
  employeeId: "",
  employeeName: "",
  officialEmail: "",
  telephone: "",
  categoryId: "",
  categoryName: "",
  serviceId: "",
  serviceName: "",
  subServiceId: "",
  subServiceName: "",
});

const parseResponse = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const messageFromPayload = (payload: unknown, fallback: string) => {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }
  return fallback;
};

const extractList = (payload: unknown): EmployeeCategoryAssignmentItem[] => {
  if (Array.isArray(payload)) {
    return payload as EmployeeCategoryAssignmentItem[];
  }
  if (payload && typeof payload === "object" && "data" in payload) {
    const { data } = payload as { data?: unknown };
    if (Array.isArray(data)) {
      return data as EmployeeCategoryAssignmentItem[];
    }
  }
  return [];
};
const EmployeeCategoryAssignment = () => {
  const { authFetch } = useAuth();
  const { showToast } = useToast();

  const [assignments, setAssignments] = useState<EmployeeCategoryAssignmentItem[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [formValues, setFormValues] = useState<FormState>(createDefaultFormState());
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const loadAssignments = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const response = await authFetch(LIST_ENDPOINT, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });

      const payload = await parseResponse(response);
      if (!response.ok) {
        throw new Error(messageFromPayload(payload, "Unable to load assignments."));
      }

      const items = extractList(payload);
      setAssignments(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load assignments.";
      setAssignments([]);
      setListError(message);
      showToast(message, "error");
    } finally {
      setListLoading(false);
    }
  }, [authFetch, showToast]);

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  const stats = useMemo(() => {
    const totalAssignments = assignments.length;
    const uniqueEmployees = new Set(
      assignments
        .map((item) => item.employeeId)
        .filter((value): value is number => typeof value === "number" && !Number.isNaN(value))
    ).size;
    const uniqueCategories = new Set(
      assignments
        .map((item) => item.categoryId)
        .filter((value): value is number => typeof value === "number" && !Number.isNaN(value))
    ).size;

    return [
      { label: "Total Assignments", value: totalAssignments.toString() },
      { label: "Unique Employees", value: uniqueEmployees.toString() },
      { label: "Unique Categories", value: uniqueCategories.toString() },
    ];
  }, [assignments]);

  const employeeOptions = useMemo<EmployeeOption[]>(() => {
    const map = new Map<string, EmployeeOption>();
    assignments.forEach((item) => {
      if (typeof item.employeeId === "number" && !Number.isNaN(item.employeeId)) {
        const value = item.employeeId.toString();
        if (!map.has(value)) {
          map.set(value, {
            value,
            label: item.employeeName?.trim() || `Employee ${item.employeeId}`,
            email: item.officialEmail?.trim() || "",
            phone: item.telephone?.trim() || "",
          });
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [assignments]);

  const categoryOptions = useMemo<SelectOption[]>(() => {
    const map = new Map<string, string>();
    assignments.forEach((item) => {
      if (typeof item.categoryId === "number" && !Number.isNaN(item.categoryId)) {
        const value = item.categoryId.toString();
        if (!map.has(value)) {
          map.set(value, item.categoryName?.trim() || `Category ${item.categoryId}`);
        }
      }
    });
    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [assignments]);

  const serviceOptions = useMemo<SelectOption[]>(() => {
    const map = new Map<string, string>();
    assignments.forEach((item) => {
      if (typeof item.serviceId === "number" && !Number.isNaN(item.serviceId)) {
        const value = item.serviceId.toString();
        if (!map.has(value)) {
          map.set(value, item.serviceName?.trim() || `Service ${item.serviceId}`);
        }
      }
    });
    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [assignments]);

  const subServiceOptions = useMemo<SelectOption[]>(() => {
    const map = new Map<string, string>();
    assignments.forEach((item) => {
      if (typeof item.subServiceId === "number" && !Number.isNaN(item.subServiceId)) {
        const value = item.subServiceId.toString();
        if (!map.has(value)) {
          map.set(value, item.subServiceName?.trim() || `Sub-service ${item.subServiceId}`);
        }
      }
    });
    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return assignments;
    }

    return assignments.filter((item) => {
      const haystack = [
        item.employeeName,
        item.officialEmail,
        item.telephone,
        item.categoryName,
        item.serviceName,
        item.subServiceName,
      ]
        .filter((value): value is string => Boolean(value))
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [assignments, searchTerm]);

  const handleOpenCreate = () => {
    setFormMode("create");
    setFormValues(createDefaultFormState());
    setFormLoading(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = async (assignment: EmployeeCategoryAssignmentItem) => {
    setFormMode("edit");
    setFormValues(createDefaultFormState());
    setIsFormOpen(true);
    setFormLoading(true);

    try {
      const response = await authFetch(`${DETAIL_ENDPOINT}?EmployeeId=${assignment.employeeId}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });

      const payload = await parseResponse(response);
      if (!response.ok) {
        throw new Error(messageFromPayload(payload, "Unable to fetch assignment details."));
      }

      const items = extractList(payload);
      const match =
        items.find((item) => item.assignmentId === assignment.assignmentId) ?? items[0] ?? assignment;

      const formState: FormState = {
        assignmentId: match.assignmentId ?? assignment.assignmentId ?? null,
        employeeId:
          typeof match.employeeId === "number" && !Number.isNaN(match.employeeId)
            ? match.employeeId.toString()
            : "",
        employeeName: match.employeeName?.trim() || assignment.employeeName?.trim() || "",
        officialEmail: match.officialEmail?.trim() || assignment.officialEmail?.trim() || "",
        telephone: match.telephone?.trim() || assignment.telephone?.trim() || "",
        categoryId:
          typeof match.categoryId === "number" && !Number.isNaN(match.categoryId)
            ? match.categoryId.toString()
            : "",
        categoryName: match.categoryName?.trim() || assignment.categoryName?.trim() || "",
        serviceId:
          typeof match.serviceId === "number" && !Number.isNaN(match.serviceId)
            ? match.serviceId.toString()
            : "",
        serviceName: match.serviceName?.trim() || assignment.serviceName?.trim() || "",
        subServiceId:
          typeof match.subServiceId === "number" && !Number.isNaN(match.subServiceId)
            ? match.subServiceId.toString()
            : "",
        subServiceName: match.subServiceName?.trim() || assignment.subServiceName?.trim() || "",
      };

      setFormValues(formState);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to fetch assignment details.";
      showToast(message, "error");
      setIsFormOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    if (formSubmitting) {
      return;
    }

    const employeeId = formValues.employeeId.trim();
    const categoryId = formValues.categoryId.trim();
    const serviceId = formValues.serviceId.trim();
    const subServiceId = formValues.subServiceId.trim();

    if (!employeeId) {
      showToast("Employee is required.", "error");
      return;
    }
    if (!categoryId) {
      showToast("Category is required.", "error");
      return;
    }
    if (!serviceId) {
      showToast("Service is required.", "error");
      return;
    }

    const payload = {
      assignmentIds: formValues.assignmentId ? formValues.assignmentId.toString() : "0",
      employeeIds: employeeId,
      categoryIds: categoryId,
      serviceIds: serviceId,
      subServiceIds: subServiceId || "0",
    };

    setFormSubmitting(true);
    try {
      const response = await authFetch(UPSERT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(payload),
      });

      const body = await parseResponse(response);
      if (!response.ok) {
        throw new Error(messageFromPayload(body, "Unable to save assignment."));
      }

      const successMessage = messageFromPayload(body, "Assignment saved successfully.");
      showToast(successMessage, "success");
      setIsFormOpen(false);
      await loadAssignments();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save assignment.";
      showToast(message, "error");
    } finally {
      setFormSubmitting(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-16">
        <Header />
        <section className="space-y-8 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="grid gap-1">
              <h2 className="text-2xl font-semibold text-primary">Employee &amp; Category Assignment</h2>
              <p className="text-sm text-gray-500">Assign workforce to categories and services.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <SearchField value={searchTerm} onChange={setSearchTerm} />
              <button
                type="button"
                className="rounded-full bg-primary px-8 py-2 text-sm font-semibold text-white shadow hover:bg-[#030447]"
                onClick={handleOpenCreate}
              >
                Add
              </button>
            </div>
          </div>

          {listError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {listError}
            </div>
          )}

          <StatsRow stats={stats} />
          <ChartPlaceholder />

          <AssignmentTable
            assignments={filteredAssignments}
            loading={listLoading}
            onEdit={handleOpenEdit}
          />
        </section>
      </div>

      {isFormOpen && (
        <ModalOverlay>
          <FormModal
            mode={formMode}
            values={formValues}
            onChange={setFormValues}
            onClose={() => {
              if (!formSubmitting) {
                setIsFormOpen(false);
              }
            }}
            onSubmit={handleFormSubmit}
            isSubmitting={formSubmitting}
            isLoading={formLoading}
            employeeOptions={employeeOptions}
            categoryOptions={categoryOptions}
            serviceOptions={serviceOptions}
            subServiceOptions={subServiceOptions}
          />
        </ModalOverlay>
      )}
    </DashboardLayout>
  );
};

const Header = () => (
  <div className="flex items-center gap-4 rounded-[28px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        className="h-5 w-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4v16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16" />
      </svg>
    </div>
    <div>
      <p className="text-lg font-semibold text-primary">Employee Category Assignment</p>
      <p className="text-sm text-gray-500">Manage employee allocation across service categories.</p>
    </div>
  </div>
);

const SearchField = ({ value, onChange }: { value: string; onChange: (next: string) => void }) => (
  <div className="relative w-full max-w-xs">
    <input
      className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 pl-10 text-sm text-gray-600 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      placeholder="Search here"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
      <SearchIcon />
    </span>
  </div>
);

const StatsRow = ({ stats }: { stats: Array<{ label: string; value: string }> }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {stats.map((item) => (
      <div
        key={item.label}
        className="rounded-[28px] border border-gray-200 bg-[#f7f8fd] px-6 py-8 text-center shadow-[0_20px_40px_rgba(5,6,104,0.08)]"
      >
        <p className="text-3xl font-semibold text-primary">{item.value}</p>
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

const AssignmentTable = ({
  assignments,
  loading,
  onEdit,
}: {
  assignments: EmployeeCategoryAssignmentItem[];
  loading: boolean;
  onEdit: (assignment: EmployeeCategoryAssignmentItem) => void;
}) => (
  <div className="overflow-hidden rounded-[28px] border border-gray-200">
    <div className="overflow-x-auto">
      <table className="min-w-[1080px] w-full text-left text-sm text-gray-600">
        <thead className="bg-[#f6f7fb] text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
          <tr>
            <th className="px-6 py-4">Assignment ID</th>
            <th className="px-6 py-4">Employee Name</th>
            <th className="px-6 py-4">Official Email</th>
            <th className="px-6 py-4">Telephone</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Service</th>
            <th className="px-6 py-4">Sub-service</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {loading ? (
            <tr>
              <td colSpan={8} className="px-6 py-6 text-center text-sm text-gray-500">
                Loading assignments...
              </td>
            </tr>
          ) : assignments.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-6 text-center text-sm text-gray-500">
                No assignments found.
              </td>
            </tr>
          ) : (
            assignments.map((assignment) => (
              <tr key={`${assignment.assignmentId}-${assignment.employeeId}`}>
                <td className="px-6 py-4 font-semibold text-primary">
                  #{assignment.assignmentId.toString().padStart(4, "0")}
                </td>
                <td className="px-6 py-4 text-gray-700">{assignment.employeeName ?? "-"}</td>
                <td className="px-6 py-4 text-gray-500">{assignment.officialEmail ?? "-"}</td>
                <td className="px-6 py-4 text-gray-500">{assignment.telephone ?? "-"}</td>
                <td className="px-6 py-4 text-gray-500">{assignment.categoryName ?? "-"}</td>
                <td className="px-6 py-4 text-gray-500">{assignment.serviceName ?? "-"}</td>
                <td className="px-6 py-4 text-gray-500">{assignment.subServiceName ?? "-"}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    <ActionButton
                      label="Edit"
                      variant="edit"
                      onClick={() => onEdit(assignment)}
                    >
                      <EditIcon />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
const FormModal = ({
  mode,
  values,
  onChange,
  onClose,
  onSubmit,
  isSubmitting,
  isLoading,
  employeeOptions,
  categoryOptions,
  serviceOptions,
  subServiceOptions,
}: {
  mode: FormMode;
  values: FormState;
  onChange: (next: FormState) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isLoading: boolean;
  employeeOptions: EmployeeOption[];
  categoryOptions: SelectOption[];
  serviceOptions: SelectOption[];
  subServiceOptions: SelectOption[];
}) => {
  const employeeOptionsWithCurrent =
    values.employeeId && !employeeOptions.some((option) => option.value === values.employeeId)
      ? [
          ...employeeOptions,
          {
            value: values.employeeId,
            label: values.employeeName || `Employee ${values.employeeId}`,
            email: values.officialEmail,
            phone: values.telephone,
          },
        ]
      : employeeOptions;

  const categoryOptionsWithCurrent =
    values.categoryId && !categoryOptions.some((option) => option.value === values.categoryId)
      ? [
          ...categoryOptions,
          {
            value: values.categoryId,
            label: values.categoryName || `Category ${values.categoryId}`,
          },
        ]
      : categoryOptions;

  const serviceOptionsWithCurrent =
    values.serviceId && !serviceOptions.some((option) => option.value === values.serviceId)
      ? [
          ...serviceOptions,
          {
            value: values.serviceId,
            label: values.serviceName || `Service ${values.serviceId}`,
          },
        ]
      : serviceOptions;

  const subServiceOptionsWithCurrent =
    values.subServiceId && !subServiceOptions.some((option) => option.value === values.subServiceId)
      ? [
          ...subServiceOptions,
          {
            value: values.subServiceId,
            label: values.subServiceName || `Sub-service ${values.subServiceId}`,
          },
        ]
      : subServiceOptions;

  return (
    <ModalShell
      title={`${mode === "edit" ? "Edit" : "Add"} Employee & Category Assignment`}
      onClose={onClose}
    >
      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-sm text-gray-500">
          Loading details...
        </div>
      ) : (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          {mode === "edit" && (
            <LabeledInput
              label="Assignment ID"
              value={values.assignmentId ? values.assignmentId.toString() : "-"}
              readOnly
              disabled
            />
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {employeeOptionsWithCurrent.length > 0 ? (
              <LabeledSelect
                label="Employee"
                value={values.employeeId}
                onChange={(event) => {
                  const next = event.target.value;
                  const meta = employeeOptionsWithCurrent.find((option) => option.value === next);
                  onChange({
                    ...values,
                    employeeId: next,
                    employeeName: meta?.label ?? "",
                    officialEmail: meta?.email ?? "",
                    telephone: meta?.phone ?? "",
                  });
                }}
                disabled={isSubmitting}
              >
                <option value="">Select employee</option>
                {employeeOptionsWithCurrent.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </LabeledSelect>
            ) : (
              <LabeledInput
                label="Employee ID"
                value={values.employeeId}
                onChange={(event) =>
                  onChange({
                    ...values,
                    employeeId: event.target.value,
                  })
                }
                placeholder="Enter employee id"
                disabled={isSubmitting}
              />
            )}
            <LabeledInput
              label="Employee Name"
              value={values.employeeName}
              onChange={(event) => onChange({ ...values, employeeName: event.target.value })}
              placeholder="Enter employee name"
              disabled={isSubmitting}
            />
            <LabeledInput
              label="Official Email"
              value={values.officialEmail}
              onChange={(event) => onChange({ ...values, officialEmail: event.target.value })}
              placeholder="Enter email"
              disabled={isSubmitting}
            />
            <LabeledInput
              label="Telephone"
              value={values.telephone}
              onChange={(event) => onChange({ ...values, telephone: event.target.value })}
              placeholder="Enter telephone"
              disabled={isSubmitting}
            />
            {categoryOptionsWithCurrent.length > 0 ? (
              <LabeledSelect
                label="Category"
                value={values.categoryId}
                onChange={(event) => {
                  const next = event.target.value;
                  const meta = categoryOptionsWithCurrent.find((option) => option.value === next);
                  onChange({
                    ...values,
                    categoryId: next,
                    categoryName: meta?.label ?? "",
                  });
                }}
                disabled={isSubmitting}
              >
                <option value="">Select category</option>
                {categoryOptionsWithCurrent.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </LabeledSelect>
            ) : (
              <LabeledInput
                label="Category ID"
                value={values.categoryId}
                onChange={(event) =>
                  onChange({
                    ...values,
                    categoryId: event.target.value,
                  })
                }
                placeholder="Enter category id"
                disabled={isSubmitting}
              />
            )}
            <LabeledInput
              label="Category Name"
              value={values.categoryName}
              onChange={(event) => onChange({ ...values, categoryName: event.target.value })}
              placeholder="Enter category name"
              disabled={isSubmitting}
            />
            {serviceOptionsWithCurrent.length > 0 ? (
              <LabeledSelect
                label="Service"
                value={values.serviceId}
                onChange={(event) => {
                  const next = event.target.value;
                  const meta = serviceOptionsWithCurrent.find((option) => option.value === next);
                  onChange({
                    ...values,
                    serviceId: next,
                    serviceName: meta?.label ?? "",
                  });
                }}
                disabled={isSubmitting}
              >
                <option value="">Select service</option>
                {serviceOptionsWithCurrent.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </LabeledSelect>
            ) : (
              <LabeledInput
                label="Service ID"
                value={values.serviceId}
                onChange={(event) =>
                  onChange({
                    ...values,
                    serviceId: event.target.value,
                  })
                }
                placeholder="Enter service id"
                disabled={isSubmitting}
              />
            )}
            <LabeledInput
              label="Service Name"
              value={values.serviceName}
              onChange={(event) => onChange({ ...values, serviceName: event.target.value })}
              placeholder="Enter service name"
              disabled={isSubmitting}
            />
            {subServiceOptionsWithCurrent.length > 0 ? (
              <LabeledSelect
                label="Sub-service"
                value={values.subServiceId}
                onChange={(event) => {
                  const next = event.target.value;
                  const meta = subServiceOptionsWithCurrent.find((option) => option.value === next);
                  onChange({
                    ...values,
                    subServiceId: next,
                    subServiceName: meta?.label ?? "",
                  });
                }}
                disabled={isSubmitting}
              >
                <option value="">Select sub-service</option>
                {subServiceOptionsWithCurrent.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </LabeledSelect>
            ) : (
              <LabeledInput
                label="Sub-service ID"
                value={values.subServiceId}
                onChange={(event) =>
                  onChange({
                    ...values,
                    subServiceId: event.target.value,
                  })
                }
                placeholder="Enter sub-service id"
                disabled={isSubmitting}
              />
            )}
            <LabeledInput
              label="Sub-service Name"
              value={values.subServiceName}
              onChange={(event) => onChange({ ...values, subServiceName: event.target.value })}
              placeholder="Enter sub-service name"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-500 hover:border-primary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-primary px-10 py-3 text-sm font-semibold text-white shadow hover:bg-[#030447] disabled:cursor-not-allowed disabled:bg-primary/70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : mode === "edit" ? "Update Assignment" : "Save Assignment"}
            </button>
          </div>
        </form>
      )}
    </ModalShell>
  );
};

const LabeledInput = ({
  label,
  className = "",
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) => (
  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
    {label}
    <input
      {...props}
      className={`w-full rounded-[20px] border border-gray-200 bg-[#f7f8fd] px-4 py-3 text-sm text-gray-600 shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${className}`}
    />
  </label>
);

const LabeledSelect = ({
  label,
  className = "",
  children,
  ...props
}: { label: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) => (
  <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
    {label}
    <div className="relative">
      <select
        {...props}
        className={`w-full appearance-none rounded-[20px] border border-gray-200 bg-[#f7f8fd] px-4 py-3 text-sm text-gray-600 shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${className}`}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
        <ChevronIcon />
      </span>
    </div>
  </label>
);

const ActionButton = ({
  label,
  variant,
  onClick,
  children,
}: {
  label: string;
  variant: "edit";
  onClick: () => void;
  children: ReactNode;
}) => {
  const styles: Record<"edit", string> = {
    edit: "bg-white text-[#1d1f2a] border border-gray-200 hover:border-primary hover:text-primary",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 shadow-sm ${styles[variant]}`}
    >
      {children}
    </button>
  );
};
const ModalOverlay = ({ children }: { children: ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-[6px] px-4">
    {children}
  </div>
);

const ModalShell = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) => (
  <div className="w-full max-w-2xl rounded-[36px] bg-white px-8 py-10 shadow-[0_40px_90px_rgba(5,6,104,0.18)]">
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
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

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-3-3" />
  </svg>
);

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-3 w-3">
    <path strokeLinecap="round" strokeLinejoin="round" d="m6 8 4 4 4-4" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h4l10.5-10.5a1.5 1.5 0 0 0-2.12-2.12L6 17.88V20Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.5 6.5 3 3" />
  </svg>
);

export default EmployeeCategoryAssignment;


