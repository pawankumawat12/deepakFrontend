import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Plus, Edit, Trash2, Home, Briefcase, Map } from 'lucide-react';
import toast from 'react-hot-toast';
import { useScript } from '../hooks/useScript'; // Custom hook to load Google Maps script (will create)

interface Address {
  id: number;
  receiver_name: string;
  phone_number: string;
  house_number: string;
  building_name?: string;
  landmark?: string;
  formatted_address: string;
  city: string;
  state: string;
  pincode: string;
  label: string;
  is_default: boolean;
  latitude: number;
  longitude: number;
}

interface AddressManagerProps {
  onSelectAddress?: (address: Address) => void;
  selectedAddressId?: number;
}

export default function AddressManager({ onSelectAddress, selectedAddressId }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  // Maps Integration
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    receiver_name: '',
    phone_number: '',
    house_number: '',
    building_name: '',
    landmark: '',
    formatted_address: '',
    city: '',
    state: '',
    pincode: '',
    label: 'Home',
    latitude: 26.9124, // Default Jaipur
    longitude: 75.7873
  });

  // Example functions (needs real API hooks)
  const fetchAddresses = async () => { /* Fetch logic */ };
  const handleSave = async (e: React.FormEvent) => { /* Save logic */ };

  return (
    <div className="w-full">
      {!showForm ? (
        <div className="space-y-4">
          <button 
            onClick={() => setShowForm(true)}
            className="w-full p-4 border-2 border-dashed border-primary/50 text-primary rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
          >
            <Plus size={20} />
            <span className="font-medium">Add New Address</span>
          </button>
          
          <div className="grid gap-4">
            {addresses.map(address => (
              <div 
                key={address.id} 
                className={`p-4 border rounded-xl cursor-pointer ${selectedAddressId === address.id ? 'border-primary bg-primary/5' : 'border-border'}`}
                onClick={() => onSelectAddress?.(address)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {address.label === 'Home' ? <Home size={18} className="text-muted-foreground" /> : <Briefcase size={18} className="text-muted-foreground" />}
                    <span className="font-semibold">{address.label}</span>
                    {address.is_default && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Default</span>}
                  </div>
                  <div className="flex gap-2 text-muted-foreground">
                    <button className="hover:text-primary"><Edit size={16} /></button>
                    <button className="hover:text-destructive"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="text-sm font-medium mb-1">{address.receiver_name} - {address.phone_number}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {address.house_number}, {address.building_name ? address.building_name + ', ' : ''}
                  {address.landmark ? address.landmark + ', ' : ''}
                  {address.formatted_address}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4 bg-card border rounded-xl p-4">
          {/* Form fields and Google Maps integration go here */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Add Delivery Address</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
          
          <div className="bg-muted h-48 rounded-lg flex items-center justify-center text-muted-foreground mb-4 relative">
             {/* Map Container */}
             <div ref={mapRef} className="absolute inset-0 rounded-lg"></div>
             <span className="z-10 bg-background/80 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
               <Map size={16} /> Note: Google Maps API key required to render map
             </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-medium mb-1 block">Receiver Name *</label>
              <input type="text" className="w-full p-2 border rounded-md" required value={formData.receiver_name} onChange={e => setFormData({...formData, receiver_name: e.target.value})} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-medium mb-1 block">Phone Number *</label>
              <input type="text" className="w-full p-2 border rounded-md" required value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">House/Flat/Room No *</label>
              <input type="text" className="w-full p-2 border rounded-md" required value={formData.house_number} onChange={e => setFormData({...formData, house_number: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Landmark / Building Name</label>
              <input type="text" className="w-full p-2 border rounded-md" value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold">Save Address</button>
        </form>
      )}
    </div>
  );
}

