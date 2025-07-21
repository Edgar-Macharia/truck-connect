import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    icon?: string;
    onClick?: () => void;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center,
  zoom = 12,
  markers = [],
  onMapClick,
  className = "w-full h-96"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'demo-key',
        version: 'weekly',
        libraries: ['places', 'marker']
      });

      try {
        await loader.load();
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          setMap(mapInstance);
          setIsLoaded(true);

          if (onMapClick) {
            mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
              if (e.latLng) {
                onMapClick(e.latLng.lat(), e.latLng.lng());
              }
            });
          }
        }
      } catch (error) {
        // Silently handle Google Maps loading errors
      }
    };

    initMap();
  }, [center.lat, center.lng, zoom, onMapClick]);

  useEffect(() => {
    if (map && isLoaded) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      markers.forEach(marker => {
        // Use regular Marker instead of AdvancedMarker for better compatibility
        const mapMarker = new google.maps.Marker({
          position: marker.position,
          map,
          title: marker.title,
          icon: marker.icon || undefined
        });

        markersRef.current.push(mapMarker);

        if (marker.onClick) {
          mapMarker.addListener('click', marker.onClick);
        }
      });
    }
  }, [map, isLoaded, markers]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      {!isLoaded && (
        <div className="w-full h-full bg-accent-beige-100 rounded-lg flex items-center justify-center">
          <div className="text-secondary-500">Loading map of Kenya...</div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;