'use client';

import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit3, Sprout, Calendar, Droplets } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { Field } from '@/types';

export default function FieldsPage() {
  const { currentFarm, fields, addField, deleteField } = useAppStore();
  const [showModal, setShowModal] = useState(false);

  // New field state
  const [fieldName, setFieldName] = useState('');
  const [areaAcres, setAreaAcres] = useState(3.0);
  const [soilType, setSoilType] = useState('Medium Black Soil');
  const [crop, setCrop] = useState('Tomato');
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().split('T')[0]);
  const [growthStage, setGrowthStage] = useState<Field['growth_stage']>('Vegetative Growth');

  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFarm) return;

    addField({
      farm_id: currentFarm.id,
      field_name: fieldName,
      area_acres: Number(areaAcres),
      soil_type: soilType,
      current_crop: crop,
      sowing_date: sowingDate,
      growth_stage: growthStage,
    });
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFieldName('');
    setAreaAcres(3.0);
    setCrop('Tomato');
    setGrowthStage('Vegetative Growth');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-lightBeige shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primaryGreen">
              Field & Crop Tracking
            </span>
            <h1 className="text-2xl font-extrabold text-forest mt-1">
              Fields in {currentFarm?.farm_name || 'Farm'}
            </h1>
            <p className="text-xs text-darkText/70 mt-1">
              Manage individual cultivated plots, sowing dates, and physiological stages.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primaryGreen hover:bg-forest text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Cultivated Field</span>
          </button>
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => (
            <div
              key={field.id}
              className="bg-white rounded-2xl border border-lightBeige p-6 shadow-sm space-y-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-forest text-lg">{field.field_name}</h3>
                  <span className="text-xs text-darkText/60 block mt-0.5">{field.soil_type}</span>
                </div>
                <span className="bg-forest-50 text-forest text-xs font-bold px-2.5 py-1 rounded-xl border border-forest-100">
                  {field.area_acres} Acres
                </span>
              </div>

              <div className="p-4 rounded-xl bg-warmCream/60 border border-lightBeige space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-darkText/60">Current Crop:</span>
                  <strong className="text-forest text-sm font-extrabold flex items-center space-x-1">
                    <Sprout className="w-4 h-4 text-primaryGreen" />
                    <span>{field.current_crop}</span>
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-darkText/60">Sowing Date:</span>
                  <span className="font-semibold text-darkText">{field.sowing_date}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-darkText/60">Growth Stage:</span>
                  <span className="bg-primaryGreen-light text-primaryGreen font-bold px-2 py-0.5 rounded-md text-[11px]">
                    {field.growth_stage}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-lightBeige text-xs">
                <span className="text-darkText/50 text-[11px]">Active Cycle</span>
                {fields.length > 1 && (
                  <button
                    onClick={() => deleteField(field.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-lg transition"
                    title="Delete Field"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Field Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-lightBeige">
              <div className="flex items-center justify-between border-b border-lightBeige pb-3">
                <h3 className="font-extrabold text-forest text-lg">Add New Field Plot</h3>
                <button onClick={() => setShowModal(false)} className="text-darkText/50 hover:text-darkText">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateField} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Field Name / Plot Identifier
                  </label>
                  <input
                    type="text"
                    required
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    placeholder="e.g. Field 4: West Orchard"
                    className="w-full rounded-xl border border-lightBeige px-3.5 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                      Area (Acres)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={areaAcres}
                      onChange={(e) => setAreaAcres(Number(e.target.value))}
                      className="w-full rounded-xl border border-lightBeige px-3.5 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                      Soil Type
                    </label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full rounded-xl border border-lightBeige px-3 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none bg-white"
                    >
                      <option value="Medium Black Soil">Medium Black Soil</option>
                      <option value="Black Clay Soil">Black Clay Soil</option>
                      <option value="Sandy Loam Soil">Sandy Loam Soil</option>
                      <option value="Red Laterite Soil">Red Laterite Soil</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                      Crop Variety
                    </label>
                    <select
                      value={crop}
                      onChange={(e) => setCrop(e.target.value)}
                      className="w-full rounded-xl border border-lightBeige px-3 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none bg-white"
                    >
                      <option value="Tomato">Tomato</option>
                      <option value="Potato">Potato</option>
                      <option value="Onion">Onion</option>
                      <option value="Corn / Maize">Corn / Maize</option>
                      <option value="Capsicum / Bell Pepper">Capsicum / Bell Pepper</option>
                      <option value="Soybean">Soybean</option>
                      <option value="Wheat">Wheat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                      Sowing Date
                    </label>
                    <input
                      type="date"
                      required
                      value={sowingDate}
                      onChange={(e) => setSowingDate(e.target.value)}
                      className="w-full rounded-xl border border-lightBeige px-3.5 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Crop Growth Stage
                  </label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value as Field['growth_stage'])}
                    className="w-full rounded-xl border border-lightBeige px-3 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none bg-white"
                  >
                    <option value="Germination">Germination</option>
                    <option value="Vegetative Growth">Vegetative Growth</option>
                    <option value="Flowering & Fruit Setting">Flowering & Fruit Setting</option>
                    <option value="Bulb Development">Bulb Development</option>
                    <option value="Ripening / Maturity">Ripening / Maturity</option>
                    <option value="Harvesting">Harvesting</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-lightBeige">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-darkText/70 hover:bg-warmCream font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-forest hover:bg-forest-800 text-white font-bold shadow-sm"
                  >
                    Save Field
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
