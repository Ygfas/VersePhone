"use client";
import { useEffect, useState, useCallback } from "react";
import { FileSpreadsheet, FileText, Printer, RefreshCw } from "lucide-react";

export default function LaporanPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState({ from: "", to: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (range.from) params.append("from", range.from);
      if (range.to) params.append("to", range.to);
      const res = await fetch(`/api/dashboard/laporan?${params}`);
      
      const responseData = await res.json();
      if(Array.isArray(responseData)) {
        setData(responseData);
      } else {
        setData([]);
      }
    } catch (_) {
      setData([]);
    }
    setLoading(false);
  }, [range]);

  useEffect(() => { load(); }, [load]);

  const exportExcel = async () => {
    const params = new URLSearchParams();
    if (range.from) params.append("from", range.from);
    if (range.to) params.append("to", range.to);
    const res = await fetch(`/api/dashboard/laporan/export-excel?${params}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan-penjualan.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    window.print();
  };

  const total = data.reduce((acc, r) => acc + (parseFloat(r.harga) || 0), 0);
  const paidCount = data.filter((r) => r.status === "Success" || r.status === "Paid").length;

  return (
    <div className="space-y-4">
      {/* Header Laporan Khusus Print (Disembunyikan di layar, muncul saat di-print) */}
      <div className="hidden print:block mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Laporan Penjualan TechStore</h1>
        <p className="text-gray-500 mt-2">
          {range.from && range.to
            ? `Periode: ${new Date(range.from).toLocaleDateString('id-ID')} — ${new Date(range.to).toLocaleDateString('id-ID')}`
            : "Semua Periode"}
        </p>
      </div>

      {/* Bagian Kontrol (Disembunyikan saat Print) */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Laporan Penjualan</h2>
          <p className="text-xs text-gray-400 mt-0.5">{data.length} transaksi</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 rounded-lg hover:bg-gray-50 text-gray-400">
            <RefreshCw size={16} />
          </button>
          <button
            onClick={exportExcel}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet size={15} className="text-green-600" /> Excel
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText size={15} className="text-red-500" /> PDF
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Printer size={15} /> Print
          </button>
        </div>
      </div>

      {/* Filter (Disembunyikan saat Print) */}
      <div className="flex gap-3 items-end bg-white border border-gray-100 rounded-xl p-4 print:hidden">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Dari Tanggal</label>
          <input
            type="date"
            value={range.from}
            onChange={(e) => setRange({ ...range, from: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Sampai Tanggal</label>
          <input
            type="date"
            value={range.to}
            onChange={(e) => setRange({ ...range, to: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>
        <button onClick={load} className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800">
          Filter
        </button>
        <button
          onClick={() => { setRange({ from: "", to: "" }); setTimeout(load, 0); }}
          className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
        >
          Reset
        </button>
      </div>

      {/* Summary cards (Tetap dicetak) */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">Total Transaksi</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">Transaksi Sukses</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {paidCount}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">Total Nilai Penjualan</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">Rp {total.toFixed(1)}M</p>
        </div>
      </div>

      {/* Table (Tetap dicetak) */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" id="laporan-table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["No", "Kode", "Produk", "Harga", "Pembeli", "Status", "Tanggal"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400 print:hidden">Memuat...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400 print:hidden">Tidak ada data pada periode ini</td>
                </tr>
              ) : (
                data.map((r, i) => (
                  <tr key={r.id_transaksi} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 font-mono text-xs">{r.kode_transaksi}</td>
                    <td className="px-4 py-3 text-xs">{r.nama_produk}</td>
                    <td className="px-4 py-3 text-xs font-medium">
                      Rp {(parseFloat(r.harga) || 0).toFixed(2)}M
                    </td>
                    <td className="px-4 py-3 text-xs">{r.first_name} {r.user_name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        r.status === "Success" || r.status === "Paid" ? "bg-green-50 text-green-700 border-green-200" :
                        r.status === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                        "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {r.waktu_pembayaran ? new Date(r.waktu_pembayaran).toLocaleDateString("id-ID") : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {data.length > 0 && (
              <tfoot className="print:table-footer-group">
                <tr className="border-t border-gray-100 bg-gray-50">
                  <td colSpan={3} className="px-4 py-3 text-xs font-semibold text-gray-700">
                    Total
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-gray-900">
                    Rp {total.toFixed(1)}M
                  </td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
      
      {/* Jika Anda memiliki navigasi Sidebar atau Navbar di Layout Anda, 
          pastikan Anda menambahkan class `print:hidden` pada komponen tersebut di file Layout.js Anda */}
    </div>
  );
}