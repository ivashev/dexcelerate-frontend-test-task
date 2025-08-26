import type { TokenData } from "../../types/scanner.ts";

interface AuditIndicatorsProps {
  audit: TokenData["audit"];
}

export default function AuditIndicators({ audit }: AuditIndicatorsProps){
  const indicators = [
    { 
      key: "verified", 
      value: audit.contractVerified, 
      label: "Verified"
    },
    { 
      key: "mintable", 
      value: !audit.mintable, 
      label: "Mint"
    },
    { 
      key: "freezable", 
      value: !audit.freezable, 
      label: "Freeze"
    },
    { 
      key: "honeypot", 
      value: audit.honeypot, 
      label: "HP"
    },
  ];

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-center space-x-3" data-testid="audit-indicators">
        {indicators.map(({ key, value, label }) => (
          <div key={key} className="flex flex-col items-center space-y-1">
            <div
              className={`w-3 h-3 rounded-full ${
                value ? "bg-green-500" : "bg-red-500"
              }`}
              data-testid={`audit-${key}`}
            />
            <span className="text-xs text-dex-text">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
