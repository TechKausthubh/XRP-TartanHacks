interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const color = status === "tesSUCCESS" ? "bg-green-600" : "bg-red-600";
  return (
    <span className={`${color} text-white text-xs px-2 py-1 rounded-full`}>
      {status}
    </span>
  );
}
