import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import type { OrderRecord, RentalServiceDetailState, Status } from "./RentalServices";


const FALLBACK_ORDER: OrderRecord = {
  id: 0,
  orderNo: "#0000",
  orderTitle: "Kings Medical Hospital",
  deviceName: "MRI Machine",
  fdaNumber: "FDA0000000",
  deviceType: "Medical Imaging",
  approvalNumber: "APP-00000",
  date: "Jan 01, 2024",
  country: "Saudi Arabia",
  region: "Region 1",
  city: "Riyadh",
  status: "Pending",
};

const FALLBACK_DETAIL: RentalServiceDetailState = {
  order: FALLBACK_ORDER,
  gallery: [
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=1280&q=80",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1280&q=80",
  ],
  secondaryImages: [
    "https://images.unsplash.com/photo-1576765973412-3f7bc60f3f58?auto=format&fit=crop&w=480&q=80",
    "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=480&q=80",
    "https://images.unsplash.com/photo-1527368912707-85145e43e9ff?auto=format&fit=crop&w=480&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=480&q=80",
  ],
  address: "123 Healthcare Avenue",
  city: "Riyadh",
  country: "Saudi Arabia",
  daysRemaining: 30,
  contactPerson: "Dr. Salma Abdullah",
  contactEmail: "care@kingshospital.sa",
  contactPhone: "+966 11 234 5678",
  keyDetailsLeft: [
    { label: "Choose Order Post Validity Time", value: "30 Days" },
    { label: "Order Title", value: "Kings Medical Hospital" },
    { label: "Device / Service Type", value: "Medical Imaging" },
    { label: "Post Validity Time", value: "90 Days" },
    { label: "Rent Value", value: "SAR 250,000" },
    { label: "Rent Period", value: "6 Months" },
  ],
  keyDetailsRight: [
    { label: "Contact Person Email", value: "procurement@kingshospital.sa" },
    { label: "Device Name", value: "Siemens MAGNETOM" },
    { label: "FDA Number", value: "FDA1234567" },
    { label: "Device Approval Number", value: "APP-99812" },
    { label: "Security Deposit", value: "SAR 50,000" },
    { label: "Maintenance", value: "Included" },
  ],
  terms:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  damageNotes:
    "Any damaged equipment must be reported within 24 hours to avoid additional charges. Regular maintenance is provided by the vendor.",
  mapNote: "Riyadh Medical Center, 123 Healthcare Avenue, Riyadh, RD 10001",
};

const RentalServiceDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams<{ orderId: string }>();
  const incomingState = location.state as RentalServiceDetailState | undefined;

  const detail = useMemo<RentalServiceDetailState>(() => {
    if (incomingState) {
      return incomingState;
    }
    if (orderId) {
      const numericId = Number(orderId);
      return {
        ...FALLBACK_DETAIL,
        order: {
          ...FALLBACK_DETAIL.order,
          id: Number.isNaN(numericId) ? FALLBACK_DETAIL.order.id : numericId,
          orderNo: `#${(numericId || FALLBACK_DETAIL.order.id).toString().padStart(4, "0")}`,
        },
      };
    }
    return FALLBACK_DETAIL;
  }, [incomingState, orderId]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [decision, setDecision] = useState<Status | null>(null);

  const gallery = detail.gallery.length > 0 ? detail.gallery : FALLBACK_DETAIL.gallery;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % gallery.length);
  };

  const handleDecision = (status: Status) => {
    setDecision(status);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-16">
        <section className="space-y-8 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-helveticaBold text-primary">{detail.order.orderTitle}</h1>
              <p className="text-sm text-gray-500">
                {detail.order.city}, {detail.order.country}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold text-emerald-600">
                {detail.daysRemaining} Days Left
              </span>
              <button
                type="button"
                className="rounded-full border border-gray-200 px-6 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          </header>

          {decision && (
            <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
              Order has been marked as {decision}.
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="relative overflow-hidden rounded-[32px] border border-gray-200">
              <img src={gallery[activeIndex]} alt="Facility" className="h-80 w-full object-cover" />
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-primary shadow"
                    onClick={handlePrev}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label="Next"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-primary shadow"
                    onClick={handleNext}
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            <div className="grid gap-3">
              {detail.secondaryImages.slice(0, 4).map((image) => (
                <div key={image} className="overflow-hidden rounded-3xl border border-gray-200">
                  <img src={image} alt="Secondary" className="h-24 w-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-5">
              <h2 className="text-lg font-helveticaBold text-primary">Key Details</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <DetailList title="Key Details" entries={detail.keyDetailsLeft} />
                <DetailList title="Additional Information" entries={detail.keyDetailsRight} />
                <DetailList
                  title="Contact"
                  entries={[
                    { label: "Contact Person", value: detail.contactPerson },
                    { label: "Email", value: detail.contactEmail },
                    { label: "Phone", value: detail.contactPhone },
                  ]}
                />
                <DetailList
                  title="Order"
                  entries={[
                    { label: "Order Number", value: detail.order.orderNo },
                    { label: "Status", value: detail.order.status },
                    { label: "Region", value: detail.order.region },
                  ]}
                />
              </div>
              <div className="space-y-4 rounded-3xl border border-gray-200 bg-[#f7f8fd] px-6 py-5">
                <h3 className="text-sm font-helveticaBold text-primary">Terms & Conditions</h3>
                <p className="text-sm text-gray-600">{detail.terms}</p>
              </div>
              <div className="space-y-4 rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5">
                <h3 className="text-sm font-helveticaBold text-rose-600">Damaged Equipment</h3>
                <p className="text-sm text-rose-600">{detail.damageNotes}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-[32px] border border-gray-200 bg-[#f7f8fd] px-6 py-5">
                <h3 className="text-sm font-helveticaBold text-primary">Location</h3>
                <p className="mt-2 text-sm text-gray-600">{detail.mapNote}</p>
                <div className="mt-4 h-56 rounded-2xl border border-gray-200 bg-[linear-gradient(135deg,#f4f5fb_0%,#e0e3f0_100%)] text-center text-sm text-gray-400">
                  <span className="inline-block translate-y-24">Map preview placeholder</span>
                </div>
                <button className="mt-4 w-full rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#030447]">
                  Redirect to location
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              className="rounded-full border border-gray-300 px-10 py-3 text-sm font-semibold text-gray-500 transition hover:border-primary hover:text-primary"
              onClick={() => handleDecision("Rejected")}
            >
              Reject
            </button>
            <button
              type="button"
              className="rounded-full bg-primary px-10 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#030447]"
              onClick={() => handleDecision("Approved")}
            >
              Approve
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

const DetailList = ({
  title,
  entries,
}: {
  title: string;
  entries: Array<{ label: string; value: string }>;
}) => (
  <div className="space-y-3 rounded-3xl border border-gray-200 bg-white px-6 py-5">
    <h3 className="text-sm font-helveticaBold text-primary">{title}</h3>
    <ul className="space-y-2 text-sm text-gray-600">
      {entries.map(({ label, value }) => (
        <li key={label}>
          <span className="font-semibold text-primary">{label}:</span> {value}
        </li>
      ))}
    </ul>
  </div>
);

export default RentalServiceDetail;




