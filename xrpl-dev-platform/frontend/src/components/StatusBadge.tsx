interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const isSuccess = status === "tesSUCCESS";
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${
        isSuccess
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          : "bg-red-500/20 text-red-400 border border-red-500/30"
      }`}
    >
      {status}
    </span>
  );
}
