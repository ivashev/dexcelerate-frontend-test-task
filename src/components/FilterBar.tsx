import { useState } from "react";

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
  currentFilters?: any;
}

const volumeOptions: { value: number | null; label: string }[] = [
  { value: null, label: "Any" },
  { value: 1000, label: ">$1K" },
  { value: 5000, label: ">$5K" },
  { value: 10000, label: ">$10K" },
  { value: 50000, label: ">$50K" },
  { value: 100000, label: ">$100K" },
  { value: 250000, label: ">$250K" },
  { value: 500000, label: ">$500K" },
  { value: 1000000, label: ">$1M" },
];

const ageOptions: { value: number | null; label: string }[] = [
  { value: null, label: "Any" },
  { value: 1, label: "1 hour" },
  { value: 3, label: "3 hours" },
  { value: 6, label: "6 hours" },
  { value: 12, label: "12 hours" },
  { value: 24, label: "24 hours" },
  { value: 24 * 3, label: "3 days" },
  { value: 24 * 7, label: "7 days" },
];


const FilterBar = ({ onFilterChange, currentFilters }: FilterBarProps) => {
  const [localFilters, setLocalFilters] = useState({
    minVol24H: currentFilters?.minVol24H || null,
    maxAge: currentFilters?.maxAge || null,
    isNotHP: currentFilters?.isNotHP !== false,
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-dex-dark px-6 py-4 border-b border-dex-border">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-dex-text whitespace-nowrap">Volume</label>
          <select
            value={localFilters.minVol24H || ""}
            onChange={(e) => handleFilterChange('minVol24H', e.target.value ? Number(e.target.value) : null)}
            className="bg-dex-secondary border border-dex-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-dex-text focus:ring-1 focus:ring-dex-text min-w-[140px] appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUgNmw1IDUgNS01IDIgMS03IDctNy03IDItMXoiIGZpbGw9IiM2NjYiLz48L3N2Zz4=')] bg-no-repeat bg-[right_8px_center] pr-8"
          >
            {volumeOptions.map((option) => (
              <option key={option.value} value={option.value || ""}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-dex-text whitespace-nowrap">Age</label>
          <select
            value={localFilters.maxAge || ""}
            onChange={(e) => handleFilterChange('maxAge', e.target.value ? Number(e.target.value) : null)}
            className="bg-dex-secondary border border-dex-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-dex-text focus:ring-1 focus:ring-dex-text min-w-[140px] appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUgNmw1IDUgNS01IDIgMS03IDctNy03IDItMXoiIGZpbGw9IiM2NjYiLz48L3N2Zz4=')] bg-no-repeat bg-[right_8px_center] pr-8"
          >
            {ageOptions.map((option) => (
              <option key={option.value} value={option.value || ""}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <label className="flex items-center space-x-2 text-sm text-dex-text">
            <input
              type="checkbox"
              checked={localFilters.isNotHP}
              onChange={(e) => handleFilterChange('isNotHP', e.target.checked)}
              className="w-4 h-4 text-dex-success bg-dex-secondary border-dex-border rounded focus:ring-dex-text"
            />
            <span>Exclude Honeypots</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
