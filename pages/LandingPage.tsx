
import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, doc, getDoc } from '../firebase';
import { Search, Info, Printer, ArrowLeft, Loader2, Calendar, BookOpen, FileText, Database } from 'lucide-react';
import { Marksheet } from '../components/Marksheet';
import { StudentResult, ResultCollection } from '../types';

const LandingPage: React.FC = () => {
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [availableExams, setAvailableExams] = useState<string[]>([]);
  
  const [year, setYear] = useState('');
  const [className, setClassName] = useState('');
  const [examName, setExamName] = useState('');
  const [studentId, setStudentId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState<StudentResult | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [metaInfo, setMetaInfo] = useState<{year: string, className: string, examName: string} | null>(null);

  useEffect(() => {
    const fetchMetaData = async () => {
      setFetchingMeta(true);
      try {
        const querySnapshot = await getDocs(collection(db, "results"));
        const results = querySnapshot.docs.map(doc => doc.data() as ResultCollection);
        
        const years = Array.from(new Set(results.map(r => r.year))).sort().reverse();
        const classes = Array.from(new Set(results.map(r => r.className))).sort((a: any, b: any) => {
           const numA = parseInt(String(a).replace(/\D/g, '')) || 0;
           const numB = parseInt(String(b).replace(/\D/g, '')) || 0;
           return numA - numB;
        });
        const exams = Array.from(new Set(results.map(r => r.examName))).sort();

        setAvailableYears(years);
        setAvailableClasses(classes);
        setAvailableExams(exams);
      } catch (err) {
        console.error("Error fetching filters:", err);
      } finally {
        setFetchingMeta(false);
      }
    };

    fetchMetaData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !className || !examName || !studentId) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const docId = `${year}_${className}_${examName}`;
      const docRef = doc(db, "results", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as ResultCollection;
        const found = data.data.find(row => 
          String(row['Roll No'] || row['ID'] || row['Roll Number'] || row['Student ID'] || row['Roll']).toLowerCase() === studentId.toLowerCase()
        );

        if (found) {
          setResult(found);
          setHeaders(data.headers || []);
          setMetaInfo({ year, className, examName });
        } else {
          setError(`No record found for ID: ${studentId}`);
        }
      } else {
        setError('Result set not published yet.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching the result.');
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setResult(null);
    setHeaders([]);
    setMetaInfo(null);
    setStudentId('');
  };

  const triggerPrint = () => {
    window.print();
  };

  if (result && metaInfo) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-5xl">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <button 
            onClick={resetSearch}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Search
          </button>
          <button 
            onClick={triggerPrint}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-100 transition-all active:scale-95"
          >
            <Printer className="w-5 h-5" /> Print Marksheet (A4)
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden print:shadow-none print:border-0 a4-container-wrapper">
          <Marksheet result={result} year={metaInfo.year} className={metaInfo.className} examName={metaInfo.examName} headers={headers} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl no-print">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Check Your <span className="text-blue-600">Exam Result</span>
        </h1>
        <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto px-4">
          Enter your institutional credentials below to access and download your official academic transcript. 
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100">
          {fetchingMeta ? (
            <div className="py-20 text-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
              <p className="text-slate-400 font-medium">Connecting to Result Server...</p>
            </div>
          ) : (
            <form onSubmit={handleSearch} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" /> Academic Year
                  </label>
                  <select 
                    className="w-full p-3 bg-white rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 appearance-none cursor-pointer shadow-sm"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  >
                    <option value="">Select Year</option>
                    {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" /> Class
                  </label>
                  <select 
                    className="w-full p-3 bg-white rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 appearance-none cursor-pointer shadow-sm"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                  >
                    <option value="">Select Class</option>
                    {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-500" /> Exam Type
                </label>
                <select 
                  className="w-full p-3 bg-white rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 appearance-none cursor-pointer shadow-sm"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  required
                >
                  <option value="">Select Examination</option>
                  {availableExams.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-blue-500" /> Roll / Student ID
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. 2024101"
                  className="w-full p-3 bg-white rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 shadow-sm placeholder:text-slate-400"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-start gap-3 text-xs sm:text-sm font-semibold border border-red-100 animate-pulse">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" /> {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || availableYears.length === 0}
                className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 font-bold text-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Search className="w-5 h-5" /> View Results</>}
              </button>
            </form>
          )}
        </div>

        <div className="hidden lg:block relative">
           <div className="bg-blue-600 absolute -inset-4 rounded-3xl opacity-5 blur-2xl"></div>
           <div className="relative space-y-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 transform -rotate-2 hover:rotate-0 transition-all duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Cloud Sync</h3>
                    <p className="text-slate-500 text-xs">Always access the latest result records</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 transform rotate-3 hover:rotate-0 transition-all duration-500 ml-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <Printer className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">One-Click Print</h3>
                    <p className="text-slate-500 text-xs">Formatted for standard A4 paper</p>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
