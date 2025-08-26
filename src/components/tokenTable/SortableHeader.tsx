import { ChevronUp, ChevronDown } from "lucide-react";
import type { SortConfig } from "./utils.tsx";

interface SortableHeaderProps {
  label: string;
  sortKey: SortConfig['key'];
  currentSort: SortConfig | null;
  onSort: (key: string, direction: 'asc' | 'desc') => void;
  width: number;
}

const SortableHeader = ({ label, sortKey, currentSort, onSort, width }: SortableHeaderProps)=> {
  const isActive = currentSort?.key === sortKey;
  const direction = isActive ? currentSort.direction : null;

  const handleSort = () => {
    if (!sortKey) return;
    
    let newDirection: 'asc' | 'desc' = 'desc';

    if (isActive) {
      newDirection = direction === 'desc' ? 'asc' : 'desc';
    }
    
    onSort(sortKey, newDirection);
  };

  return (
    <th 
      className={`px-6 py-3 font-medium transition-colors select-none ${
        sortKey ? 'cursor-pointer hover:bg-dex-secondary/50' : ''
      }`}
      style={{ 
        width,
        minWidth: width,
        maxWidth: width,
        overflow: 'hidden'
      }}
      onClick={handleSort}
    >
      <div className="flex items-center space-x-1">
        <span className="text-dex-text text-nowrap">{label}</span>
        {
          Boolean(sortKey) && (
              <div className="flex flex-col">
                <ChevronUp className={`w-3 h-3 ${direction === 'asc' ? 'text-white' : 'text-dex-text'}`} />
                <ChevronDown className={`w-3 h-3 ${direction === 'desc' ? 'text-white' : 'text-dex-text'}`} />
              </div>
          )
        }
      </div>
    </th>
  );
}

export default SortableHeader
