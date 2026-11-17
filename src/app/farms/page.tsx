'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Edit3, Check, Globe } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { Farm } from '@/types';

export default function FarmsPage() {
  const { farms, currentFarm, setCurrentFarm, addFarm, editFarm, deleteFarm } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFarmId, setEditingFarmId] = useState<string | null>(null);

  // Form State
  const [farmName, setFarmName] = useState('');
  const [village, setVillage] = useState('Haveli / Narhe');
  const [district, setDistrict] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [latitude, setLatitude] = useState(18.4575);
  const [longitude, setLongitude] = useState(73.8184);
  const [totalArea, setTotalArea] = useState(12.5);
  const [soilType, setSoilType] = useState('Medium Black Soil (Vertisol)');

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    addFarm({
      farm_name: farmName,
      village,
      district,
      state,
      latitude: Number(latitude),
      longitude: Number(longitude),
      total_area_acres: Number(totalArea),
      dominant_soil_type: soilType,
      is_active: true,
    });
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFarmName('');
    setVillage('Haveli / Narhe');
    setLatitude(18.4575);
    setLongitude(73.8184);
    setTotalArea(10);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-lightBeige shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primaryGreen">
              Land Administration
            </span>
            <h1 className="text-2xl font-extrabold text-forest mt-1">My Farms</h1>
            <p className="text-xs text-darkText/70 mt-1">
              Configure geographic boundaries, acreage, and vertisol soil types across Pune district.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primaryGreen hover:bg-forest text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Farm</span>
          </button>
        </div>

        {/* Farm Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => {
            const isSelected = currentFarm?.id === farm.id;

            return (
              <div
                key={farm.id}
                className={`bg-white rounded-2xl border p-6 shadow-sm transition space-y-4 relative ${
                  isSelected ? 'border-primaryGreen ring-2 ring-primaryGreen/20' : 'border-lightBeige'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-4 right-4 bg-primaryGreen text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Active Farm
                  </span>
                )}

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-50 text-primaryGreen flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-forest text-lg">{farm.farm_name}</h3>
                    <p className="text-xs text-darkText/60">{farm.village}, {farm.district}, {farm.state}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-warmCream/60 p-2.5 rounded-xl border border-lightBeige">
                    <span className="text-darkText/60 block">Total Holding</span>
                    <span className="font-extrabold text-forest text-base">{farm.total_area_acres} Acres</span>
                  </div>
                  <div className="bg-warmCream/60 p-2.5 rounded-xl border border-lightBeige">
                    <span className="text-darkText/60 block">Dominant Soil</span>
                    <span className="font-bold text-forest truncate block">{farm.dominant_soil_type}</span>
                  </div>
                </div>

                <div className="text-[11px] text-darkText/60 flex items-center space-x-1.5 pt-1">
                  <Globe className="w-3.5 h-3.5 text-leafGreen" />
                  <span>GPS: {farm.latitude.toFixed(4)}°N, {farm.longitude.toFixed(4)}°E</span>
                </div>

                <div className="pt-3 border-t border-lightBeige flex items-center justify-between">
                  {!isSelected ? (
                    <button
                      onClick={() => setCurrentFarm(farm)}
                      className="text-xs font-bold text-primaryGreen hover:underline"
                    >
                      Set as Active
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-leafGreen flex items-center space-x-1">
                      <Check className="w-4 h-4" />
                      <span>Selected Workspace</span>
                    </span>
                  )}

                  {farms.length > 1 && (
                    <button
                      onClick={() => deleteFarm(farm.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                      title="Delete Farm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Farm Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-lightBeige">
              <div className="flex items-center justify-between border-b border-lightBeige pb-3">
                <h3 className="font-extrabold text-forest text-lg">Add New Agricultural Holding</h3>
                <button onClick={() => setShowAddModal(false)} className="text-darkText/50 hover:text-darkText">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateFarm} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Farm Name
                  </label>
                  <input
                    type="text"
                    required
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Shirur Agro Orchard"
                    className="w-full rounded-xl border border-lightBeige px-3.5 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                      Village / Taluka
                    </label>
                    <input
                      type="text"
                      required
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="e.g. Baramati"
                      className="w-full rounded-xl border border-lightBeige px-3.5 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                      District
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="Pune"
                      className="w-full rounded-xl border border-lightBeige bg-warmCream/60 px-3.5 py-2 text-sm text-darkText/70"
                    />
                  </div>
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
                      value={totalArea}
                      onChange={(e) => setTotalArea(Number(e.target.value))}
                      className="w-full rounded-xl border border-lightBeige px-3.5 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                      Dominant Soil Type
                    </label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full rounded-xl border border-lightBeige px-3 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none bg-white"
                    >
                      <option value="Medium Black Soil (Vertisol)">Medium Black Soil (Vertisol)</option>
                      <option value="Deep Black Clay (Vertisol)">Deep Black Clay (Vertisol)</option>
                      <option value="Sandy Loam (Inceptisol)">Sandy Loam (Inceptisol)</option>
                      <option value="Red Lateritic Soil">Red Lateritic Soil</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={latitude}
                      onChange={(e) => setLatitude(Number(e.target.value))}
                      className="w-full rounded-xl border border-lightBeige px-3.5 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={longitude}
                      onChange={(e) => setLongitude(Number(e.target.value))}
                      className="w-full rounded-xl border border-lightBeige px-3.5 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-lightBeige">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-darkText/70 hover:bg-warmCream font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-forest hover:bg-forest-800 text-white font-bold shadow-sm"
                  >
                    Save Farm
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
