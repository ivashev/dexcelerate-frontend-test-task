import type { SupportedChainName } from "../types/test-task-types.ts";

interface ChainTabsProps {
  selectedChain: SupportedChainName | null;
  onChainSelect: (chain: SupportedChainName | null) => void;
}

const chains: Array<{ name: SupportedChainName | null; label: string; colorClass?: string }> = [
  { name: null, label: "All Chains" },
  { name: "ETH", label: "ETH", colorClass: "bg-blue-500" },
  { name: "SOL", label: "SOL", colorClass: "bg-purple-500" },
  { name: "BASE", label: "BASE", colorClass: "bg-blue-600" },
  { name: "BSC", label: "BSC", colorClass: "bg-yellow-500" },
];

const ChainTabs = ({ selectedChain, onChainSelect }: ChainTabsProps)=> {

  return (
    <div className="bg-dex-dark px-6 py-4 border-b border-dex-border">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          {chains.map((chain) => {
            const isSelected = selectedChain === chain.name;
            const baseClasses = "px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors";
            
            if (chain.name === null) {
              return (
                <button
                  key="all"
                  onClick={() => onChainSelect(null)}
                  className={`${baseClasses} ${
                    isSelected
                      ? "bg-gray-600 text-white"
                      : "text-dex-text hover:text-white"
                  }`}
                >
                  {chain.label}
                </button>
              );
            }

            return (
              <button
                key={chain.name}
                onClick={() => onChainSelect(chain.name)}
                className={`${baseClasses} flex items-center space-x-1 ${
                  isSelected
                    ? "bg-gray-600 text-white"
                    : "text-dex-text hover:text-white"
                }`}
              >
                {chain.colorClass && (
                  <div className={`w-3 h-3 ${chain.colorClass} rounded-full`} />
                )}
                <span>{chain.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ChainTabs;
