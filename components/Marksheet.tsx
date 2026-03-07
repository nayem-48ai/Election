
import React from 'react';
import { StudentResult } from '../types';

interface MarksheetProps {
  result: StudentResult;
  year: string;
  className: string;
  examName: string;
  headers?: string[];
}

export const Marksheet: React.FC<MarksheetProps> = ({ result, year, className, examName, headers }) => {
  const studentName = (result['Name'] || result['Student Name'] || result['Student'] || 'Unknown Student') as string;
  const rollNo = (result['Roll No'] || result['ID'] || result['Roll Number'] || result['Student ID'] || result['Roll'] || 'N/A') as string;
  
  const metaFields = [
    'Name', 'Student Name', 'Student', 
    'Roll No', 'ID', 'Roll Number', 'Student ID', 'Roll',
    'Total', 'Total Marks', 'Total Aggregate',
    'Percentage', 'Average', 'Avg',
    'Grade', 'GPA', 'Result', 'Status'
  ];

  let subjectList: [string, any][] = [];
  if (headers && headers.length > 0) {
    headers.forEach(header => {
      if (!metaFields.includes(header) && result[header] !== undefined) {
        subjectList.push([header, result[header]]);
      }
    });
  } else {
    subjectList = Object.entries(result).filter(([key]) => !metaFields.includes(key));
  }
  
  subjectList.sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true, sensitivity: 'base' }));
  
  const totalMarksValue = result['Total'] || result['Total Marks'] || result['Total Aggregate'] || 'N/A';
  const percentageValue = result['Percentage'] || result['Average'] || result['Avg'] || 'N/A';
  const gradeValue = result['Grade'] || 'N/A';
  const resultStatus = String(result['Result'] || result['Status'] || 'PASSED').toUpperCase();

  const isFailed = resultStatus.includes('FAIL');

  return (
    <div className="a4-container border-4 border-double border-slate-800 rounded-lg w-full max-w-4xl mx-auto bg-white flex flex-col justify-between box-border overflow-hidden p-6 sm:p-10">
      <div className="flex-grow">
        {/* School Header */}
        <div className="text-center border-b-2 border-slate-800 pb-3 mb-5">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-widest uppercase mb-1">Hat Madhnogor High School</h1>
          <p className="text-[10px] sm:text-base text-slate-600 font-bold mb-3 tracking-widest uppercase">Recognition No: HM-9922 | Established: 1970</p>
          <div className="bg-slate-900 text-white inline-block px-8 sm:px-12 py-1.5 sm:py-2 rounded-full font-black uppercase tracking-[0.3em] text-[9px] sm:text-sm shadow-lg">
            Academic Report Card
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100 mb-6 shadow-inner">
          <div className="grid grid-cols-2 gap-x-8 sm:gap-x-16 gap-y-3 text-[11px] sm:text-base">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
              <span className="text-slate-400 font-black uppercase text-[9px] sm:text-xs tracking-tighter">Student Name:</span>
              <span className="font-black text-slate-900 uppercase truncate">{studentName}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
              <span className="text-slate-400 font-black uppercase text-[9px] sm:text-xs tracking-tighter">Roll Number:</span>
              <span className="font-black text-slate-900">{rollNo}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
              <span className="text-slate-400 font-black uppercase text-[9px] sm:text-xs tracking-tighter">Class:</span>
              <span className="font-black text-slate-900">{className}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
              <span className="text-slate-400 font-black uppercase text-[9px] sm:text-xs tracking-tighter">Academic Session:</span>
              <span className="font-black text-slate-900">{year}</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-5">
          <h2 className="text-sm sm:text-2xl font-black text-slate-900 border-b-2 inline-block pb-1 border-slate-800 px-10 uppercase tracking-[0.2em] italic">
            {examName}
          </h2>
        </div>

        {/* Marks Table */}
        <div className="overflow-hidden border-2 border-slate-800 rounded-2xl mb-6 shadow-sm">
          <table className="w-full text-left table-fixed">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 font-black text-slate-800 border-b-2 border-r-2 border-slate-800 text-[10px] sm:text-sm uppercase tracking-widest">Subject Description</th>
                <th className="px-6 py-3 font-black text-slate-800 border-b-2 border-slate-800 text-center text-[10px] sm:text-sm uppercase tracking-widest w-24 sm:w-56">Marks</th>
              </tr>
            </thead>
            <tbody className="text-[11px] sm:text-base">
              {subjectList.map(([subject, marks], index) => (
                <tr key={subject} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="px-6 py-2.5 border-r border-b border-slate-200 font-semibold italic text-slate-700 truncate">{subject}</td>
                  <td className="px-6 py-2.5 border-b border-slate-200 text-center font-black text-slate-900">{marks}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-900 text-white font-black">
              <tr>
                <td className="px-6 py-3 text-[10px] sm:text-sm uppercase tracking-[0.2em] border-r border-slate-700">Aggregate Total Calculation</td>
                <td className="px-6 py-3 text-center text-[11px] sm:text-lg">{totalMarksValue}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-4 sm:gap-10 mb-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <div className="p-3 bg-blue-50 border-2 border-blue-100 rounded-2xl text-center shadow-sm">
              <p className="text-blue-600 text-[8px] sm:text-[10px] font-black uppercase tracking-tighter">Percentage</p>
              <p className="text-base sm:text-3xl font-black text-blue-900">{percentageValue}%</p>
            </div>
            <div className="p-3 bg-green-50 border-2 border-green-100 rounded-2xl text-center shadow-sm">
              <p className="text-green-600 text-[8px] sm:text-[10px] font-black uppercase tracking-tighter">Grade</p>
              <p className="text-base sm:text-3xl font-black text-green-900">{gradeValue}</p>
            </div>
          </div>
          <div className={`p-3 border-2 rounded-2xl text-center flex flex-col justify-center shadow-xl transition-colors ${isFailed ? 'bg-red-50 border-red-200' : 'bg-slate-900 border-slate-900'}`}>
            <p className={`${isFailed ? 'text-red-400' : 'text-slate-400'} text-[8px] sm:text-[10px] font-black uppercase tracking-widest`}>Result Outcome</p>
            <p className={`text-base sm:text-3xl font-black uppercase tracking-tighter ${isFailed ? 'text-red-600' : 'text-white'}`}>{resultStatus}</p>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="mt-auto">
        <div className="grid grid-cols-2 items-end pt-6 border-t-2 border-slate-800 gap-12 sm:gap-48">
          <div className="text-center group">
            <div className="flex items-center justify-center h-20 sm:h-32">
              <img src="https://i.ibb.co.com/HDqfKG6K/Seal-school.png" alt="Seal" className="max-h-full w-auto object-contain transition-transform group-hover:rotate-6" />
            </div>
          </div>
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center h-12 sm:h-20 mb-1">
              <img src="https://i.ibb.co.com/1C0fss2/Tarikul-sign.png" alt="Signature" className="max-h-full w-auto object-contain opacity-90" />
            </div>
            <div className="border-b-2 border-slate-800 mb-1 w-full max-w-[150px] sm:max-w-[240px]"></div>
            <p className="font-black text-slate-900 text-[9px] sm:text-xs uppercase tracking-tighter">Controller of Examinations</p>
          </div>
        </div>
        <div className="mt-6 text-center text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
          * VALID ONLY WITH OFFICIAL INSTITUTIONAL HOLOGRAM *
        </div>
      </div>
    </div>
  );
};
