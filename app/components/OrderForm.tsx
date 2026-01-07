import { useState } from "react";
import { OrderRequest, Product } from "../types";
import { medicineService } from "../services/medicineService";
import toast from "react-hot-toast";

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
            toast.error("Harap pilih obat dan jumlah yang valid!");
            return;
        }

        setIsSubmitting(true);

        const orderPromise = (async () => {
            const payload: OrderRequest = {
                product_id: Number(selectedMedicine),
                quantity: quantity,
                discount_percent: discount,
            };

            const result = await medicineService.createOrder(payload);

            handleResetForm();
            onOrderSuccess();

            return result.message;
        })();

        toast.promise(orderPromise, {
            loading: 'Sedang memproses pesanan...',
            success: (msg) => <b>Pesanan berhasil dibuat!</b>,
            error: (err) => <b>Maaf, stok sudah habis!</b>,
        });

        try {
            await orderPromise;
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetForm = () => {
        setSelectedMedicine("");
        setQuantity(1);
        setDiscount(0);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        if (/^\d*$/.test(val)) {
            const num = val === "" ? 0 : parseInt(val);
            setQuantity(num);
        }
    };

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        if (/^\d*$/.test(val)) {
            const num = val === "" ? 0 : parseInt(val);
            if (num <= 100) {
                setDiscount(num);
            } else {
                toast.error("Diskon tidak boleh lebih dari 100%");
            }
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
                <h2 className="text-2xl font-bold text-gray-900">Formulir Pemesanan</h2>
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
                                {med.name}  -  Rp {med.price.toLocaleString('id-ID')}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Jumlah Beli
                    </label>
                    <input
                        type="text"
                        placeholder="0"
                        value={quantity === 0 ? "" : quantity}
                        onChange={handleQuantityChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Diskon (%)
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="0"
                            value={discount === 0 ? "" : discount}
                            onChange={handleDiscountChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-900 pr-10"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <span className="text-gray-400 font-bold">%</span>
                        </div>
                    </div>
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

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleResetForm}
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Batal
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-[2] bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memproses...
                            </span>
                        ) : (
                            'Proses Pemesanan'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

