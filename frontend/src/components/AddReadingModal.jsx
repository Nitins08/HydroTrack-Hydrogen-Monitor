import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, AlertCircle, CheckCircle2, Save, Plus, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { modalOverlayVariants, modalContentVariants } from '../utils/animations';

export default function AddReadingModal({ 
  isOpen, 
  onClose, 
  onReadingAdded,
  initialData = null 
}) {
  const shouldReduceMotion = useReducedMotion();
  const isEditMode = Boolean(initialData && initialData._id);

  const defaultValues = {
    date: new Date().toISOString().slice(0, 10),
    hydrogenProduced: 1350,
    hydrogenConsumed: 1280,
    targetProduction: 1350,
    energyConsumed: 70.2,
    renewableEnergy: 56.5,
    waterConsumed: 14200,
    electricityCost: 130000,
    waterCost: 7800,
    maintenanceCost: 18000,
    co2Emissions: 620
  };

  const [formData, setFormData] = useState(defaultValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData({
        date: initialData.date ? initialData.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
        hydrogenProduced: initialData.hydrogenProduced ?? 0,
        hydrogenConsumed: initialData.hydrogenConsumed ?? 0,
        targetProduction: initialData.targetProduction ?? 1350,
        energyConsumed: initialData.energyConsumed ?? 0,
        renewableEnergy: initialData.renewableEnergy ?? 0,
        waterConsumed: initialData.waterConsumed ?? 0,
        electricityCost: initialData.electricityCost ?? 0,
        waterCost: initialData.waterCost ?? 0,
        maintenanceCost: initialData.maintenanceCost ?? 0,
        co2Emissions: initialData.co2Emissions ?? 0
      });
    } else {
      setFormData(defaultValues);
    }
    setError(null);
    setSuccess(false);
  }, [initialData, isOpen, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'date' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (isEditMode) {
        await api.updateReading(initialData._id, formData);
        setSuccess('Reading updated successfully.');
      } else {
        await api.addReading(formData);
        setSuccess('Reading saved successfully.');
      }

      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onReadingAdded) {
          onReadingAdded();
        }
      }, 700);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'record'} daily reading.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            variants={modalOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px]"
          />

          {/* Modal Card */}
          <motion.div
            variants={shouldReduceMotion ? {} : modalContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-[3px] p-6 text-gray-900 my-8 shadow-xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                  <span>{isEditMode ? 'Edit Daily Reading' : 'Add Daily Reading'}</span>
                  <span className="text-[10px] font-normal uppercase font-mono px-2 py-0.5 rounded-[2px] bg-teal-50 border border-teal-200 text-teal-800">
                    Simulated Operational Log
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Record plant telemetry for production, resources, and operating expenditures.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification alert */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 border-l-4 border-l-red-600 rounded-[2px] flex items-center space-x-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mt-4 p-3 bg-teal-50 border border-teal-200 border-l-4 border-l-teal-600 rounded-[2px] flex items-center space-x-2 text-xs text-teal-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                
                {/* 1. Date */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-1.5 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* 2. Target Production */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Target Production (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="targetProduction"
                    required
                    value={formData.targetProduction}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-1.5 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono"
                  />
                </div>

                {/* 3. Hydrogen Produced */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Hydrogen Produced (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="hydrogenProduced"
                    required
                    value={formData.hydrogenProduced}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-1.5 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono"
                  />
                </div>

                {/* 4. Hydrogen Consumed */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Hydrogen Consumed (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="hydrogenConsumed"
                    required
                    value={formData.hydrogenConsumed}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-1.5 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono"
                  />
                </div>

                {/* 5. Energy Consumed */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Total Energy Consumed (MWh) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="energyConsumed"
                    required
                    value={formData.energyConsumed}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-1.5 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono"
                  />
                </div>

                {/* 6. Renewable Energy */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Renewable Energy (MWh) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="renewableEnergy"
                    required
                    value={formData.renewableEnergy}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-1.5 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono"
                  />
                </div>

                {/* 7. Water Consumed */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Water Consumed (Liters) *
                  </label>
                  <input
                    type="number"
                    name="waterConsumed"
                    required
                    value={formData.waterConsumed}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-1.5 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono"
                  />
                </div>

                {/* 8. CO2 Emissions */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    CO₂ Emissions (kg CO₂) *
                  </label>
                  <input
                    type="number"
                    name="co2Emissions"
                    required
                    value={formData.co2Emissions}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-1.5 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono"
                  />
                </div>

                {/* 9. Electricity Cost */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Electricity Cost (₹) *
                  </label>
                  <input
                    type="number"
                    name="electricityCost"
                    required
                    value={formData.electricityCost}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-1.5 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono"
                  />
                </div>

                {/* 10. Water Cost */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Water Cost (₹) *
                  </label>
                  <input
                    type="number"
                    name="waterCost"
                    required
                    value={formData.waterCost}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-1.5 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono"
                  />
                </div>

                {/* 11. Maintenance Cost */}
                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Maintenance Cost (₹) *
                  </label>
                  <input
                    type="number"
                    name="maintenanceCost"
                    required
                    value={formData.maintenanceCost}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-1.5 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono"
                  />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-1.5 bg-white border border-gray-300 hover:border-gray-900 text-gray-800 rounded-[2px] text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { y: -1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-[2px] text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs"
                >
                  {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : isEditMode ? (
                    <Save className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>{loading ? 'Saving...' : isEditMode ? 'Update Reading' : 'Save Reading'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
