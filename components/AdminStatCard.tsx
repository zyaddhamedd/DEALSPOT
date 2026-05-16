type AdminStatCardProps = {
  label: string;
  value: string;
  helper: string;
};

export function AdminStatCard({ label, value, helper }: AdminStatCardProps) {
  return (
    <div className="panel p-6">
      <p className="text-sm text-white/55">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-white/45">{helper}</p>
    </div>
  );
}
