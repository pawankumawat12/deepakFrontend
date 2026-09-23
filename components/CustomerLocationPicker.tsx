"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Search,
  Loader2,
  Compass,
  Layers,
  X,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

export interface AddressAutoFillDetails {
  city?: string;
  state?: string;
  pincode?: string;
  formattedAddress?: string;
  landmark?: string;
  houseNumber?: string;
  rawAddress?: any;
}

interface CustomerLocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (
    lat: number,
    lng: number,
    details?: AddressAutoFillDetails
  ) => void;
}

interface SuggestionItem {
  lat: number;
  lon: number;
  title: string;
  subtitle: string;
  display_name: string;
}

// Crisp customer delivery pin
const createDeliveryPinIcon = () =>
  L.divIcon({
    className: "customer-delivery-pin",
    html: `
      <div style="
        position: relative;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #e11d48;
        color: white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid #ffffff;
        box-shadow: 0 4px 14px rgba(225, 29, 72, 0.55), 0 2px 6px rgba(0,0,0,0.35);
        cursor: grab;
      ">
        <svg style="transform: rotate(45deg); width: 18px; height: 18px; fill: white;" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });

const TILE_LAYERS = {
  satellite: {
    url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    options: {
      attribution: "&copy; Google Maps Hybrid",
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    },
  },
  streets: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    },
  },
};

export default function CustomerLocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: CustomerLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const activeTileLayerRef = useRef<L.TileLayer | null>(null);
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);

  const defaultLat = 26.9124; // Jaipur fallback
  const defaultLng = 75.7873;

  const initialLat =
    latitude != null && !isNaN(Number(latitude)) && Number(latitude) !== 0
      ? Number(latitude)
      : defaultLat;
  const initialLng =
    longitude != null && !isNaN(Number(longitude)) && Number(longitude) !== 0
      ? Number(longitude)
      : defaultLng;

  const [currentLat, setCurrentLat] = useState<number>(initialLat);
  const [currentLng, setCurrentLng] = useState<number>(initialLng);
  const [mapType, setMapType] = useState<"satellite" | "streets">("satellite");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SuggestionItem[]>([]);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [resolvedSpot, setResolvedSpot] = useState<string>("");

  // Sync internal state if external lat/lng changes
  useEffect(() => {
    if (latitude != null && longitude != null && latitude !== 0 && longitude !== 0) {
      if (
        Math.abs(latitude - currentLat) > 0.00001 ||
        Math.abs(longitude - currentLng) > 0.00001
      ) {
        setCurrentLat(latitude);
        setCurrentLng(longitude);
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([latitude, longitude]);
        }
      }
    }
  }, [latitude, longitude]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target as Node)
      ) {
        setShowResultsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live debounced search suggestions as user types
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q || q.length < 2) {
      setSearchResults([]);
      setShowResultsDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchLiveSuggestions(q);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchLiveSuggestions = async (queryText: string) => {
    setSearching(true);
    try {
      // 1. Try Photon (fast autocomplete)
      const photonRes = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(queryText)}&limit=6`
      );

      let items: SuggestionItem[] = [];
      if (photonRes.ok) {
        const photonData = await photonRes.json();
        if (photonData?.features && photonData.features.length > 0) {
          items = photonData.features.map((f: any) => {
            const props = f.properties || {};
            const title = props.name || props.street || queryText;
            const subtitleParts = [
              props.city || props.district || props.county,
              props.state,
              props.postcode,
            ].filter(Boolean);
            const subtitle = subtitleParts.join(", ") || props.country || "";
            return {
              lat: f.geometry.coordinates[1],
              lon: f.geometry.coordinates[0],
              title,
              subtitle,
              display_name: [title, subtitle].filter(Boolean).join(", "),
            };
          });
        }
      }

      // 2. If Photon had no results or failed, fallback to Nominatim
      if (items.length === 0) {
        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            queryText
          )}&countrycodes=in&limit=6&addressdetails=1`,
          { headers: { Accept: "application/json" } }
        );
        if (nomRes.ok) {
          const nomData = await nomRes.json();
          if (nomData && nomData.length > 0) {
            items = nomData.map((item: any) => {
              const parts = (item.display_name || "").split(",");
              const title = parts[0]?.trim() || item.name;
              const subtitle = parts.slice(1, 4).join(", ").trim();
              return {
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
                title,
                subtitle,
                display_name: item.display_name,
              };
            });
          }
        }
      }

      setSearchResults(items);
      setShowResultsDropdown(items.length > 0);
    } catch {
      // ignore network errors
    } finally {
      setSearching(false);
    }
  };

  // Reverse geocoding helper to extract city, pincode, state, address
  const fetchAddressDetails = useCallback(
    async (lat: number, lng: number): Promise<AddressAutoFillDetails | null> => {
      try {
        setGeocoding(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { headers: { Accept: "application/json" } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.address) {
            const addr = data.address;
            const detectedCity =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.county ||
              addr.state_district ||
              "Jaipur";
            const detectedState = addr.state || "Rajasthan";
            const detectedPincode = addr.postcode || "";

            const roadParts = [
              addr.amenity || addr.shop || addr.building,
              addr.road,
              addr.suburb || addr.neighbourhood || addr.residential,
              addr.city_district || addr.subdistrict,
            ]
              .filter(Boolean)
              .filter((val, idx, arr) => arr.indexOf(val) === idx);

            const detailedAddress =
              roadParts.length > 0
                ? roadParts.join(", ")
                : data.display_name
                ? data.display_name.split(",").slice(0, 3).join(", ").trim()
                : "";

            const spotName =
              detailedAddress || data.display_name?.split(",")[0] || "Selected Location";
            setResolvedSpot(spotName);

            return {
              city: detectedCity,
              state: detectedState,
              pincode: detectedPincode,
              formattedAddress: detailedAddress,
              landmark: addr.amenity || addr.shop || addr.building || "",
              houseNumber: addr.house_number || "",
              rawAddress: addr,
            };
          } else if (data?.display_name) {
            setResolvedSpot(data.display_name.split(",").slice(0, 2).join(", "));
          }
        }
      } catch {
        // ignore network error
      } finally {
        setGeocoding(false);
      }
      return null;
    },
    []
  );

  const switchTileLayer = useCallback((type: "satellite" | "streets") => {
    if (!mapInstanceRef.current) return;
    if (activeTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(activeTileLayerRef.current);
    }
    const config = TILE_LAYERS[type];
    const newLayer = L.tileLayer(config.url, config.options);
    newLayer.addTo(mapInstanceRef.current);
    activeTileLayerRef.current = newLayer;
    setMapType(type);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: false, // Prevent wheel trapping modal scroll
    });

    const initialConfig = TILE_LAYERS.satellite;
    const tileLayer = L.tileLayer(initialConfig.url, initialConfig.options).addTo(map);
    activeTileLayerRef.current = tileLayer;

    const marker = L.marker([initialLat, initialLng], {
      icon: createDeliveryPinIcon(),
      draggable: true,
    }).addTo(map);

    marker.bindPopup("<b>Your Delivery Spot</b><br/>Drag pin onto your house rooftop").openPopup();

    const handleNewCoords = async (lat: number, lng: number) => {
      const cleanLat = Math.round(lat * 1000000) / 1000000;
      const cleanLng = Math.round(lng * 1000000) / 1000000;
      setCurrentLat(cleanLat);
      setCurrentLng(cleanLng);
      const details = await fetchAddressDetails(cleanLat, cleanLng);
      onLocationChange(cleanLat, cleanLng, details || undefined);
    };

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      handleNewCoords(pos.lat, pos.lng);
    });

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      handleNewCoords(lat, lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    fetchAddressDetails(initialLat, initialLng);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      activeTileLayerRef.current = null;
    };
  }, []);

  // Jump to spot from clicked suggestion
  const handleSelectSuggestion = async (item: SuggestionItem) => {
    const cleanLat = Math.round(item.lat * 1000000) / 1000000;
    const cleanLng = Math.round(item.lon * 1000000) / 1000000;

    setCurrentLat(cleanLat);
    setCurrentLng(cleanLng);
    setSearchQuery(item.title);
    setShowResultsDropdown(false);
    setResolvedSpot(item.title);

    if (markerRef.current) {
      markerRef.current.setLatLng([cleanLat, cleanLng]);
      markerRef.current.bindPopup(`<b>Delivery Spot</b><br/>${item.title}`).openPopup();
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([cleanLat, cleanLng], 17, { duration: 1.2 });
    }

    const details = await fetchAddressDetails(cleanLat, cleanLng);
    onLocationChange(cleanLat, cleanLng, details || undefined);
    toast.success(`Selected: ${item.title}`);
  };

  const handleManualSearch = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (searchQuery.trim().length >= 2) {
      fetchLiveSuggestions(searchQuery.trim());
    } else {
      toast.error("Please type at least 2 letters of your area or colony");
    }
  };

  return (
    <div className="customer-location-picker rounded-2xl border border-stone-200 bg-stone-50/80 p-3">
      {/* Header bar with controls */}
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
          <MapPin size={15} className="text-[var(--color-primary)]" />
          <span>Pin Delivery Location on Map</span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5">
          <div className="inline-flex overflow-hidden rounded-lg border border-stone-200 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => switchTileLayer("satellite")}
              className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-bold transition-all ${
                mapType === "satellite"
                  ? "bg-stone-900 text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Compass size={11} />
              <span>Satellite</span>
            </button>
            <button
              type="button"
              onClick={() => switchTileLayer("streets")}
              className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-bold transition-all ${
                mapType === "streets"
                  ? "bg-stone-900 text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Layers size={11} />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Input Bar with Live Suggestions Dropdown */}
      <div ref={searchWrapperRef} className="relative mb-2">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowResultsDropdown(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleManualSearch(e);
                }
              }}
              placeholder="Type your colony, society, landmark or area..."
              className="w-full rounded-xl border border-stone-300 bg-white py-2 pl-8.5 pr-8 text-xs font-medium text-stone-800 placeholder-stone-400 shadow-xs focus:border-[var(--color-primary)] focus:outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setShowResultsDropdown(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleManualSearch}
            disabled={searching}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-[var(--color-primary)] px-3 py-2 text-xs font-bold text-white shadow-2xs transition hover:opacity-90 disabled:opacity-50"
          >
            {searching ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>

        {/* Live Swiggy-Style Suggestions Dropdown */}
        {showResultsDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-[1100] mt-1.5 max-h-56 overflow-y-auto rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl">
            <div className="mb-1 flex items-center justify-between border-b border-stone-100 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-stone-400">
              <span>Matching Locations (Select one)</span>
              <button
                type="button"
                onClick={() => setShowResultsDropdown(false)}
                className="text-stone-400 hover:text-stone-700 font-normal normal-case"
              >
                Close
              </button>
            </div>
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="group flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition hover:bg-stone-50 active:bg-stone-100"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary)] transition group-hover:bg-[var(--color-primary)] group-hover:text-white">
                  <MapPin size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-stone-900 group-hover:text-[var(--color-primary)]">
                    {item.title}
                  </p>
                  <p className="truncate text-[11px] font-medium text-stone-500">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div
        className="relative overflow-hidden rounded-xl border border-stone-300 shadow-inner"
        style={{ height: "260px" }}
      >
        <div ref={mapContainerRef} style={{ height: "100%", width: "100%", zIndex: 1 }} />

        {/* Satellite/Street floating pill */}
        <div className="pointer-events-none absolute right-2.5 top-2.5 z-[1000] flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              mapType === "satellite" ? "bg-emerald-400" : "bg-sky-400"
            }`}
          />
          <span>{mapType === "satellite" ? "Satellite View" : "Road Map"}</span>
        </div>
      </div>

      {/* Bottom helper & spot status */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
        <div className="flex items-center gap-1 font-semibold text-emerald-800">
          <CheckCircle2 size={13} className="text-emerald-600" />
          <span className="truncate">
            {geocoding
              ? "Reading address..."
              : resolvedSpot
              ? `Pin set: ${resolvedSpot}`
              : `Pin at ${currentLat.toFixed(4)}, ${currentLng.toFixed(4)}`}
          </span>
        </div>
        <span className="text-[10px] text-stone-500">
          💡 Drag red pin onto your exact building or gate
        </span>
      </div>
    </div>
  );
}
