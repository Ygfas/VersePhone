"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Pencil, Trash2, X, ExternalLink, RefreshCw } from "lucide-react";

const EMPTY_FORM = { judul: "", konten: "", sumber: "" };

export default function ArtikelPage() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const load = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/artikel?q=${encodeURIComponent(q)}`);
      setRows(await res.json());
    } catch (_) {}
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
    setForm({ judul: r.judul || "", konten: r.konten || "", sumber: r.sumber || "" });
    setEditId(r.id_artikel);
    setImageFile(null);
    setModal("edit");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("judul", form.judul);
      fd.append("konten", form.konten);
      fd.append("sumber", form.sumber);
      if (imageFile) fd.append("gambar_artikel", imageFile);

      if (modal === "create") {
        await fetch("/api/dashboard/artikel", { method: "POST", body: fd });
      } else {
        await fetch(`/api/dashboard/artikel/${editId}`, { method: "PUT", body: fd });
      }
      setModal(null);
      load(query);
    } catch (_) {}
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus artikel ini?")) return;
    await fetch(`/api/dashboard/artikel/${id}`, { method: "DELETE" });
    load(query);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Manajemen Artikel</h2>
          <p className="text-xs text-gray-400 mt-0.5">{rows.length} artikel</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => load(query)} className="p-2 rounded-lg hover:bg-gray-50 text-gray-400">
            <RefreshCw size={16} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={15} /> Tambah Artikel
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
            placeholder="Cari judul, konten..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white"
          />
        </div>
        <button type="submit" className="px-4 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800">
          Cari
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-xs text-gray-400">Memuat...</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-400">Tidak ada artikel</div>
        ) : (
          rows.map((r) => (
            <div key={r.id_artikel} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
              {r.gambar_artikel && (
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={r.gambar_artikel}
                    alt={r.judul}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{r.judul}</h3>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit(r)}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id_artikel)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{r.konten}</p>
                {r.sumber && (
                  <a
                    href={r.sumber.startsWith("http") ? r.sumber : `https://${r.sumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline mt-1.5"
                  >
                    <ExternalLink size={11} /> {r.sumber}
                  </a>
                )}
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
                {modal === "create" ? "Tambah Artikel" : "Edit Artikel"}
              </h3>
              <button onClick={() => setModal(null)}>
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Judul</label>
                <input
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Konten</label>
                <textarea
                  value={form.konten}
                  onChange={(e) => setForm({ ...form, konten: e.target.value })}
                  rows={5}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Sumber URL</label>
                <input
                  value={form.sumber}
                  onChange={(e) => setForm({ ...form, sumber: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="www.contoh.com"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Gambar Artikel</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
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
