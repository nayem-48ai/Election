
import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from '../firebase';
import { AppUser, ResultCollection, StudentResult } from '../types';
import { Upload, Trash2, Eye, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, Database, Table, Plus, ChevronDown, X, Search, Download } from 'lucide-react';
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs';

const YEAR_OPTIONS = ["2023", "2024", "2025", "2026", "2027"];
const CLASS_OPTIONS = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const EXAM_OPTIONS = [
  "First Terminal", 
  "Second Terminal", 
  "Mid-term Examination", 
  "Final Examination", 
  "Unit Test 1", 
  "Unit Test 2",
  "Pre-Test",
  "Test Examination"
];

interface AdminDashboardProps {
  user: AppUser;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [resultsList, setResultsList] = useState<ResultCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<ResultCollection | null>(null);
  
  const [year, setYear] = useState('2024');
  const [className, setClassName] = useState('Class 10');
  const [examName, setExamName] = useState('Final Examination');
  const [excelData, setExcelData] = useState<StudentResult[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [uploadMessage, setUploadMessage] = useState({ text: '', type: '' });

  const fetchResults = async () => {
    setLoading(true);
    try {
      const q = collection(db, "results");
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as ResultCollection));
      setResultsList(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchResults();
    }
  }, [activeTab]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws) as StudentResult[];
      const sheetHeaders = XLSX.utils.sheet_to_json(ws, { header: 1 })[0] as string[];
      setExcelData(data);
      setHeaders(sheetHeaders);
      setUploadMessage({ text: `Parsed ${data.length} records successfully.`, type: 'info' });
    };
    reader.readAsBinaryString(file);
  };

  const handleSaveToFirestore = async () => {
    if (excelData.length === 0) return;
    setLoading(true);
    try {
      const docId = `${year}_${className}_${examName}`;
      await setDoc(doc(db, "results", docId), {
        year,
        className,
        examName,
        data: excelData,
        headers: headers,
        createdAt: serverTimestamp(),
      });
      setUploadMessage({ text: `Success! ${docId} published.`, type: 'success' });
      setExcelData([]);
      if (activeTab === 'manage') fetchResults();
    } catch (err: any) {
      setUploadMessage({ text: `Upload failed: ${err.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete ${id}?`)) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "results", id));
      fetchResults();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getOrderedHeaders = (headers: string[] | undefined, data: any[]) => {
    const allKeys = headers || (data[0] ? Object.keys(data[0]) : []);
    const primaryFields = ['Roll No', 'Roll', 'ID', 'Student ID', 'Name', 'Student Name', 'Student'];
    const summaryFields = ['Total', 'Total Marks', 'Percentage', 'Average', 'Avg', 'Grade', 'GPA', 'Result', 'Status'];
    
    return [
      ...allKeys.filter(k => primaryFields.some(p => k.toLowerCase().includes(p.toLowerCase()))),
      ...allKeys.filter(k => !primaryFields.some(p => k.toLowerCase().includes(p.toLowerCase())) && !summaryFields.some(s => k.toLowerCase().includes(s.toLowerCase()))).sort(),
      ...allKeys.filter(k => summaryFields.some(s => k.toLowerCase().includes(s.toLowerCase())))
    ];
  };

  const handleExport = (collection: ResultCollection) => {
    // Apply logical ordering for the exported spreadsheet columns
    const orderedHeaders = getOrderedHeaders(collection.headers, collection.data);
    const ws = XLSX.utils.json_to_sheet(collection.data, { header: orderedHeaders });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, `${collection.id}.xlsx`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl no-print">
      {viewingRecord && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{viewingRecord.examName}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{viewingRecord.year} • {viewingRecord.className} • {viewingRecord.data.length} Students</p>
              </div>
              <button onClick={() => setViewingRecord(null)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-grow overflow-auto p-4 custom-scrollbar">
              <div className="border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-[11px] text-left border-collapse min-w-max">
                  <thead className="bg-slate-100 sticky top-0">
                    <tr>
                      {getOrderedHeaders(viewingRecord.headers, viewingRecord.data).map(key => (
                        <th key={key} className="px-5 py-4 border-b border-r last:border-r-0 font-black text-slate-500 bg-slate-100 uppercase tracking-widest">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingRecord.data.map((row, i) => (
                      <tr key={i} className="hover:bg-blue-50/40 transition-colors">
                        {getOrderedHeaders(viewingRecord.headers, viewingRecord.data).map((key, j) => (
                          <td key={j} className="px-5 py-3 border-r last:border-r-0 whitespace-nowrap text-slate-600 font-bold">{row[key] ?? '-'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Control Panel</h1>
          <p className="text-sm text-slate-500 font-medium">Manage institutional performance data</p>
        </div>
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl backdrop-blur-sm self-start md:self-auto">
          <button onClick={() => setActiveTab('upload')} className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'upload' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>Upload</button>
          <button onClick={() => setActiveTab('manage')} className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>Manage</button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-5">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><Plus className="w-5 h-5 text-blue-600" /> Metadata</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Academic Year</label>
                  <select value={year} onChange={e => setYear(e.target.value)} className="w-full p-4 bg-white rounded-2xl border border-slate-200 outline-none focus:border-blue-500 transition-all text-sm font-bold shadow-sm">
                    {YEAR_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Assigned Class</label>
                  <select value={className} onChange={e => setClassName(e.target.value)} className="w-full p-4 bg-white rounded-2xl border border-slate-200 outline-none focus:border-blue-500 transition-all text-sm font-bold shadow-sm">
                    {CLASS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Exam Category</label>
                  <select value={examName} onChange={e => setExamName(e.target.value)} className="w-full p-4 bg-white rounded-2xl border border-slate-200 outline-none focus:border-blue-500 transition-all text-sm font-bold shadow-sm">
                    {EXAM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
              <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center justify-center gap-2"><FileSpreadsheet className="w-5 h-5 text-green-600" /> File Source</h2>
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 hover:border-blue-400 transition-all cursor-pointer relative group">
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4 group-hover:text-blue-500 transition-colors" />
                <p className="text-xs font-black text-slate-600 uppercase">Drop Excel File</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {uploadMessage.text && (
              <div className={`p-5 rounded-2xl flex items-center gap-4 border shadow-sm ${uploadMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                <CheckCircle2 className="w-6 h-6" />
                <p className="text-xs font-black uppercase tracking-widest">{uploadMessage.text}</p>
              </div>
            )}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col min-h-[500px] overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/30">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Live Preview</h2>
                {excelData.length > 0 && <button onClick={handleSaveToFirestore} disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50">{loading ? 'Publishing...' : 'Publish Dataset'}</button>}
              </div>
              <div className="p-6 flex-grow overflow-auto custom-scrollbar">
                {excelData.length > 0 ? (
                  <div className="border rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-[10px] text-left min-w-max border-collapse">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>{getOrderedHeaders(headers, excelData).map(key => <th key={key} className="px-5 py-3 border-b border-r bg-slate-50 font-black uppercase tracking-tight text-slate-400">{key}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">{excelData.map((row, i) => <tr key={i} className="hover:bg-slate-50 transition-colors">{getOrderedHeaders(headers, excelData).map((key, j) => <td key={j} className="px-5 py-2 border-r text-slate-600 font-bold">{row[key] ?? '-'}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                ) : <div className="h-full flex flex-col items-center justify-center text-slate-400 italic py-20 text-sm font-medium">Ready for data ingestion...</div>}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-300">
          <div className="p-6 border-b bg-slate-50/30 flex justify-between items-center"><h2 className="text-sm font-black uppercase tracking-widest">Published Records</h2><button onClick={fetchResults} className="text-blue-600 text-xs font-black uppercase flex items-center gap-2"><Loader2 className={`w-3 h-3 ${loading && 'animate-spin'}`} /> Refresh</button></div>
          <div className="overflow-x-auto"><table className="w-full text-left min-w-[800px]"><thead className="bg-white border-b"><tr><th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">Publication Details</th><th className="px-8 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Operations</th></tr></thead><tbody className="divide-y divide-slate-50">{resultsList.map(res => <tr key={res.id} className="hover:bg-blue-50/40 transition-colors group"><td className="px-8 py-6"><div className="font-black text-slate-800 uppercase tracking-tight text-base">{res.examName}</div><div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">{res.year} • {res.className} • {res.data.length} Students</div></td><td className="px-8 py-6 text-right space-x-3"><button onClick={() => setViewingRecord(res)} className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase px-6 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all">View</button><button onClick={() => handleExport(res)} className="bg-green-50 text-green-600 text-[10px] font-black uppercase px-6 py-2.5 rounded-xl hover:bg-green-600 hover:text-white transition-all">Export</button><button onClick={() => handleDelete(res.id)} className="bg-red-50 text-red-500 text-[10px] font-black uppercase px-6 py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all">Delete</button></td></tr>)}</tbody></table></div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
