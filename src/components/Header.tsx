import { Eye } from "lucide-react";

interface HeaderProps {
  activeTab: "trending" | "new";
  onTabChange: (tab: "trending" | "new") => void;
}

const Header = ({ activeTab, onTabChange }: HeaderProps)=> {
  return (
    <header className="bg-dex-secondary border-b border-dex-border">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-4 bg-dex-dark px-4 py-2 rounded-lg">
                <Eye className="w-4 h-4 text-white" />
                <span className="text-white font-medium">Scanner</span>
              </div>
              

              <div className="flex items-center space-x-1 bg-dex-secondary rounded px-1 py-1">
                <button
                  onClick={() => onTabChange("trending")}
                  className={`cursor-pointer px-3 py-1 text-sm rounded transition-colors ${
                    activeTab === "trending" 
                      ? "text-white bg-dex-dark" 
                      : "text-dex-text hover:text-white"
                  }`}
                >
                  Trending
                </button>
                <button
                  onClick={() => onTabChange("new")}
                  className={`cursor-pointer px-3 py-1 text-sm rounded transition-colors ${
                    activeTab === "new" 
                      ? "text-white bg-dex-dark" 
                      : "text-dex-text hover:text-white"
                  }`}
                >
                  New
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
