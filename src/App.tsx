import { useState } from 'react';
import { Bot, Key, PlayCircle, Loader2, AlertCircle } from 'lucide-react';
import { TreeEditor } from './features/scanner/components/TreeEditor';
import { useProjectAnalysis } from './features/analysis/hooks/useProjectAnalysis';
import { ResultDashboard } from './features/analysis/components/ResultDashboard'; // <--- Import Dashboard
import { cn } from './lib/utils';

function App() {
  const [treeInput, setTreeInput] = useState('');
  const [apiKey, setApiKey] = useState(''); // Simpan API Key di state sementara
  
  // Panggil hook logic AI
  const { runAnalysis, loading, error, data } = useProjectAnalysis();

  const handleScan = () => {
    runAnalysis(treeInput, apiKey);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">AI Project Scanner</h1>
        </div>

        {/* API Key Input (Simple Version) */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200">
          <Key className="w-4 h-4 text-gray-500" />
          <input 
            type="password"
            placeholder="Paste Gemini API Key..."
            className="bg-transparent text-sm focus:outline-none w-64"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
      </header>

      {/* Main Content: Split View */}
      <main className="flex-1 container mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Input Area */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-[calc(100vh-140px)]">
          <div className="bg-white rounded-xl shadow-sm border p-4 flex-1 flex flex-col overflow-hidden">
            <TreeEditor value={treeInput} onChange={setTreeInput} />
          </div>
          
          <button
            onClick={handleScan}
            disabled={loading || !treeInput || !apiKey}
            className={cn(
              "flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-all",
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Architecture...
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                Scan Project
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-200 animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Right Panel: Result Area */}
        <div className="lg:col-span-7 h-[calc(100vh-140px)]">
          {!data ? (
            // State Kosong (Placeholder)
            <div className="bg-white rounded-xl shadow-sm border h-full p-6 flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center animate-pulse">
                <Bot className="w-8 h-8 text-gray-300" />
              </div>
              <p>Paste your project tree & hit Scan to see the magic.</p>
            </div>
          ) : (
            // State Sukses (Dashboard)
            <ResultDashboard data={data} />
          )}
        </div>

      </main>
    </div>
  );
}

export default App;