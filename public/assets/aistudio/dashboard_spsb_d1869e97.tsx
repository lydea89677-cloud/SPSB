import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  BarChart3, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Search,
  Building,
  Menu,
  Bell,
  Wallet
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// --- EMBEDDED REALISTIC DATA ---
const projectData = [
  { id: 1, jenisAset: "Cerun", perihalKerja: "PROJEK PEMBAIKAN CERUN RUNTUH DI WISMA PERWIRA RAMD, KEM SI RUSA", nilaiKerja: 1933385, statusKerja: "Siap", kemajuan: 100, kaedahPerolehan: "Tender", kontraktor: "G TRUE RESOURCES SDN.BHD." },
  { id: 2, jenisAset: "Jalan", perihalKerja: "BERKALA BUKAN PAVEMEN / JALAN LUKUT - SEREMBAN / MENAIKTARAF LONGKANG", nilaiKerja: 639994, statusKerja: "Siap", kemajuan: 100, kaedahPerolehan: "Arahan Kerja", kontraktor: "SELIA SELENGGARA SELATAN SDN BHD" },
  { id: 3, jenisAset: "Jalan", perihalKerja: "BERKALA BUKAN PAVEMEN / JALAN PINTAS TELUK KEMANG / MEMBAIKPULIH PEMBENTUNG", nilaiKerja: 29997, statusKerja: "Siap", kemajuan: 100, kaedahPerolehan: "Arahan Kerja", kontraktor: "SELIA SELENGGARA SELATAN SDN BHD" },
  { id: 4, jenisAset: "Bangunan", perihalKerja: "KERJA-KERJA PENYENGGARAAN KUARTERS JKR PERSEKUTUAN KG CHOKRA", nilaiKerja: 364112, statusKerja: "Pembinaan", kemajuan: 15, kaedahPerolehan: "Sebutharga", kontraktor: "KHIDMAT ARIF ENTERPRISE" },
  { id: 5, jenisAset: "Jalan", perihalKerja: "MEMPERKASA JURUTERA DAERAH / MENGECAT SEMULA GARISAN JALAN", nilaiKerja: 99420, statusKerja: "Siap", kemajuan: 100, kaedahPerolehan: "Lantikan Terus", kontraktor: "ANA HASANAH RESOURCES" },
  { id: 6, jenisAset: "Jalan", perihalKerja: "MEMPERKASA JURUTERA DAERAH / JALAN LUBOK CINA / MEMBERSIH POKOK", nilaiKerja: 50000, statusKerja: "Siap", kemajuan: 100, kaedahPerolehan: "Lantikan Terus", kontraktor: "FD IRFAN ENTERPRISE" },
  { id: 7, jenisAset: "Bangunan", perihalKerja: "MEMBINA BANGUNAN TAMBAHAN JKR DAERAH PORT DICKSON", nilaiKerja: 1200000, statusKerja: "Pembinaan", kemajuan: 65, kaedahPerolehan: "Tender", kontraktor: "BINAJAYA CONSTRUCTS" },
  { id: 8, jenisAset: "Cerun", perihalKerja: "PENSTABILAN CERUN TEBING SG LINGGI PORT DICKSON", nilaiKerja: 850000, statusKerja: "Perancangan", kemajuan: 0, kaedahPerolehan: "Tender", kontraktor: "BELUM DILANTIK" },
  { id: 9, jenisAset: "Jalan", perihalKerja: "PENAMPALAN LUBANG JALAN (POTHOLES) SEKITAR BANDAR PORT DICKSON", nilaiKerja: 85000, statusKerja: "Pembinaan", kemajuan: 40, kaedahPerolehan: "Sebutharga", kontraktor: "MAJU JALAN ENTERPRISE" },
  { id: 10, jenisAset: "Bangunan", perihalKerja: "NAIK TARAF BUMBUNG KLINIK KESIHATAN LUKUT", nilaiKerja: 245000, statusKerja: "Pembinaan", kemajuan: 80, kaedahPerolehan: "Sebutharga", kontraktor: "ATAP EMAS SDN BHD" },
  { id: 11, jenisAset: "Jalan", perihalKerja: "PENGGANTIAN LAMPU JALAN KEPADA LED DI LALUAN FT05", nilaiKerja: 450000, statusKerja: "Siap", kemajuan: 100, kaedahPerolehan: "Tender", kontraktor: "CAHAYA LETRIK BROS" },
  { id: 12, jenisAset: "Jalan", perihalKerja: "PENYELENGGARAAN PAPAN TANDA LALULINTAS", nilaiKerja: 48998, statusKerja: "Perancangan", kemajuan: 0, kaedahPerolehan: "Arahan Kerja", kontraktor: "SELIA SELENGGARA SELATAN SDN BHD" },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

// --- UTILITIES ---
const formatRM = (value: number) => {
  return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(value);
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Siap': 'bg-green-100 text-green-800 border-green-200',
    'Pembinaan': 'bg-amber-100 text-amber-800 border-amber-200',
    'Perancangan': 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const ProgressBar = ({ progress, status }: { progress: number; status: string }) => {
  const color = status === 'Siap' ? 'bg-green-500' : status === 'Pembinaan' ? 'bg-amber-500' : 'bg-blue-500';
  return (
    <div className="flex items-center space-x-2">
      <div className="w-24 bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${color} transition-all duration-500`} style={{ width: `${progress}%` }}></div>
      </div>
      <span className="text-xs text-gray-600 font-medium w-8">{progress}%</span>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function InteractiveDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // Derived Statistics
  const stats = useMemo(() => {
    return projectData.reduce((acc, curr) => {
      acc.totalProjects++;
      acc.totalValue += curr.nilaiKerja;
      if (curr.statusKerja === 'Siap') acc.completed++;
      if (curr.statusKerja === 'Pembinaan') acc.active++;
      return acc;
    }, { totalProjects: 0, totalValue: 0, completed: 0, active: 0 });
  }, []);

  // Filtered Data for Table
  const filteredProjects = useMemo(() => {
    return projectData.filter(p => {
      const matchSearch = p.perihalKerja.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.kontraktor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'Semua' || p.statusKerja === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchQuery, statusFilter]);

  // Data for Charts
  const assetChartData = useMemo(() => {
    const counts = projectData.reduce((acc: Record<string, number>, curr) => {
      acc[curr.jenisAset] = (acc[curr.jenisAset] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, []);

  const procurementChartData = useMemo(() => {
    const counts = projectData.reduce((acc: Record<string, number>, curr) => {
      acc[curr.kaedahPerolehan] = (acc[curr.kaedahPerolehan] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, jumlah: counts[key] }));
  }, []);

  // --- VIEWS ---
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Jumlah Projek", val: stats.totalProjects, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100" },
          { title: "Nilai Kerja Keseluruhan", val: formatRM(stats.totalValue), icon: Wallet, color: "text-indigo-600", bg: "bg-indigo-100" },
          { title: "Projek Siap", val: stats.completed, icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
          { title: "Dalam Pembinaan", val: stats.active, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" }
        ].map((card, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/60 flex items-center justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{card.val}</h3>
            </div>
            <div className={`p-3 rounded-full ${card.bg}`}>
              <card.icon size={24} className={card.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Preview Table */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center">
            <span className="w-1.5 h-5 bg-blue-600 rounded-full mr-2"></span>
            Projek Terkini
          </h3>
          <button onClick={() => setActiveTab('senarai')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Lihat Semua &rarr;
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/50 border-b border-gray-200/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3">Perihal Kerja</th>
                <th className="px-6 py-3">Aset</th>
                <th className="px-6 py-3">Nilai (RM)</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {projectData.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700 line-clamp-1">{p.perihalKerja}</td>
                  <td className="px-6 py-4 text-slate-600">{p.jenisAset}</td>
                  <td className="px-6 py-4 text-slate-800">{formatRM(p.nilaiKerja)}</td>
                  <td className="px-6 py-4"><StatusBadge status={p.statusKerja} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSenaraiProjek = () => (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 overflow-hidden animate-in fade-in duration-500 flex flex-col h-[calc(100vh-140px)]">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-gray-200/50 bg-white/40 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Senarai Penuh Projek</h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari kerja atau kontraktor..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>
          {/* Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white w-full sm:w-auto cursor-pointer"
          >
            <option value="Semua">Semua Status</option>
            <option value="Siap">Siap</option>
            <option value="Pembinaan">Pembinaan</option>
            <option value="Perancangan">Perancangan</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 bg-white/90 backdrop-blur-sm shadow-sm z-10">
            <tr className="border-b border-gray-200/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Perihal Kerja & Kontraktor</th>
              <th className="px-6 py-4">Jenis Aset</th>
              <th className="px-6 py-4">Nilai Kerja</th>
              <th className="px-6 py-4">Kaedah</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 w-48">Kemajuan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredProjects.length > 0 ? filteredProjects.map((p) => (
              <tr key={p.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-800 mb-1">{p.perihalKerja}</p>
                  <p className="text-xs text-slate-500">{p.kontraktor}</p>
                </td>
                <td className="px-6 py-4 text-slate-600">{p.jenisAset}</td>
                <td className="px-6 py-4 text-slate-800 font-medium">{formatRM(p.nilaiKerja)}</td>
                <td className="px-6 py-4 text-slate-600 text-xs">{p.kaedahPerolehan}</td>
                <td className="px-6 py-4"><StatusBadge status={p.statusKerja} /></td>
                <td className="px-6 py-4"><ProgressBar progress={p.kemajuan} status={p.statusKerja} /></td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Tiada rekod dijumpai untuk carian/tapisan ini.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-200/50 bg-white/40 text-xs text-slate-500 flex justify-between">
        <span>Menunjukkan {filteredProjects.length} daripada {projectData.length} projek</span>
      </div>
    </div>
  );

  const renderAnalitik = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-xl font-bold text-slate-800">Laporan & Analitik</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Asset Distribution */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/60">
          <h3 className="text-md font-semibold text-slate-800 mb-6 flex items-center">
            <span className="w-1.5 h-5 bg-purple-500 rounded-full mr-2"></span>
            Taburan Mengikut Jenis Aset
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" label={({name, percent}) => `${name} (${(((percent || 0)) * 100).toFixed(0)}%)`}>
                  {assetChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Projek`, 'Jumlah']} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Procurement Methods */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/60">
          <h3 className="text-md font-semibold text-slate-800 mb-6 flex items-center">
            <span className="w-1.5 h-5 bg-blue-500 rounded-full mr-2"></span>
            Kaedah Perolehan Projek
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={procurementChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} allowDecimals={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="jumlah" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {procurementChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );

  // --- LAYOUT ---
  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 font-sans overflow-hidden text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white/70 backdrop-blur-xl border-r border-white/50 flex-shrink-0 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.05)]">
        <div className="p-6 flex items-center space-x-3 border-b border-white/50">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-sm">
            <Building size={24} />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-800 tracking-tight text-lg leading-tight">SPSB</h1>
            <p className="text-xs text-slate-500 font-medium">JKR Port Dickson</p>
          </div>
        </div>
        
        <nav className="p-4 space-y-1.5 flex-1">
          {[
            { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
            { id: 'senarai', label: 'Senarai Projek', icon: ListTodo },
            { id: 'analitik', label: 'Laporan Analitik', icon: BarChart3 }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-blue-600' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-5 border-t border-white/50 bg-white/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-sm">
              JD
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Jurutera Daerah</p>
              <p className="text-xs text-slate-500">Pentadbir Sistem</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-white/50 h-16 flex items-center justify-between px-8 flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center">
            <button className="md:hidden text-slate-500 hover:text-slate-700 mr-4">
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 capitalize hidden sm:block">
              {activeTab === 'senarai' ? 'Senarai Projek' : activeTab === 'analitik' ? 'Analitik Data' : 'Dashboard Keseluruhan'}
            </h2>
          </div>
          <div className="flex items-center space-x-5">
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full hidden lg:block">
              {new Date().toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <button className="text-slate-400 hover:text-blue-600 relative transition-colors">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Scrollable View Container */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'senarai' && renderSenaraiProjek()}
            {activeTab === 'analitik' && renderAnalitik()}
          </div>
        </div>
      </main>
    </div>
  );
}