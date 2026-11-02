/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  BarChart3, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Search,
  Building,
  Menu,
  Bell,
  Wallet,
  X,
  Plus,
  Download,
  Filter,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  Edit3,
  Trash2,
  ExternalLink
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

// --- DATA TYPES ---
export interface Project {
  id: number;
  jenisAset: 'Cerun' | 'Jalan' | 'Bangunan' | 'Jambatan' | 'Lain-lain' | string;
  perihalKerja: string;
  nilaiKerja: number;
  statusKerja: 'Siap' | 'Pembinaan' | 'Perancangan';
  kemajuan: number;
  kaedahPerolehan: 'Tender' | 'Sebutharga' | 'Arahan Kerja' | 'Lantikan Terus' | string;
  kontraktor: string;
  tarikhMula?: string;
  tarikhSiap?: string;
  lokasi?: string;
}

// --- EMBEDDED REALISTIC DATA ---
const INITIAL_PROJECT_DATA: Project[] = [
  { id: 1, jenisAset: "Cerun", perihalKerja: "PROJEK PEMBAIKAN CERUN RUNTUH DI WISMA PERWIRA RAMD, KEM SI RUSA", nilaiKerja: 1933385, statusKerja: "Siap", kemajuan: 100, kaedahPerolehan: "Tender", kontraktor: "G TRUE RESOURCES SDN.BHD.", lokasi: "Kem Si Rusa, Port Dickson", tarikhMula: "2024-02-15", tarikhSiap: "2024-10-30" },
  { id: 2, jenisAset: "Jalan", perihalKerja: "BERKALA BUKAN PAVEMEN / JALAN LUKUT - SEREMBAN / MENAIKTARAF LONGKANG", nilaiKerja: 639994, statusKerja: "Siap", kemajuan: 100, kaedahPerolehan: "Arahan Kerja", kontraktor: "SELIA SELENGGARA SELATAN SDN BHD", lokasi: "Laluan FT01, Lukut - Seremban", tarikhMula: "2024-03-01", tarikhSiap: "2024-09-15" },
  { id: 3, jenisAset: "Jalan", perihalKerja: "BERKALA BUKAN PAVEMEN / JALAN PINTAS TELUK KEMANG / MEMBAIKPULIH PEMBENTUNG", nilaiKerja: 29997, statusKerja: "Siap", kemajuan: 100, kaedahPerolehan: "Arahan Kerja", kontraktor: "SELIA SELENGGARA SELATAN SDN BHD", lokasi: "Jalan Pintas Teluk Kemang", tarikhMula: "2024-05-10", tarikhSiap: "2024-06-25" },
  { id: 4, jenisAset: "Bangunan", perihalKerja: "KERJA-KERJA PENYENGGARAAN KUARTERS JKR PERSEKUTUAN KG CHOKRA", nilaiKerja: 364112, statusKerja: "Pembinaan", kemajuan: 15, kaedahPerolehan: "Sebutharga", kontraktor: "KHIDMAT ARIF ENTERPRISE", lokasi: "Kg. Chokra, Port Dickson", tarikhMula: "2024-08-01", tarikhSiap: "2025-02-28" },
  { id: 5, jenisAset: "Jalan", perihalKerja: "MEMPERKASA JURUTERA DAERAH / MENGECAT SEMULA GARISAN JALAN", nilaiKerja: 99420, statusKerja: "Siap", kemajuan: 100, kaedahPerolehan: "Lantikan Terus", kontraktor: "ANA HASANAH RESOURCES", lokasi: "Bandar Port Dickson", tarikhMula: "2024-04-12", tarikhSiap: "2024-05-20" },
  { id: 6, jenisAset: "Jalan", perihalKerja: "MEMPERKASA JURUTERA DAERAH / JALAN LUBOK CINA / MEMBERSIH POKOK", nilaiKerja: 50000, statusKerja: "Siap", kemajuan: 100, kaedahPerolehan: "Lantikan Terus", kontraktor: "FD IRFAN ENTERPRISE", lokasi: "Jalan Lubok Cina, PD", tarikhMula: "2024-06-01", tarikhSiap: "2024-07-05" },
  { id: 7, jenisAset: "Bangunan", perihalKerja: "MEMBINA BANGUNAN TAMBAHAN JKR DAERAH PORT DICKSON", nilaiKerja: 1200000, statusKerja: "Pembinaan", kemajuan: 65, kaedahPerolehan: "Tender", kontraktor: "BINAJAYA CONSTRUCTS", lokasi: "Pejabat JKR Daerah Port Dickson", tarikhMula: "2024-01-15", tarikhSiap: "2025-01-31" },
  { id: 8, jenisAset: "Cerun", perihalKerja: "PENSTABILAN CERUN TEBING SG LINGGI PORT DICKSON", nilaiKerja: 850000, statusKerja: "Perancangan", kemajuan: 0, kaedahPerolehan: "Tender", kontraktor: "BELUM DILANTIK", lokasi: "Tebing Sg. Linggi", tarikhMula: "2025-01-01", tarikhSiap: "2025-09-30" },
  { id: 9, jenisAset: "Jalan", perihalKerja: "PENAMPALAN LUBANG JALAN (POTHOLES) SEKITAR BANDAR PORT DICKSON", nilaiKerja: 85000, statusKerja: "Pembinaan", kemajuan: 40, kaedahPerolehan: "Sebutharga", kontraktor: "MAJU JALAN ENTERPRISE", lokasi: "Zon Bandar Port Dickson", tarikhMula: "2024-09-01", tarikhSiap: "2024-12-15" },
  { id: 10, jenisAset: "Bangunan", perihalKerja: "NAIK TARAF BUMBUNG KLINIK KESIHATAN LUKUT", nilaiKerja: 245000, statusKerja: "Pembinaan", kemajuan: 80, kaedahPerolehan: "Sebutharga", kontraktor: "ATAP EMAS SDN BHD", lokasi: "Klinik Kesihatan Lukut", tarikhMula: "2024-07-15", tarikhSiap: "2024-11-30" },
  { id: 11, jenisAset: "Jalan", perihalKerja: "PENGGANTIAN LAMPU JALAN KEPADA LED DI LALUAN FT05", nilaiKerja: 450000, statusKerja: "Siap", kemajuan: 100, kaedahPerolehan: "Tender", kontraktor: "CAHAYA LETRIK BROS", lokasi: "Laluan Persekutuan FT05", tarikhMula: "2024-03-10", tarikhSiap: "2024-08-20" },
  { id: 12, jenisAset: "Jalan", perihalKerja: "PENYELENGGARAAN PAPAN TANDA LALULINTAS", nilaiKerja: 48998, statusKerja: "Perancangan", kemajuan: 0, kaedahPerolehan: "Arahan Kerja", kontraktor: "SELIA SELENGGARA SELATAN SDN BHD", lokasi: "Seluruh Daerah Port Dickson", tarikhMula: "2024-12-01", tarikhSiap: "2025-02-15" },
];

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

