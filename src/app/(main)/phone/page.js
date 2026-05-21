"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function PhonesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Memanggil API internal Next.js menggunakan Axios
        const response = await axios.get("/api/product");
        setProducts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <div className="p-8 text-center text-gray-500">Memuat data...</div>;
  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Daftar Gadget</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">Tidak ada data yang tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition"
            >
              {/* Sesuaikan properti item dengan nama kolom di tabel MySQL Anda */}
              <h2 className="text-xl font-semibold text-gray-900">
                {item.name || item.nama}
              </h2>
              {/* <p className="text-gray-600 mt-1">Brand: {item.brand}</p>
              <p className="text-indigo-600 font-bold mt-2">
                Rp {Number(item.price || item.harga).toLocaleString("id-ID")}
              </p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
