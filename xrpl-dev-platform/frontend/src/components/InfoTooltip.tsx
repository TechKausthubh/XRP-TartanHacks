import { useState, useRef, useEffect } from "react";

interface Props {
  title: string;
  content: string;
}

export default function InfoTooltip({ title, content }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="ml-1.5 text-gray-500 hover:text-xrpl-accent focus:outline-none"
        title={title}
        aria-label={title}
      >
        <span className="text-sm font-mono border border-current rounded-full w-4 h-4 inline-flex items-center justify-center leading-none">?</span>
      </button>
      {open && (
        <div className="absolute left-6 top-0 z-10 w-72 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl text-left">
          <p className="text-xs font-semibold text-white mb-1">{title}</p>
          <p className="text-xs text-gray-400">{content}</p>
        </div>
      )}
    </div>
  );
}
