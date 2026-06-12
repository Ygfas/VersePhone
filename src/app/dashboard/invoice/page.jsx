"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, Eye, X, Trash2, RefreshCw } from "lucide-react";

// Hapus Cancelled, fokus ke Pending dan Success
const STATUS_COLORS = {
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Success: "bg-green-50 text-green-700 border-green-200",
};

export default function InvoicePage() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [editStatus, setEditStatus] = useState(null);

  const load = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/invoice?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setRows(data);
      } else {
        console.error("API Error:", data);
        setRows([]); 
      }
    } catch (error) {
      console.error("Fetch failed:", error);
      setRows([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    load(query);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus transaksi ini?")) return;
    setDeleting(id);
    await fetch(`/api/dashboard/invoice/${id}`, { method: "DELETE" });
    setDeleting(null);
    load(query);
  };

  const handleStatusUpdate = async () => {
    if (!editStatus) return;
    await fetch(`/api/dashboard/invoice/${editStatus.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: editStatus.status }),
    });
    setEditStatus(null);
    load(query);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Invoice & Transaksi</h2>
          <p className="text-xs text-gray-400 mt-0.5">{rows.length} transaksi ditemukan</p>
        </div>
        <button onClick={() => load(query)} className="p-2 rounded-lg hover:bg-gray-50 text-gray-400">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kode transaksi, nama produk..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
        >
          Cari
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Kode", "Produk", "Pembeli", "Alamat", "Kontak", "Status", "Waktu", "Aksi"].map(
                  (h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-gray-400">
                    Memuat data...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-gray-400">
                    Tidak ada transaksi ditemukan
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id_transaksi} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{r.kode_transaksi}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{r.nama_produk}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      {r.first_name} {r.user_name}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[120px] truncate">
                      {r.alamat}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.no_tlp_or_email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                          STATUS_COLORS[r.status] || "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {r.waktu_pembayaran ? new Date(r.waktu_pembayaran).toLocaleDateString("id-ID") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelected(r)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                          title="Detail"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setEditStatus({ id: r.id_transaksi, status: r.status })}
                          className="px-2 py-1 rounded-md text-xs text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(r.id_transaksi)}
                          disabled={deleting === r.id_transaksi}
                          className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">Detail Transaksi</h3>
              <button onClick={() => setSelected(null)}>
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              {[
                ["Kode Transaksi", selected.kode_transaksi],
                ["Produk", selected.nama_produk],
                ["Pembeli", `${selected.first_name} ${selected.user_name}`],
                ["Alamat", selected.alamat],
                ["Kontak", selected.no_tlp_or_email],
                ["Status", selected.status],
                ["Waktu Pembayaran", selected.waktu_pembayaran],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-xs text-gray-400">{k}</span>
                  <span className="text-xs font-medium text-gray-800 text-right max-w-[200px] truncate">
                    {v ?? "-"}
                  </span>
                </div>
              ))}
              {selected.bukti_pembayaran && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Bukti Pembayaran</p>
                  <img
                    src={`data:image/jpeg;base64,${selected.bukti_pembayaran}`}
                    alt="bukti"
                    className="w-full rounded-lg border border-gray-100 object-cover max-h-48"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {editStatus && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">Update Status</h3>
              <button onClick={() => setEditStatus(null)}>
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="px-6 py-4">
              <select
                value={editStatus.status}
                onChange={(e) => setEditStatus({ ...editStatus, status: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
              >
                {/* HANYA ADA 2 OPSI SEKARANG */}
                <option value="Pending">Pending</option>
                <option value="Success">Success</option>
              </select>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditStatus(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}