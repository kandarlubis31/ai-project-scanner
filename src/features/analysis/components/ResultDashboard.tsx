import { useState } from 'react';
import type { AnalysisResult } from '@/features/analysis/schema'; // <--- PERBAIKAN: Tambah 'type' disini
import { Layers, FileCode, Lightbulb, FileText, Check, Copy, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultDashboardProps {
  data: AnalysisResult;
}

type TabType = 'overview' | 'roles' | 'suggestions' | 'readme';

export function ResultDashboard({ data }: ResultDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copied, setCopied] = useState(false);

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(data.readmeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b bg-gray-50/50">
        <TabButton 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')} 
          icon={<Layers className="w-4 h-4" />} 
          label="Overview" 
        />
        <TabButton 
          active={activeTab === 'roles'} 
          onClick={() => setActiveTab('roles')} 
          icon={<FileCode className="w-4 h-4" />} 
          label="File Roles" 
        />
        <TabButton 
          active={activeTab === 'suggestions'} 
          onClick={() => setActiveTab('suggestions')} 
          icon={<Lightbulb className="w-4 h-4" />} 
          label="Suggestions" 
        />
        <TabButton 
          active={activeTab === 'readme'} 
          onClick={() => setActiveTab('readme')} 
          icon={<FileText className="w-4 h-4" />} 
          label="README.md" 
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-white">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{data.overview.projectName}</h2>
              <p className="text-gray-500 mt-1">{data.overview.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard label="Framework" value={data.overview.framework} />
              <InfoCard label="Language" value={data.overview.language} />
              <InfoCard label="Architecture" value={data.overview.architectureType} />
            </div>
          </div>
        )}

        {/* TAB 2: FILE ROLES */}
        {activeTab === 'roles' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold text-gray-800">Architectural Breakdown</h3>
            <div className="grid gap-3">
              {data.fileRoles.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                  <div className={cn(
                    "px-2 py-1 rounded text-xs font-mono font-medium border",
                    item.role === 'UI' && "bg-purple-100 text-purple-700 border-purple-200",
                    item.role === 'Logic' && "bg-blue-100 text-blue-700 border-blue-200",
                    item.role === 'Config' && "bg-gray-100 text-gray-700 border-gray-200",
                    item.role === 'Data' && "bg-green-100 text-green-700 border-green-200",
                    // Fallback style
                    !['UI', 'Logic', 'Config', 'Data'].includes(item.role) && "bg-gray-100 text-gray-700 border-gray-200"
                  )}>
                    {item.role}
                  </div>
                  <div>
                    <p className="font-mono text-sm font-semibold text-gray-700">{item.path}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SUGGESTIONS */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4 animate-in fade-in duration-300">
             <h3 className="text-lg font-semibold text-gray-800">Reviewer Suggestions</h3>
             <div className="grid gap-4">
                {data.suggestions.map((sug, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {sug.type === 'Security' ? <ShieldCheck className="w-4 h-4 text-green-600"/> : <AlertTriangle className="w-4 h-4 text-amber-500"/>}
                        <span className="font-semibold text-gray-800">{sug.title}</span>
                      </div>
                      <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded-full",
                        sug.impact === 'High' ? "bg-red-100 text-red-700" :
                        sug.impact === 'Medium' ? "bg-amber-100 text-amber-700" :
                        "bg-blue-100 text-blue-700"
                      )}>
                        {sug.impact} Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{sug.description}</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB 4: README */}
        {activeTab === 'readme' && (
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Generated README</h3>
              <button 
                onClick={handleCopyReadme}
                className="flex items-center gap-2 text-xs font-medium bg-gray-900 text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy Markdown"}
              </button>
            </div>
            <textarea 
              readOnly 
              className="flex-1 w-full p-4 font-mono text-sm bg-gray-50 text-gray-800 rounded-lg border focus:outline-none resize-none"
              value={data.readmeContent}
            />
          </div>
        )}

      </div>
    </div>
  );
}

// Helper Components
function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2",
        active 
          ? "border-blue-600 text-blue-600 bg-blue-50/50" 
          : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}