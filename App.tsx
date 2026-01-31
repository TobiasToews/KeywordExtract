
import React, { useState, useCallback, useEffect } from 'react';
import { ViewState, Paper, AnalysisResult, PromptTemplate } from './types';
import { PROMPT_TEMPLATES } from './constants';
import { extractTextFromPdf } from './services/pdfService';
import { runAnalysis } from './services/geminiService';

// Components
const SidebarItem = ({ 
  label, 
  active, 
  onClick, 
  icon 
}: { 
  label: string; 
  active: boolean; 
  onClick: () => void;
  icon: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-slate-600 hover:bg-slate-200'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.Dashboard);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setError(null);
    const newPapers: Paper[] = [];

    // Fix: Explicitly cast Array.from(files) to File[] to resolve 'unknown' type errors during iteration
    for (const file of Array.from(files) as File[]) {
      try {
        const text = await extractTextFromPdf(file);
        newPapers.push({
          id: Math.random().toString(36).substr(2, 9),
          fileName: file.name,
          fullText: text,
          status: 'idle'
        });
      } catch (err) {
        console.error("Failed to parse PDF:", file.name, err);
        setError(`Failed to parse ${file.name}. Ensure it is a valid PDF.`);
      }
    }

    setPapers(prev => [...prev, ...newPapers]);
  };

  const runBatchAnalysis = async (templateId: string) => {
    const template = PROMPT_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    setIsProcessing(true);
    setError(null);

    const pendingPapers = papers.filter(p => p.status !== 'completed');
    
    for (const paper of pendingPapers) {
      try {
        setPapers(prev => prev.map(p => p.id === paper.id ? { ...p, status: 'processing' } : p));
        const result = await runAnalysis(template, paper.fullText, paper.id);
        setResults(prev => [...prev, result]);
        setPapers(prev => prev.map(p => p.id === paper.id ? { ...p, status: 'completed' } : p));
      } catch (err: any) {
        console.error("Analysis failed:", err);
        setPapers(prev => prev.map(p => p.id === paper.id ? { ...p, status: 'error' } : p));
        setError(`Analysis failed for ${paper.fileName}: ${err.message}`);
      }
    }
    setIsProcessing(false);
    setView(ViewState.Results);
  };

  const exportToJsonl = () => {
    const jsonl = results.map(r => JSON.stringify(r)).join('\n');
    const blob = new Blob([jsonl], { type: 'application/jsonl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extraction_results_${new Date().toISOString().slice(0,10)}.jsonl`;
    a.click();
  };

  const exportToCsv = () => {
    const headers = ['Paper ID', 'Prompt ID', 'Keyword', 'Quote', 'Model', 'Timestamp'];
    const rows = results.flatMap(res => 
      res.parsedItems.map(item => [
        res.paperId,
        res.promptId,
        item.keyword,
        `"${item.quote.replace(/"/g, '""')}"`,
        res.model,
        res.timestamp
      ])
    );

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extraction_results_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col space-y-8 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <h1 className="text-xl font-bold tracking-tight">AffordanceFlow</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem 
            label="Dashboard" 
            active={view === ViewState.Dashboard} 
            onClick={() => setView(ViewState.Dashboard)}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
          />
          <SidebarItem 
            label="Paper Vault" 
            active={view === ViewState.Papers} 
            onClick={() => setView(ViewState.Papers)}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
          <SidebarItem 
            label="Prompt Library" 
            active={view === ViewState.Prompts} 
            onClick={() => setView(ViewState.Prompts)}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
          />
          <SidebarItem 
            label="Results & Export" 
            active={view === ViewState.Results} 
            onClick={() => setView(ViewState.Results)}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
        </nav>

        <div className="pt-4 border-t border-slate-200">
           <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">System Status</div>
           <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></div>
              <span className="text-sm text-slate-600">{isProcessing ? 'Processing Batch...' : 'All Quiet'}</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-16 border-b border-slate-200 px-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">{view}</h2>
          {isProcessing && (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-slate-500 italic">Gemini 3 Flash is thinking...</span>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <span>{error}</span>
            </div>
          )}

          {view === ViewState.Dashboard && (
            <div className="space-y-8 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-sm font-medium text-slate-500 mb-1">Total Papers</div>
                  <div className="text-3xl font-bold">{papers.length}</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-sm font-medium text-slate-500 mb-1">Prompts Available</div>
                  <div className="text-3xl font-bold">{PROMPT_TEMPLATES.length}</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-sm font-medium text-slate-500 mb-1">Extracted Items</div>
                  <div className="text-3xl font-bold">{results.reduce((acc, r) => acc + r.parsedItems.length, 0)}</div>
                </div>
              </div>

              <section className="bg-blue-600 rounded-2xl p-8 text-white shadow-xl shadow-blue-200">
                <h3 className="text-2xl font-bold mb-4">Start New Batch Extraction</h3>
                <p className="mb-6 opacity-90 max-w-2xl">Upload your research papers and select a prompt template to begin the automated extraction pipeline.</p>
                <div className="flex flex-wrap gap-4">
                  <label className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors cursor-pointer inline-flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    <span>Upload PDFs</span>
                    <input type="file" multiple accept=".pdf" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <button 
                    disabled={papers.length === 0 || isProcessing}
                    onClick={() => setView(ViewState.Prompts)}
                    className="bg-blue-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <span>Configure Prompts</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </section>
            </div>
          )}

          {view === ViewState.Papers && (
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Loaded Papers</h3>
                <label className="text-blue-600 font-medium hover:underline cursor-pointer">
                  + Add More
                  <input type="file" multiple accept=".pdf" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Filename</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Text Extraction</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {papers.map(paper => (
                      <tr key={paper.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-700">{paper.fileName}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {paper.fullText.length > 0 ? `${(paper.fullText.length / 1000).toFixed(1)}k chars` : 'Processing...'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            paper.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            paper.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                            paper.status === 'error' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {paper.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {papers.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">No papers uploaded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === ViewState.Prompts && (
            <div className="max-w-5xl mx-auto">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-800">Hard-Coded Prompt Templates</h3>
                <p className="text-slate-500">Select a template to run against all pending papers.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROMPT_TEMPLATES.map(template => (
                  <div key={template.id} className="p-6 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors bg-white shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900">{template.name}</h4>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">ID: {template.id} (v{template.version})</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3">{template.system}</p>
                    <button 
                      onClick={() => runBatchAnalysis(template.id)}
                      disabled={isProcessing || papers.length === 0}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Run Template on Batch
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === ViewState.Results && (
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Extracted Dataset</h3>
                  <p className="text-sm text-slate-500">Structured data from {results.length} papers.</p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={exportToJsonl} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>JSONL</span>
                  </button>
                  <button onClick={exportToCsv} className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-black font-medium flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {results.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                   <p className="text-slate-400">No results found yet. Run an analysis batch to see data here.</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {results.map((res, i) => {
                    const paper = papers.find(p => p.id === res.paperId);
                    return (
                      <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                          <h4 className="font-bold text-slate-900 truncate pr-4">{paper?.fileName || 'Unknown Paper'}</h4>
                          <span className="shrink-0 text-xs font-mono text-slate-500">{res.model}</span>
                        </div>
                        <div className="p-6">
                           {res.errors && res.errors.length > 0 && (
                             <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg">
                               <p className="font-bold mb-1">Parsing Anomalies Detected:</p>
                               <ul className="list-disc pl-4">
                                 {res.errors.map((err, idx) => <li key={idx}>{err}</li>)}
                               </ul>
                             </div>
                           )}
                           <div className="grid grid-cols-1 gap-4">
                             {res.parsedItems.map((item, idx) => (
                               <div key={idx} className="flex flex-col md:flex-row md:items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                 <div className="md:w-1/4 shrink-0">
                                   <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Keyword</div>
                                   <div className="font-bold text-blue-700">{item.keyword}</div>
                                 </div>
                                 <div className="flex-1">
                                   <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Verbatim Quote</div>
                                   <div className="text-slate-700 italic font-serif leading-relaxed">
                                      &ldquo;{item.quote}&rdquo;
                                   </div>
                                 </div>
                               </div>
                             ))}
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
