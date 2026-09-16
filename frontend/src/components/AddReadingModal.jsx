import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function AddReadingModal({ 
  isOpen, 
  onClose, 
  onReadingAdded,
  initialData = null 
}) {
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
  }, [initialData, isOpen]);

  if (!isOpen) return null;

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
      }, 900);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'record'} daily reading.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-[#D1D1D1] rounded-[2px] p-6 text-[#111111] my-8 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D1D1D1]">
          <div>
            <h3 className="text-base font-bold text-[#111111]">
              {isEditMode ? 'Edit Daily Reading' : 'Add Daily Reading'}
            </h3>
            <p className="text-xs text-[#5C5C5C] mt-0.5">
              {isEditMode 
                ? `Update production, cost, and resource metrics for ${formData.date}`
                : 'Enter production, cost, and resource metrics for a single operating day'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[2px] text-[#5C5C5C] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback states */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 border-l-4 border-l-red-600 rounded-[2px] flex items-center space-x-2 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 border-l-4 border-l-green-600 rounded-[2px] flex items-center space-x-2 text-xs text-green-800">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>{typeof success === 'string' ? success : 'Saved successfully. Updating dashboard...'}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            
            {/* Date */}
            <div className="sm:col-span-2">
              <label className="block text-[#111111] font-medium mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-1.5 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            {/* Hydrogen Produced */}
            <div>
              <label className="block text-[#111111] font-medium mb-1">
                Hydrogen Produced (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="hydrogenProduced"
                required
                value={formData.hydrogenProduced}
                onChange={handleChange}
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-1.5 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            {/* Hydrogen Consumed */}
            <div>
              <label className="block text-[#111111] font-medium mb-1">
                Hydrogen Consumed (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="hydrogenConsumed"
                required
                value={formData.hydrogenConsumed}
                onChange={handleChange}
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-1.5 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            {/* Target Production */}
            <div>
              <label className="block text-[#111111] font-medium mb-1">
                Target Production (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="targetProduction"
                required
                value={formData.targetProduction}
                onChange={handleChange}
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-1.5 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            {/* Energy Consumed */}
            <div>
              <label className="block text-[#111111] font-medium mb-1">
                Energy Consumed (MWh) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="energyConsumed"
                required
                value={formData.energyConsumed}
                onChange={handleChange}
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-1.5 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            {/* Renewable Energy */}
            <div>
              <label className="block text-[#111111] font-medium mb-1">
                Renewable Energy Share (MWh) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="renewableEnergy"
                required
                value={formData.renewableEnergy}
                onChange={handleChange}
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-1.5 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            {/* Water Consumed */}
            <div>
              <label className="block text-[#111111] font-medium mb-1">
                Water Consumed (Liters) *
              </label>
              <input
                type="number"
                min="0"
                name="waterConsumed"
                required
                value={formData.waterConsumed}
                onChange={handleChange}
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-1.5 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            {/* Electricity Cost */}
            <div>
              <label className="block text-[#111111] font-medium mb-1">
                Electricity Cost (₹) *
              </label>
              <input
                type="number"
                min="0"
                name="electricityCost"
                required
                value={formData.electricityCost}
                onChange={handleChange}
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-1.5 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            {/* Water Cost */}
            <div>
              <label className="block text-[#111111] font-medium mb-1">
                Water Cost (₹) *
              </label>
              <input
                type="number"
                min="0"
                name="waterCost"
                required
                value={formData.waterCost}
                onChange={handleChange}
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-1.5 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            {/* Maintenance Cost */}
            <div>
              <label className="block text-[#111111] font-medium mb-1">
                Maintenance Cost (₹) *
              </label>
              <input
                type="number"
                min="0"
                name="maintenanceCost"
                required
                value={formData.maintenanceCost}
                onChange={handleChange}
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-1.5 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            {/* CO2 Emissions */}
            <div className="sm:col-span-2">
              <label className="block text-[#111111] font-medium mb-1">
                CO₂ Emissions (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="co2Emissions"
                required
                value={formData.co2Emissions}
                onChange={handleChange}
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-1.5 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#D1D1D1] flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3.5 py-1.5 bg-white border border-[#D1D1D1] hover:border-black text-[#111111] rounded-[2px] text-xs font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-[#111111] hover:bg-black text-white rounded-[2px] text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {loading 
                ? (isEditMode ? 'Saving Changes...' : 'Saving...') 
                : (isEditMode ? 'Save Changes' : 'Save Reading')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
