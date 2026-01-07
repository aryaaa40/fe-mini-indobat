"use client";

import { useEffect, useState } from "react";
import { Product } from "./types";
import { medicineService } from "./services/medicineService";
import OrderForm from "./components/OrderForm";

export default function PharmacyDashboard() {
  const [medicines, setMedicines] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { label: "Habis", color: "bg-red-100 text-red-700" };
    if (stock <= 5) return { label: "Menipis", color: "bg-orange-100 text-orange-700" };
    return { label: "Tersedia", color: "bg-green-100 text-green-700" };
  };

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const data = await medicineService.getAll();
      setTimeout(() => {
        setMedicines(data);
        setLoading(false);
      }, 500);
    } catch (error: any) {
      alert("Error: " + error);
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PBF Farmasi</h1>
              <p className="text-sm text-gray-600 mt-1">Manajemen Stok & Order Obat</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Daftar Obat</h2>
                  <button
                    onClick={fetchMedicines}
                    disabled={loading} 
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-700 rounded-lg text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <svg
                      className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    {loading ? "Memperbarui..." : "Perbarui Data"}
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Nama Obat</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Sisa Stok</th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Harga</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {medicines.map((medicine, index) => {
                        const status = getStockStatus(medicine.stock);
                        return (
                          <tr key={medicine.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                  {index + 1}
                                </div>
                                <span className="font-semibold text-gray-900">{medicine.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center justify-center min-w-[60px] h-8 bg-gray-100 rounded-lg font-bold text-gray-900 px-3">
                                {medicine.stock}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-gray-900">
                              Rp {medicine.price.toLocaleString("id-ID")}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderForm medicines={medicines} onOrderSuccess={fetchMedicines} />
          </div>
        </div>
      </div>
    </div>
  );
}