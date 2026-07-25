import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

export interface Review {
  reviewId: string;
  employeeHash: string;
  reviewerHash: string;
  rating?: number;
  strengths?: string;
  areasForImprovement?: string;
  comments?: string;
  goals?: string;
  promotionRecommendation?: boolean;
  salaryRecommendation?: string;
  timestamp: string;
  status: number; // 1 = Submitted, 2 = Acknowledged, 3 = Appealed
  appealMessage?: string;
}

interface ReviewTableProps {
  reviews: Review[];
  role: 'guest' | 'manager' | 'employee' | 'hr';
  onSelectReview: (review: Review) => void;
  onAcknowledge: (review: Review) => void;
  onAppeal: (review: Review) => void;
}

export const ReviewTable: React.FC<ReviewTableProps> = ({
  reviews,
  role,
  onSelectReview,
  onAcknowledge,
  onAppeal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter reviews
  const filtered = reviews.filter((r) => {
    const matchesSearch = 
      r.reviewId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.employeeHash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || Number(r.status) === Number(statusFilter);
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Status badge styling helper
  const getStatusBadge = (statusNum: number) => {
    switch (Number(statusNum)) {
      case 1:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold">
            <Clock className="w-3 h-3" />
            <span>Submitted</span>
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
            <CheckCircle className="w-3 h-3" />
            <span>Acknowledged</span>
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-semibold">
            <AlertTriangle className="w-3 h-3" />
            <span>Appealed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-gray-500/10 border border-gray-500/30 text-gray-400 text-[11px] font-semibold">
            <span>Pending ({statusNum})</span>
          </span>
        );
    }
  };

  // Export CSV helper
  const exportCSV = () => {
    const headers = ['Review ID', 'Employee Hash', 'Reviewer Hash', 'Status', 'Timestamp'];
    const rows = filtered.map(r => [
      r.reviewId,
      r.employeeHash,
      r.reviewerHash,
      r.status,
      new Date(Number(r.timestamp) * 1000).toLocaleString()
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `midnight_reviews_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-3xl bg-[#121829]/90 backdrop-blur-xl border border-white/10 p-6 shadow-2xl space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Review ID or Hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Filters & Export */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 bg-black/30 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition ${statusFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter(1)}
              className={`px-3 py-1 rounded-lg font-medium transition ${statusFilter === 1 ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Submitted
            </button>
            <button
              onClick={() => setStatusFilter(2)}
              className={`px-3 py-1 rounded-lg font-medium transition ${statusFilter === 2 ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Acknowledged
            </button>
            <button
              onClick={() => setStatusFilter(3)}
              className={`px-3 py-1 rounded-lg font-medium transition ${statusFilter === 3 ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Appealed
            </button>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/10 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-black/40 text-gray-400 uppercase tracking-wider font-semibold border-b border-white/10">
            <tr>
              <th className="py-3.5 px-4">Review ID</th>
              <th className="py-3.5 px-4">Employee Hash</th>
              <th className="py-3.5 px-4">Reviewer Hash</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Date / Time</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginated.length > 0 ? (
              paginated.map((rev) => (
                <tr key={rev.reviewId} className="hover:bg-white/5 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">
                    {rev.reviewId}
                  </td>
                  <td className="py-3.5 px-4 font-mono-hash text-gray-400">
                    {rev.employeeHash.substring(0, 12)}...
                  </td>
                  <td className="py-3.5 px-4 font-mono-hash text-gray-400">
                    {rev.reviewerHash.substring(0, 12)}...
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(rev.status)}
                  </td>
                  <td className="py-3.5 px-4 text-gray-400">
                    {new Date(Number(rev.timestamp) * 1000).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => onSelectReview(rev)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-medium transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    {role === 'employee' && Number(rev.status) === 1 && (
                      <button
                        onClick={() => onAcknowledge(rev)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium transition"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    )}

                    {role === 'employee' && Number(rev.status) === 2 && (
                      <button
                        onClick={() => onAppeal(rev)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium transition"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Appeal</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No performance reviews match the current query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
        <span>Showing {paginated.length} of {filtered.length} items</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
