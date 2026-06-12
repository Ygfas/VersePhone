"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react";

const EMPTY_FORM = {
  nama: "", harga: "", stok: "",
  jenis: "", RAM: "", ROM: "", SOC: "", jaringan: "", warna: "",
  main_camera: "", selfie_camera: "", battery: "", charging: "", os: "",
};

export default function ProdukPage() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

 const load = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/produk?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      
      // Mencegah error .map() dengan memastikan data adalah array
      if (Array.isArray(data)) {
        setRows(data);
      } else {
        console.error("API Error:", data);
        setRows([]); // Set ke array kosong jika gagal
      }
    } catch (error) {
      console.error("Fetch failed:", error);
      setRows([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    load(query);
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setImageFile(null);
    setModal("create");
  };

  const openEdit = (r) => {
    setForm({
      nama: r.nama || "", harga: r.harga || "", stok: r.stok || "",
      jenis: r.jenis || "", RAM: r.RAM || "", ROM: r.ROM || "",
      SOC: r.SOC || "", jaringan: r.jaringan || "", warna: r.warna || "",
      main_camera: r.main_camera || "", selfie_camera: r.selfie_camera || "",
      battery: r.battery || "", charging: r.charging || "", os: r.os || "",
    });
    setEditId(r.id_produk);
    setImageFile(null);
    setModal("edit");
  };

 const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("gambar", imageFile);

      let res;
      if (modal === "create") {
        res = await fetch("/api/dashboard/produk", { method: "POST", body: fd });
      } else {
        res = await fetch(`/api/dashboard/produk/${editId}`, { method: "PUT", body: fd });
      }

      // Ambil pesan error dari server jika ada
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan data ke database");
      }

      setModal(null);
      load(query);
    } catch (err) {
      alert(`Error: ${err.message}`); // Tampilkan pesan error ke layar
      console.error("Save Error:", err);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus produk ini?")) return;
    await fetch(`/api/dashboard/produk/${id}`, { method: "DELETE" });
    load(query);
  };

  const fields = [
    ["nama", "Nama Brand"], ["harga", "Harga (juta)"], ["stok", "Stok"],
    ["jenis", "Jenis / Model"], ["RAM", "RAM (GB)"], ["ROM", "ROM"],
    ["SOC", "Processor (SoC)"], ["jaringan", "Jaringan"], ["warna", "Warna"],
    ["main_camera", "Kamera Utama"], ["selfie_camera", "Kamera Selfie"],
    ["battery", "Baterai"], ["charging", "Charging"], ["os", "OS"],
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Manajemen Produk</h2>
          <p className="text-xs text-gray-400 mt-0.5">{rows.length} produk</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => load(query)} className="p-2 rounded-lg hover:bg-gray-50 text-gray-400">
            <RefreshCw size={16} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={15} /> Tambah Produk
          </button>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama produk, jenis..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white"
          />
        </div>
        <button type="submit" className="px-4 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800">
          Cari
        </button>
      </form>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-4 text-center py-12 text-xs text-gray-400">Memuat...</div>
        ) : rows.length === 0 ? (
          <div className="col-span-4 text-center py-12 text-xs text-gray-400">Tidak ada produk</div>
        ) : (
          rows.map((r) => (
            <div key={r.id_produk} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
              <div className="aspect-square bg-gray-50 relative overflow-hidden">
                {r.gambar ? (
                  <img
                    src={`data:image/jpeg;base64,${r.gambar}`}
                    alt={r.nama}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-gray-900 text-sm">{r.nama}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{r.jenis}</p>
                <p className="text-sm font-bold text-gray-800 mt-1.5">
                  Rp {(parseFloat(r.harga) || 0).toFixed(2)}M
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">Stok: {r.stok}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(r)}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id_produk)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-semibold text-gray-900 text-sm">
                {modal === "create" ? "Tambah Produk" : "Edit Produk"}
              </h3>
              <button onClick={() => setModal(null)}>
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-4">
              <div className="grid grid-cols-2 gap-3">
                {fields.map(([key, label]) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                    <input
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Gambar Produk</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