// --- NOTIFICATIONS DATA ---
const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'Projek Disahkan Siap', desc: 'Pembaikan Cerun di Wisma Perwira RAMD telah selesai sepenuhnya.', time: '2 jam yang lalu', unread: true },
  { id: 2, title: 'Kemajuan Kerja Diperbaharui', desc: 'Naik Taraf Bumbung KK Lukut kini berada pada tahap 80%.', time: '1 hari yang lalu', unread: true },
  { id: 3, title: 'Kelulusan Perolehan', desc: 'Tender Penstabilan Cerun Sg Linggi dibuka untuk semakan teknikal.', time: '3 hari yang lalu', unread: false },
];

// --- UTILITIES ---
const formatRM = (value: number) => {
  return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(value);
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    'Siap': 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/20',
    'Pembinaan': 'bg-amber-100 text-amber-800 border-amber-300 ring-1 ring-amber-400/20',
    'Perancangan': 'bg-blue-100 text-blue-800 border-blue-300 ring-1 ring-blue-400/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'Siap' ? 'bg-emerald-500' : status === 'Pembinaan' ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'}`}></span>
      {status}
    </span>
  );
};

const ProgressBar: React.FC<{ progress: number; status: string }> = ({ progress, status }) => {
  const color = status === 'Siap' ? 'bg-emerald-500' : status === 'Pembinaan' ? 'bg-amber-500' : 'bg-blue-500';
  return (
    <div className="flex items-center space-x-2">
      <div className="w-24 bg-gray-200/80 rounded-full h-2 overflow-hidden shadow-inner">
        <div 
          className={`h-2 rounded-full ${color} transition-all duration-700 ease-out`} 
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <span className="text-xs text-slate-700 font-semibold w-9 text-right">{progress}%</span>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('spsb_jkr_pd_projects');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PROJECT_DATA;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'senarai' | 'analitik'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [assetFilter, setAssetFilter] = useState('Semua');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Modal / Drawer States
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New Project Form State
  const [newProject, setNewProject] = useState<Partial<Project>>({
    jenisAset: 'Jalan',
    statusKerja: 'Perancangan',
    kaedahPerolehan: 'Sebutharga',
    kemajuan: 0,
    nilaiKerja: 50000,
    perihalKerja: '',
    kontraktor: '',
    lokasi: 'Port Dickson'
  });

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('spsb_jkr_pd_projects', JSON.stringify(projects));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [projects]);

  // Derived Statistics
  const stats = useMemo(() => {
    return projects.reduce((acc, curr) => {
      acc.totalProjects++;
      acc.totalValue += curr.nilaiKerja;
      if (curr.statusKerja === 'Siap') acc.completed++;
      if (curr.statusKerja === 'Pembinaan') acc.active++;
      if (curr.statusKerja === 'Perancangan') acc.planning++;
      return acc;
    }, { totalProjects: 0, totalValue: 0, completed: 0, active: 0, planning: 0 });
  }, [projects]);

  // Unique Asset Types for Filtering
  const availableAssetTypes = useMemo(() => {
    const set = new Set(projects.map(p => p.jenisAset));
    return ['Semua', ...Array.from(set)];
  }, [projects]);

  // Filtered Data for Table
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = p.perihalKerja.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.kontraktor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.lokasi && p.lokasi.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchStatus = statusFilter === 'Semua' || p.statusKerja === statusFilter;
      const matchAsset = assetFilter === 'Semua' || p.jenisAset === assetFilter;
      return matchSearch && matchStatus && matchAsset;
    });
  }, [projects, searchQuery, statusFilter, assetFilter]);

  // Data for Charts
  const assetChartData = useMemo(() => {
    const counts = projects.reduce((acc: Record<string, number>, curr) => {
      acc[curr.jenisAset] = (acc[curr.jenisAset] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [projects]);

  const procurementChartData = useMemo(() => {
    const counts = projects.reduce((acc: Record<string, number>, curr) => {
      acc[curr.kaedahPerolehan] = (acc[curr.kaedahPerolehan] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, jumlah: counts[key] }));
  }, [projects]);

  const assetValueData = useMemo(() => {
    const values = projects.reduce((acc: Record<string, number>, curr) => {
      acc[curr.jenisAset] = (acc[curr.jenisAset] || 0) + curr.nilaiKerja;
      return acc;
    }, {});
    return Object.keys(values).map(key => ({ 
      name: key, 
      nilaiJuta: Number((values[key] / 1000000).toFixed(2)) 
    }));
  }, [projects]);

  // Handle Add Project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.perihalKerja || !newProject.kontraktor) {
      alert('Sila lengkapkan maklumat Perihal Kerja dan Kontraktor.');
      return;
    }
    const created: Project = {
      id: Date.now(),
      jenisAset: newProject.jenisAset || 'Jalan',
      perihalKerja: newProject.perihalKerja.toUpperCase(),
      nilaiKerja: Number(newProject.nilaiKerja) || 0,
      statusKerja: (newProject.statusKerja as any) || 'Perancangan',
      kemajuan: Number(newProject.kemajuan) || 0,
      kaedahPerolehan: newProject.kaedahPerolehan || 'Sebutharga',
      kontraktor: newProject.kontraktor.toUpperCase(),
      lokasi: newProject.lokasi || 'Port Dickson',
      tarikhMula: newProject.tarikhMula || new Date().toISOString().split('T')[0],
      tarikhSiap: newProject.tarikhSiap || ''
    };
    setProjects([created, ...projects]);
    setIsAddModalOpen(false);
    setNewProject({
      jenisAset: 'Jalan',
      statusKerja: 'Perancangan',
      kaedahPerolehan: 'Sebutharga',
      kemajuan: 0,
      nilaiKerja: 50000,
      perihalKerja: '',
      kontraktor: '',
      lokasi: 'Port Dickson'
    });
  };

  // Quick Update Kemajuan / Status for a Project
  const handleUpdateProgress = (id: number, newProgress: number) => {
    const clamped = Math.min(100, Math.max(0, newProgress));
    const newStatus: 'Siap' | 'Pembinaan' | 'Perancangan' = 
      clamped === 100 ? 'Siap' : clamped > 0 ? 'Pembinaan' : 'Perancangan';

    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, kemajuan: clamped, statusKerja: newStatus };
        if (selectedProject?.id === id) {
          setSelectedProject(updated);
        }
        return updated;
      }
      return p;
    }));
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Perihal Kerja', 'Jenis Aset', 'Nilai Kerja (RM)', 'Kaedah Perolehan', 'Status', 'Kemajuan (%)', 'Kontraktor', 'Lokasi'];
    const rows = filteredProjects.map(p => [
      p.id,
      `"${p.perihalKerja.replace(/"/g, '""')}"`,
      p.jenisAset,
      p.nilaiKerja,
      p.kaedahPerolehan,
      p.statusKerja,
      p.kemajuan,
      `"${p.kontraktor.replace(/"/g, '""')}"`,
      `"${(p.lokasi || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Projek_JKR_PD_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset to initial data helper
  const handleResetData = () => {
    if (window.confirm('Adakah anda pasti ingin set semula kepada data asal?')) {
      setProjects(INITIAL_PROJECT_DATA);
      localStorage.removeItem('spsb_jkr_pd_projects');
    }
  };

  // Unread count
  const unreadNotifsCount = notifications.filter(n => n.unread).length;

  // --- VIEWS ---
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase text-blue-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Sistem Pemantauan Status Projek (SPSB)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pejabat Jurutera Daerah Port Dickson
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Ringkasan pelaporan prestasi perolehan, perbelanjaan kerja sivil, bangunan, dan cerun bagi Daerah Port Dickson, Negeri Sembilan.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 active:scale-95 transition-all rounded-xl font-semibold text-sm shadow-md cursor-pointer"
            >
              <Plus size={18} />
              Daftar Projek Baru
            </button>
            <button
              onClick={() => setActiveTab('senarai')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 active:scale-95 transition-all rounded-xl font-semibold text-sm text-white backdrop-blur-md cursor-pointer"
            >
              <ListTodo size={18} />
              Senarai Penuh
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "Jumlah Projek", val: stats.totalProjects, subtitle: "Keseluruhan aset", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100/80 border-blue-200" },
          { title: "Nilai Kerja Keseluruhan", val: formatRM(stats.totalValue), subtitle: "Peruntukan diluluskan", icon: Wallet, color: "text-indigo-600", bg: "bg-indigo-100/80 border-indigo-200" },
          { title: "Projek Siap (100%)", val: stats.completed, subtitle: `${Math.round((stats.completed / (stats.totalProjects || 1)) * 100)}% kadar siap`, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100/80 border-emerald-200" },
          { title: "Dalam Pembinaan", val: stats.active, subtitle: `${stats.planning} dalam perancangan`, icon: Clock, color: "text-amber-600", bg: "bg-amber-100/80 border-amber-200" }
        ].map((card, idx) => (
          <div key={idx} className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-sm hover:shadow-md border border-slate-200/80 flex items-center justify-between transition-all duration-300">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{card.val}</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">{card.subtitle}</p>
            </div>
            <div className={`p-3.5 rounded-2xl border ${card.bg} shadow-xs`}>
              <card.icon size={26} className={card.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Visuals Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress distribution */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-600" />
                Status Pelaksanaan
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                {stats.totalProjects} Projek
              </span>
            </div>
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Siap
                  </span>
                  <span className="text-slate-700">{stats.completed} ({Math.round((stats.completed / (stats.totalProjects || 1)) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(stats.completed / (stats.totalProjects || 1)) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Dalam Pembinaan
                  </span>
                  <span className="text-slate-700">{stats.active} ({Math.round((stats.active / (stats.totalProjects || 1)) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(stats.active / (stats.totalProjects || 1)) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-blue-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Dalam Perancangan
                  </span>
                  <span className="text-slate-700">{stats.planning} ({Math.round((stats.planning / (stats.totalProjects || 1)) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(stats.planning / (stats.totalProjects || 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Peruntukan Aktif:</span>
            <span className="font-bold text-slate-800">
              {formatRM(projects.filter(p => p.statusKerja === 'Pembinaan').reduce((s, c) => s + c.nilaiKerja, 0))}
            </span>
          </div>
        </div>

        {/* Quick Asset Distribution Mini Chart */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Layers size={18} className="text-purple-600" />
                Taburan Projek Mengikut Jenis Aset
              </h3>
              <p className="text-xs text-slate-400">Pecahan bilangan projek mengikut kategori kejuruteraan JKR</p>
            </div>
            <button 
              onClick={() => setActiveTab('analitik')} 
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Lihat Analitik Lanjut &rarr;
            </button>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetChartData} margin={{ top: 15, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(val) => [`${val} Projek`, 'Jumlah Projek']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {assetChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Preview Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center">
              <span className="w-2 h-5 bg-blue-600 rounded-full mr-2.5"></span>
              Senarai Projek Terkini & Status Semasa
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Klik pada mana-mana projek untuk melihat butiran lengkap atau kemaskini kemajuan</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('senarai')} 
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua ({projects.length}) &rarr;
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Perihal Kerja</th>
                <th className="px-6 py-3.5">Aset</th>
                <th className="px-6 py-3.5">Kontraktor</th>
                <th className="px-6 py-3.5">Nilai (RM)</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Kemajuan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {projects.slice(0, 6).map((p) => (
                <tr 
                  key={p.id} 
                  onClick={() => setSelectedProject(p)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    <div className="line-clamp-1 group-hover:text-blue-600 transition-colors">{p.perihalKerja}</div>
                    <div className="text-xs text-slate-400 font-normal mt-0.5 flex items-center gap-1.5">
                      <MapPin size={12} className="text-slate-400" />
                      {p.lokasi || 'Port Dickson'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                      {p.jenisAset}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 max-w-[180px] truncate">
                    {p.kontraktor}
                  </td>
                  <td className="px-6 py-4 text-slate-800 font-semibold text-xs whitespace-nowrap">
                    {formatRM(p.nilaiKerja)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={p.statusKerja} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ProgressBar progress={p.kemajuan} status={p.statusKerja} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSenaraiProjek = () => (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden animate-in fade-in duration-500 flex flex-col min-h-[680px]">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-slate-200/70 bg-slate-50/50 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ListTodo size={20} className="text-blue-600" />
              Senarai Penuh Projek JKR Port Dickson
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Pantau status, kontraktor pelaksana, kaedah perolehan, dan peratusan siap</p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Muat Turun Data CSV"
            >
              <Download size={14} />
              Eksport CSV
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus size={15} />
              Tambah Projek
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          {/* Search */}
          <div className="relative sm:col-span-5">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari perihal kerja, lokasi, atau kontraktor..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 transition-shadow"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Status */}
          <div className="sm:col-span-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 w-full cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Siap">Status: Siap</option>
              <option value="Pembinaan">Status: Pembinaan</option>
              <option value="Perancangan">Status: Perancangan</option>
            </select>
          </div>

          {/* Filter Asset */}
          <div className="sm:col-span-4">
            <select 
              value={assetFilter}
              onChange={(e) => setAssetFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 w-full cursor-pointer"
            >
              {availableAssetTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'Semua' ? 'Semua Jenis Aset' : `Aset: ${type}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Chips Filter */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter size={12} />
            Pantas:
          </span>
          {availableAssetTypes.map((type) => (
            <button
              key={type}
              onClick={() => setAssetFilter(type)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                assetFilter === type 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
          {(statusFilter !== 'Semua' || assetFilter !== 'Semua' || searchQuery !== '') && (
            <button
              onClick={() => {
                setStatusFilter('Semua');
                setAssetFilter('Semua');
                setSearchQuery('');
              }}
              className="ml-auto text-blue-600 hover:text-blue-800 text-[11px] font-semibold underline cursor-pointer"
            >
              Set Semula Penapis
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-md shadow-xs z-10">
            <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Perihal Kerja & Lokasi</th>
              <th className="px-6 py-4">Kontraktor</th>
              <th className="px-6 py-4">Jenis Aset</th>
              <th className="px-6 py-4">Nilai Kerja</th>
              <th className="px-6 py-4">Kaedah</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 w-44">Kemajuan</th>
              <th className="px-4 py-4 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredProjects.length > 0 ? filteredProjects.map((p) => (
              <tr 
                key={p.id} 
                className="hover:bg-blue-50/40 transition-colors group"
              >
                <td 
                  onClick={() => setSelectedProject(p)}
                  className="px-6 py-4 cursor-pointer"
                >
                  <p className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors text-xs leading-relaxed">
                    {p.perihalKerja}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-normal">
                    <MapPin size={11} className="text-slate-400" />
                    {p.lokasi || 'Port Dickson'}
                  </p>
                </td>
                <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                  {p.kontraktor}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {p.jenisAset}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-800 font-bold text-xs whitespace-nowrap">
                  {formatRM(p.nilaiKerja)}
                </td>
                <td className="px-6 py-4 text-slate-600 text-xs whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600 text-[11px]">
                    {p.kaedahPerolehan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={p.statusKerja} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ProgressBar progress={p.kemajuan} status={p.statusKerja} />
                </td>
                <td className="px-4 py-4 text-center whitespace-nowrap">
                  <button 
                    onClick={() => setSelectedProject(p)}
                    className="p-1.5 text-blue-600 hover:bg-blue-100/60 rounded-lg transition-colors cursor-pointer"
                    title="Buka Maklumat Projek"
                  >
                    <ExternalLink size={16} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <Search size={36} className="text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700 text-sm">Tiada Rekod Dijumpai</p>
                    <p className="text-xs text-slate-400 mt-1">Sila tukar kata kunci carian atau tetapkan semula penapis untuk melihat rekod.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count & actions */}
      <div className="p-4 border-t border-slate-200/70 bg-slate-50/50 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>Menunjukkan <strong className="text-slate-700">{filteredProjects.length}</strong> daripada <strong className="text-slate-700">{projects.length}</strong> keseluruhan projek</span>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleResetData}
            className="text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            Pulihkan Data Lalai
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalitik = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 size={22} className="text-blue-600" />
            Laporan & Analitik Prestasi Projek
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Analisis taburan aset, kaedah perolehan, dan nilai peruntukan mengikut kategori</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download size={14} />
          Eksport Laporan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Distribution */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/80">
          <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center">
            <span className="w-2 h-4 bg-purple-500 rounded-full mr-2"></span>
            Taburan Bilangan Mengikut Jenis Aset
          </h3>
          <p className="text-xs text-slate-400 mb-4">Jumlah keseluruhan projek dipecahkan mengikut kategori aset fizikal</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={assetChartData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={65} 
                  outerRadius={105} 
                  paddingAngle={5} 
                  dataKey="value" 
                  label={({name, percent}) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {assetChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Projek`, 'Jumlah']} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Procurement Methods */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/80">
          <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center">
            <span className="w-2 h-4 bg-blue-500 rounded-full mr-2"></span>
            Kaedah Perolehan Projek
          </h3>
          <p className="text-xs text-slate-400 mb-4">Pecahan kaedah lantikan kontraktor (Tender, Sebutharga, Arahan Kerja, dsb.)</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={procurementChartData} margin={{ top: 20, right: 30, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}} 
                  contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  formatter={(val) => [`${val} Projek`, 'Jumlah']}
                />
                <Bar dataKey="jumlah" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {procurementChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Value by Asset (RM Juta) */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/80">
          <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center">
            <span className="w-2 h-4 bg-emerald-500 rounded-full mr-2"></span>
            Nilai Peruntukan Kerja Mengikut Jenis Aset (RM Juta)
          </h3>
          <p className="text-xs text-slate-400 mb-4">Jumlah kos projek dalam nilai Ringgit Malaysia mengikut kategori</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetValueData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(v) => `RM${v}M`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0'}}
                  formatter={(val) => [`RM ${val} Juta`, 'Nilai Peruntukan']}
                />
                <Bar dataKey="nilaiJuta" fill="#10b981" radius={[0, 6, 6, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 font-sans overflow-hidden text-slate-900">
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white/85 backdrop-blur-xl border-r border-slate-200/70 flex-shrink-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.03)]
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
              <Building size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-slate-900 tracking-tight text-lg leading-tight">SPSB</h1>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded">PD</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">JKR Port Dickson</p>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Nav Links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {[
            { id: 'dashboard' as const, label: 'Dashboard Utama', icon: LayoutDashboard },
            { id: 'senarai' as const, label: 'Senarai Projek', icon: ListTodo, badge: projects.length },
            { id: 'analitik' as const, label: 'Laporan & Analitik', icon: BarChart3 }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20' 
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={19} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Tindakan Pantas</p>
            <button
              onClick={() => {
                setIsAddModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              <span>Daftar Projek Baru</span>
            </button>
          </div>
        </nav>
        
        {/* User Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              JD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">Jurutera Daerah</p>
              <p className="text-[11px] text-slate-500 truncate">JKR Daerah Port Dickson</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 h-16 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 z-20 shadow-xs">
          <div className="flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-slate-600 hover:text-slate-900 mr-3 p-1 rounded-lg hover:bg-slate-100"
              aria-label="Buka Menu"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800 capitalize">
                {activeTab === 'senarai' ? 'Senarai Projek' : activeTab === 'analitik' ? 'Laporan Analitik' : 'Dashboard Keseluruhan'}
              </h2>
              <span className="hidden sm:inline-block text-slate-300">|</span>
              <span className="hidden sm:inline-block text-xs font-medium text-slate-500">
                Negeri Sembilan Darul Khusus
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full hidden lg:inline-flex items-center gap-1.5 border border-slate-200/50">
              <Calendar size={13} className="text-slate-400" />
              {new Date().toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="text-slate-500 hover:text-blue-600 p-2 rounded-xl hover:bg-slate-100/70 relative transition-colors cursor-pointer"
                aria-label="Pemberitahuan"
              >
                <Bell size={20} />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                )}
              </button>

              {/* Notification Popover */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <h4 className="text-xs font-bold text-slate-800">Pemberitahuan Sistem</h4>
                    {unreadNotifsCount > 0 && (
                      <button 
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                        className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                      >
                        Tanda semua dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-3.5 hover:bg-slate-50 transition-colors ${notif.unread ? 'bg-blue-50/30' : ''}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-slate-800">{notif.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{notif.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-slate-100 text-center bg-slate-50/40">
                    <button 
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable View Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-10">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'senarai' && renderSenaraiProjek()}
            {activeTab === 'analitik' && renderAnalitik()}
          </div>
        </div>
      </main>

      {/* --- DETAIL MODAL / DRAWER --- */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold mb-2">
                  <span>Aset: {selectedProject.jenisAset}</span>
                  <span>•</span>
                  <span>{selectedProject.kaedahPerolehan}</span>
                </div>
                <h3 className="text-lg font-bold leading-snug">
                  {selectedProject.perihalKerja}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors ml-4"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Nilai Kontrak</p>
                  <p className="text-base font-bold text-slate-800 mt-0.5">{formatRM(selectedProject.nilaiKerja)}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Status Semasa</p>
                  <div className="mt-1"><StatusBadge status={selectedProject.statusKerja} /></div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Kemajuan Fizikal</p>
                  <p className="text-base font-bold text-slate-800 mt-0.5">{selectedProject.kemajuan}%</p>
                </div>
              </div>

              {/* Contractor & Location Info */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
                  <span className="font-semibold text-slate-500">Kontraktor Dilantik:</span>
                  <span className="font-bold text-slate-800 text-right">{selectedProject.kontraktor}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
                  <span className="font-semibold text-slate-500">Lokasi / Jajaran:</span>
                  <span className="font-medium text-slate-700 text-right">{selectedProject.lokasi || 'Port Dickson'}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-slate-500">Kaedah Perolehan:</span>
                  <span className="font-medium text-slate-700 text-right">{selectedProject.kaedahPerolehan}</span>
                </div>
              </div>

              {/* Interactive Progress Adjustment */}
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Edit3 size={14} className="text-blue-600" />
                    Kemaskini Kemajuan Fizikal Kerja
                  </label>
                  <span className="text-xs font-extrabold text-blue-700">{selectedProject.kemajuan}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={selectedProject.kemajuan}
                  onChange={(e) => handleUpdateProgress(selectedProject.id, Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-blue-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-blue-600 font-semibold pt-1">
                  <button 
                    onClick={() => handleUpdateProgress(selectedProject.id, 0)}
                    className="hover:underline cursor-pointer"
                  >
                    0% (Perancangan)
                  </button>
                  <button 
                    onClick={() => handleUpdateProgress(selectedProject.id, 50)}
                    className="hover:underline cursor-pointer"
                  >
                    50% (Separuh Siap)
                  </button>
                  <button 
                    onClick={() => handleUpdateProgress(selectedProject.id, 100)}
                    className="hover:underline cursor-pointer text-emerald-600 font-bold"
                  >
                    100% (Siap Penuh)
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => {
                  if (window.confirm('Adakah anda pasti mahu memadam rekod projek ini?')) {
                    setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
                    setSelectedProject(null);
                  }
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={14} />
                Padam Projek
              </button>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer"
              >
                Selesai / Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAMBAH PROJEK MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Plus size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Daftar Projek Baru</h3>
                  <p className="text-[11px] text-slate-400">Masukkan butiran projek JKR Port Dickson</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Perihal Kerja / Skop Projek *</label>
                <textarea 
                  required
                  rows={2}
                  value={newProject.perihalKerja}
                  onChange={(e) => setNewProject({ ...newProject, perihalKerja: e.target.value })}
                  placeholder="Contoh: MENAIKTARAF JALAN DAN PARIT DI LALUAN FT01..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Aset</label>
                  <select 
                    value={newProject.jenisAset}
                    onChange={(e) => setNewProject({ ...newProject, jenisAset: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Jalan">Jalan</option>
                    <option value="Bangunan">Bangunan</option>
                    <option value="Cerun">Cerun</option>
                    <option value="Jambatan">Jambatan</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kaedah Perolehan</label>
                  <select 
                    value={newProject.kaedahPerolehan}
                    onChange={(e) => setNewProject({ ...newProject, kaedahPerolehan: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Tender">Tender</option>
                    <option value="Sebutharga">Sebutharga</option>
                    <option value="Arahan Kerja">Arahan Kerja</option>
                    <option value="Lantikan Terus">Lantikan Terus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nilai Kerja (RM) *</label>
                  <input 
                    type="number"
                    min="1"
                    required
                    value={newProject.nilaiKerja}
                    onChange={(e) => setNewProject({ ...newProject, nilaiKerja: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Awal</label>
                  <select 
                    value={newProject.statusKerja}
                    onChange={(e) => {
                      const st = e.target.value as any;
                      setNewProject({ 
                        ...newProject, 
                        statusKerja: st, 
                        kemajuan: st === 'Siap' ? 100 : st === 'Perancangan' ? 0 : 20 
                      });
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Perancangan">Perancangan</option>
                    <option value="Pembinaan">Pembinaan</option>
                    <option value="Siap">Siap</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kontraktor *</label>
                <input 
                  type="text"
                  required
                  placeholder="Nama Syarikat / Kontraktor atau BELUM DILANTIK"
                  value={newProject.kontraktor}
                  onChange={(e) => setNewProject({ ...newProject, kontraktor: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Projek</label>
                <input 
                  type="text"
                  placeholder="Contoh: Lukut, Si Rusa, Linggi, dsb."
                  value={newProject.lokasi}
                  onChange={(e) => setNewProject({ ...newProject, lokasi: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Simpan Projek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
