import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motorcycleApi } from '../../services/api';

const MotorcycleForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    type: 'matic',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    currentKm: 0,
    plateNumber: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ======================================================
     LOAD DATA SAAT EDIT
  ====================================================== */
  useEffect(() => {
    if (isEditMode) {
      const fetchMotorcycle = async () => {
        try {
          setLoading(true);
          const response = await motorcycleApi.getById(id);

          setFormData({
            type: response.data.type,
            brand: response.data.brand,
            model: response.data.model,
            year: response.data.year,
            currentKm: response.data.currentKm,
            plateNumber: response.data.plateNumber || '',
          });

        } catch (err) {
          console.error('Error fetching motorcycle:', err);
          setError('Gagal memuat data motor');
        } finally {
          setLoading(false);
        }
      };
      
      fetchMotorcycle();
    }
  }, [id, isEditMode]);

  /* ======================================================
     HANDLE INPUT
  ====================================================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: 
        name === 'year' || name === 'currentKm'
          ? parseInt(value, 10) || 0
          : value
    }));
  };

  /* ======================================================
     SUBMIT FORM
  ====================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError('');

      const formattedData = {
        type: formData.type,
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        currentKm: Number(formData.currentKm),
        plateNumber: formData.plateNumber || null
      };

      if (isEditMode) {
        await motorcycleApi.update(id, formattedData);

        // ⬅️ FIX BACK BUTTON ISSUE: pakai replace: true
        navigate(`/motorcycles/${id}`, { replace: true });

      } else {
        const response = await motorcycleApi.create(formattedData);

        // ⬅️ Ke detail motor baru dan hapus history form
        navigate(`/motorcycles/${response.data.id}`, { replace: true });
      }

    } catch (err) {
      console.error('Error saving motorcycle:', err);
      setError('Gagal menyimpan data motor. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ======================================================
     LOADING STATE
  ====================================================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Memuat...</p>
      </div>
    );
  }

  /* ======================================================
     DROPDOWN TAHUN
  ====================================================== */
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear + 1; year >= 1980; year--) {
    yearOptions.push(year);
  }

  /* ======================================================
     RENDER UI
  ====================================================== */
  return (
    <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">

        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Data Motor' : 'Tambah Motor Baru'}
          </h2>

          <button
            type="button"
            onClick={() => navigate('/motorcycles')}
            className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm 
              font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Batal
          </button>
        </div>

        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">

            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2">

                  {/* TYPE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipe Motor</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="matic">Matic</option>
                      <option value="bebek">Bebek</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>

                  {/* PLAT NOMOR */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nomor Polisi</label>
                    <input
                      type="text"
                      name="plateNumber"
                      value={formData.plateNumber}
                      onChange={handleChange}
                      placeholder="Contoh: B 1234 ABC"
                      maxLength="15"
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>

                  {/* BRAND */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Merek <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>

                  {/* MODEL */}
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>

                  {/* YEAR */}
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Tahun <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    >
                      {yearOptions.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* CURRENT KM */}
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Kilometer Saat Ini (km) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="currentKm"
                      min="0"
                      value={formData.currentKm}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    />
                  </div>

                </div>

                <div className="pt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/motorcycles')}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm 
                    text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-3 py-2 px-4 text-sm font-medium rounded-md text-white 
                    bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>

              </div>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default MotorcycleForm;
