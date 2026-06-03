import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useController } from "./core/requests";
import type { Lease } from "./core/type";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  Home,
  MapPin,
  CalendarDays,
  CalendarCheck,
  FileText,
  Building2,
  Hash,
  User,
} from "lucide-react";

const unitStatusConfig: Record<string, { label: string; className: string }> = {
  OCCUPIED: { label: "Occupied", className: "bg-emerald-50 text-emerald-700 border border-emerald-200/60" },
  VACANT: { label: "Vacant", className: "bg-zinc-50 text-zinc-500 border border-zinc-200" },
  UNDER_MAINTENANCE: {
    label: "Under Maintenance",
    className: "bg-rose-50 text-rose-600 border border-rose-200/60",
  },
};

const leaseStatusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-sky-50 text-sky-700 border border-sky-200/60" },
  EXPIRED: { label: "Expired", className: "bg-zinc-50 text-zinc-500 border border-zinc-200" },
  TERMINATED: { label: "Terminated", className: "bg-rose-50 text-rose-600 border border-rose-200/60" },
};

const Badge = ({
  status,
  config,
}: {
  status: string;
  config: Record<string, { label: string; className: string }>;
}) => {
  const match = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${match?.className ?? "bg-zinc-50 text-zinc-500 border border-zinc-200"}`}
    >
      {match?.label ?? status}
    </span>
  );
};

const MetricCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white rounded-2xl px-5 py-4 border border-zinc-200">
    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5">
      {label}
    </p>
    <p className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>
  </div>
);

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-zinc-50 last:border-0">
    <div className="mt-0.5 w-7 h-7 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-200">
      <Icon className="w-3.5 h-3.5 text-zinc-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-zinc-400 font-medium mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-zinc-800 leading-snug">{value}</p>
    </div>
  </div>
);

const UnitPage = () => {
  const { user } = useAuth();
  if (!user) return null;

  const controller = useController();
  const [data, setData] = useState<Lease | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await controller.viewUnit();
      if (!res) return;
      setData(res.data);
    };
    load();
  }, []);

  if (!data) return null;

  const hasPhotos = data.unit.property.photos?.length > 0;

  return (
    <div className="bg-white rounded-3xl max-w-4xl mx-auto px-8 py-8 border border-zinc-200 space-y-8">
        {/* Photo / Hero */}
        {hasPhotos ? (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="w-full h-[400px] rounded-2xl overflow-hidden shadow-inner"
          >
            {data.unit.property.photos.map((photo, index) => (
              <SwiperSlide key={index}>
                <img
                  src={`${import.meta.env.VITE_STORAGE_URL}/${photo}`}
                  alt={`photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-[400px] bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center border border-zinc-200/60">
              <Home className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="text-sm text-zinc-400 font-medium">
              No photos available
            </p>
          </div>
        )}

        {/* Title + Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              {data.unit.property.name}
            </h1>
            <p className="text-md font-medium text-zinc-400 mt-1">
              {data.unit.unit_number}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge status={data.unit.status} config={unitStatusConfig} />
            <Badge status={data.status} config={leaseStatusConfig} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Monthly Rent"
            value={`₱${Number(data.monthly_rent).toLocaleString()}`}
          />
          <MetricCard
            label="Deposit Amount"
            value={`₱${Number(data.deposit_amount).toLocaleString()}`}
          />
          <MetricCard label="Unit Designated" value={data.unit.unit_number} />
        </div>

        {/* Details Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Details */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
              Property Details
            </p>
            <div className="space-y-1">
              <DetailRow
                icon={Building2}
                label="Property Name"
                value={data.unit.property.name}
              />
              <DetailRow
                icon={MapPin}
                label="Address"
                value={`${data.unit.property.address}, ${data.unit.property.city}`}
              />
              <div className="flex items-start gap-3 py-3 border-b border-zinc-50 last:border-0">
                <div className="mt-0.5 w-7 h-7 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-200">
                  <Home className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-zinc-400 font-medium mb-1.5">Unit Status</p>
                  <Badge status={data.unit.status} config={unitStatusConfig} />
                </div>
              </div>
              <DetailRow
                icon={User}
                label="Landlord"
                value={data.unit.property.landlord.name}
              />
            </div>
          </div>

          {/* Lease Summary */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
              Lease Summary
            </p>
            <div className="space-y-1">
              <DetailRow
                icon={Hash}
                label="Unit Number"
                value={data.unit.unit_number}
              />
              <div className="flex items-start gap-3 py-3 border-b border-zinc-50 last:border-0">
                <div className="mt-0.5 w-7 h-7 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-200">
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-zinc-400 font-medium mb-1.5">Lease Status</p>
                  <Badge status={data.status} config={leaseStatusConfig} />
                </div>
              </div>
              <DetailRow
                icon={CalendarDays}
                label="Lease Start"
                value={data.formatted_start_date}
              />
              <DetailRow
                icon={CalendarCheck}
                label="Lease End"
                value={data.formatted_end_date || "—"}
              />
            </div>
          </div>
        </div>

        {/* Landlord Notes */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200">
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
            Landlord Notes
          </p>
          <div className="p-3.5 bg-zinc-50/60 rounded-xl border border-zinc-200">
            <p className="text-sm text-zinc-600 font-medium leading-relaxed">
              {data.landlord_notes || "No notes available for this unit."}
            </p>
          </div>
        </div>
      </div>
  );
};

export default UnitPage;