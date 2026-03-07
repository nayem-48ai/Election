
/**
 * Common Navbar for all HTML pages with Glassy UI and improved responsiveness
 */
export function renderNavbar(user = null) {
    const nav = document.createElement('nav');
    nav.className = "bg-white/80 backdrop-blur-xl sticky top-0 z-[60] border-b border-slate-200/50 no-print transition-all duration-300 shadow-sm";
    nav.innerHTML = `
        <div class="container mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <a href="index.html" class="flex items-center gap-2 group transition-transform active:scale-95">
                <div class="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                    <i data-lucide="graduation-cap" class="text-white w-5 h-5 sm:w-6 sm:h-6"></i>
                </div>
                <span class="font-black text-lg sm:text-xl tracking-tighter text-slate-800">EduResult</span>
            </a>
            <div class="flex items-center gap-3 sm:gap-6">
                <a href="index.html" class="text-slate-600 hover:text-blue-600 font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                    <i data-lucide="home" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i> <span class="hidden xs:inline">Home</span>
                </a>
                ${user ? `
                    <a href="AdminDashboard.html" class="text-slate-600 hover:text-blue-600 font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                        <i data-lucide="layout-dashboard" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i> <span class="hidden xs:inline">Dashboard</span>
                    </a>
                    <button id="nav-logout-btn" class="bg-slate-100 text-slate-700 px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-200 font-bold text-[10px] sm:text-xs flex items-center gap-1.5 transition-all">
                        <i data-lucide="log-out" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i> <span>Logout</span>
                    </button>
                ` : `
                    <a href="Login.html" class="bg-slate-900 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-slate-800 font-bold text-[10px] sm:text-xs flex items-center gap-1.5 shadow-xl shadow-slate-200 transition-all active:scale-95">
                        <i data-lucide="shield-check" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i> <span>Admin</span>
                    </a>
                `}
            </div>
        </div>
    `;
    return nav;
}

/**
 * Common Marksheet Renderer - Exact match with React version, A4 print optimized
 */
