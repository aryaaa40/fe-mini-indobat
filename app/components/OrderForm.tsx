import { useState } from "react";
import { OrderRequest, Product } from "../types";
import { medicineService } from "../services/medicineService";

interface OrderFormProps {
    medicines: Product[];
    onOrderSuccess: () => void;
}

export default function OrderForm({ medicines, onOrderSuccess }: OrderFormProps) {
    
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [discount, setDiscount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const calculateEstimate = () => {
        const medicine = medicines.find((m) => m.id === Number(selectedMedicine));
        if (!medicine) return 0;
        const subtotal = medicine.price * quantity;
        return subtotal - (subtotal * discount) / 100;
    };

    const handleSubmit = async () => {
        if (!selectedMedicine || quantity < 1) {
            alert("Harap pilih obat dan jumlah yang valid!");
            return;
        }

        setIsSubmitting(true);

        try {

            const payload: OrderRequest = {
                product_id: Number(selectedMedicine),
                quantity: quantity,
                discount_percent: discount,
            };

            const result = await medicineService.createOrder(payload);
            alert(result.message);

            setSelectedMedicine("");
            setQuantity(1);
            setDiscount(0);

            onOrderSuccess();

        } catch (error: any) {
            alert("Gagal Membuat Pesanan: " + error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const estimatedPrice = calculateEstimate();

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-[500px]">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Order Form</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pilih Obat
                    </label>
                    <select
                        value={selectedMedicine}
                        onChange={(e) => setSelectedMedicine(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white text-gray-900"
                    >
                        <option value="">-- Pilih Obat --</option>
                        {medicines.map(med => (
                            <option key={med.id} value={med.id}>
                                {med.name} - Rp {med.price.toLocaleString('id-ID')}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Jumlah
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Diskon (%)
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={discount}
                        onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900"
                    />
                </div>

                {selectedMedicine && (
                    <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-gray-700">Estimasi Harga:</span>
                            <span className="text-3xl font-bold text-emerald-600">
                                Rp {estimatedPrice.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                >
                    {isSubmitting ? 'Memproses...' : 'Submit Order'}
                </button>
            </div>
        </div>
    );
}

