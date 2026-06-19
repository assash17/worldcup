"use client";

interface Tab<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[];
  active: T;
  onChange: (id: T) => void;
  compact?: boolean;
}

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  compact = false,
}: TabsProps<T>) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-t-md px-3 font-medium transition ${
            compact ? "py-1 text-xs" : "py-2 text-sm"
          } ${
            active === tab.id
              ? "bg-[var(--wc-green)] text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
