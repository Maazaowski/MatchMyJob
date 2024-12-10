import React from 'react';
import { Globe } from 'lucide-react';
import { Region } from '../types';

interface RegionSelectorProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}

export function RegionSelector({ selectedRegion, onRegionChange }: RegionSelectorProps) {
  const regions: Region[] = ['US', 'EU', 'UAE', 'Africa', 'Other'];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-blue-500" />
        <label className="text-sm font-medium text-gray-700">Select Region</label>
      </div>
      <select
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value as Region)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
}