export function renderMarksheet(data, meta) {
    const metaFields = ['Name', 'Student Name', 'Student', 'Roll No', 'ID', 'Roll Number', 'Student ID', 'Roll', 'Total', 'Total Marks', 'Total Aggregate', 'Percentage', 'Average', 'Avg', 'Grade', 'GPA', 'Result', 'Status'];
    
    let subjectList = [];
    if (meta.headers) {
        meta.headers.forEach(h => {
            if (!metaFields.includes(h) && data[h] !== undefined) subjectList.push([h, data[h]]);
        });
    } else {
        subjectList = Object.entries(data).filter(([k]) => !metaFields.includes(k));
    }

    subjectList.sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true, sensitivity: 'base' }));

    const isFailed = String(data['Result'] || data['Status'] || '').toUpperCase().includes('FAIL');
    const studentName = (data['Name'] || data['Student Name'] || 'Unknown').toUpperCase();
    const rollNo = data['Roll No'] || data['Roll'] || 'N/A';

    return `
        <div class="a4-container p-6 sm:p-10 border-4 border-double border-slate-800 rounded-lg w-full max-w-4xl mx-auto bg-white transition-all overflow-hidden flex flex-col justify-between h-full">
            <div class="flex-grow">
                <div class="text-center border-b-2 border-slate-800 pb-3 mb-5">
                    <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-widest uppercase mb-1">Hat Madhnogor High School</h1>
                    <p class="text-[9px] sm:text-base text-slate-600 font-bold mb-3 tracking-widest uppercase">Recognition No: HM-9922 | Established: 1970</p>
                    <div class="bg-slate-900 text-white inline-block px-8 sm:px-12 py-1.5 sm:py-2 rounded-full font-black uppercase tracking-[0.3em] text-[9px] sm:text-sm shadow-lg">Academic Report Card</div>
                </div>

                <div class="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100 mb-6 shadow-inner">
                    <div class="grid grid-cols-2 gap-x-8 sm:gap-x-16 gap-y-3 text-[11px] sm:text-base">
                        <div class="flex flex-col sm:flex-row sm:items-center gap-1.5">
                            <b class="text-slate-400 uppercase text-[9px] sm:text-xs tracking-tighter">Student Name:</b> 
                            <span class="font-black text-slate-900 truncate uppercase">${studentName}</span>
                        </div>
                        <div class="flex flex-col sm:flex-row sm:items-center gap-1.5">
                            <b class="text-slate-400 uppercase text-[9px] sm:text-xs tracking-tighter">Roll Number:</b> 
                            <span class="font-black text-slate-900">${rollNo}</span>
                        </div>
                        <div class="flex flex-col sm:flex-row sm:items-center gap-1.5">
                            <b class="text-slate-400 uppercase text-[9px] sm:text-xs tracking-tighter">Class:</b> 
                            <span class="font-black text-slate-900">${meta.className}</span>
                        </div>
                        <div class="flex flex-col sm:flex-row sm:items-center gap-1.5">
                            <b class="text-slate-400 uppercase text-[9px] sm:text-xs tracking-tighter">Session:</b> 
                            <span class="font-black text-slate-900">${meta.year}</span>
                        </div>
                    </div>
                </div>

                <div class="text-center mb-5">
                    <h2 class="text-sm sm:text-2xl font-black text-slate-900 border-b-2 inline-block pb-1 border-slate-800 px-10 uppercase tracking-[0.2em] italic">${meta.examName}</h2>
                </div>

                <div class="overflow-hidden border-2 border-slate-800 rounded-2xl mb-6 shadow-sm">
                    <table class="w-full border-collapse">
                        <thead class="bg-slate-100 text-[10px] sm:text-sm uppercase font-black text-slate-700">
                            <tr>
                                <th class="p-3 border-r-2 border-b-2 border-slate-800 text-left">Subject Description</th>
                                <th class="p-3 border-b-2 border-slate-800 text-center w-24 sm:w-56">Marks</th>
                            </tr>
                        </thead>
                        <tbody class="text-[11px] sm:text-base">
                            ${subjectList.map(([s, m], idx) => `
                                <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}">
                                    <td class="p-2.5 border-r border-b border-slate-200 font-semibold text-slate-700 italic truncate">${s}</td>
                                    <td class="p-2.5 border-b border-slate-200 text-center font-black text-slate-900">${m}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot class="bg-slate-900 text-white font-black text-[10px] sm:text-sm uppercase tracking-[0.2em]">
                            <tr>
                                <td class="p-3 border-r border-slate-700">Aggregate Total Calculation</td>
                                <td class="p-3 text-center">${data['Total'] || data['Total Marks'] || 'N/A'}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div class="grid grid-cols-2 gap-4 sm:gap-10 mb-8">
                    <div class="grid grid-cols-2 gap-3 sm:gap-6">
                        <div class="p-3 bg-blue-50 border-2 border-blue-100 rounded-2xl text-center shadow-sm">
                            <p class="text-blue-600 text-[8px] sm:text-[10px] font-black uppercase tracking-tighter">Percentage</p>
                            <p class="text-base sm:text-3xl font-black text-blue-900">${data['Percentage'] || data['Average'] || 'N/A'}%</p>
                        </div>
                        <div class="p-3 bg-green-50 border-2 border-green-100 rounded-2xl text-center shadow-sm">
                            <p class="text-green-600 text-[8px] sm:text-[10px] font-black uppercase tracking-tighter">Grade</p>
                            <p class="text-base sm:text-3xl font-black text-green-900">${data['Grade'] || 'N/A'}</p>
                        </div>
                    </div>
                    <div class="${isFailed ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-900 border-slate-800 text-white'} p-3 border-2 rounded-2xl text-center flex flex-col justify-center shadow-xl">
                        <p class="${isFailed ? 'text-red-400' : 'text-slate-400'} text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Result Outcome</p>
                        <p class="text-base sm:text-3xl font-black uppercase tracking-tighter">${(data['Result'] || data['Status'] || 'PASSED').toUpperCase()}</p>
                    </div>
                </div>
            </div>

            <div>
                <div class="grid grid-cols-2 items-end pt-6 border-t-2 border-slate-800 gap-12 sm:gap-48">
                    <div class="text-center group">
                        <img src="https://i.ibb.co.com/HDqfKG6K/Seal-school.png" class="h-20 sm:h-32 mx-auto object-contain transition-transform group-hover:rotate-6">
                    </div>
                    <div class="text-center flex flex-col items-center">
                        <img src="https://i.ibb.co.com/1C0fss2/Tarikul-sign.png" class="h-12 sm:h-20 object-contain mb-1 opacity-90 transition-opacity hover:opacity-100">
                        <div class="border-b-2 border-slate-800 mb-1 w-full max-w-[150px] sm:max-w-[240px] shadow-sm"></div>
                        <p class="font-black text-slate-900 text-[9px] sm:text-xs uppercase tracking-tighter">Controller of Examinations</p>
                    </div>
                </div>
                <p class="mt-6 text-center text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">* VALID ONLY WITH OFFICIAL INSTITUTIONAL HOLOGRAM *</p>
            </div>
        </div>
    `;
}
