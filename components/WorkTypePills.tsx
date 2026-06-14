"use client";

import { workTypes } from "@/lib/mockData";

type Props = {
  selected: string | null;
  onSelect: (id: string) => void;
};

/** Tappable work-type pills in a single, thumb-friendly grid. */
export default function WorkTypePills({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {workTypes.map((type) => {
        const active = selected === type.id;
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onSelect(type.id)}
            className={`pill ${active ? "pill-active" : "pill-idle"}`}
          >
            <span className="text-lg">{type.icon}</span>
            <span>{type.label}</span>
          </button>
        );
      })}
    </div>
  );
}
