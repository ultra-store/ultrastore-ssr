'use client';

import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

export interface YandexMapProps {
  url?: string
  coordinates?: string
  coords?: [number, number]
}

function parseCoordsFromString(coordinates?: string): [number, number] | null {
  if (!coordinates) {
    return null;
  }

  // Ожидаемый формат: "lat,lng" или "lat,lng"
  const parts = coordinates.split(',').map((n) => n.trim());

  if (parts.length >= 2) {
    const lat = Number(parts[0]);
    const lng = Number(parts[1]);

    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      return [lat, lng];
    }
  }

  return null;
}

function parseCoordsFromUrl(url?: string): [number, number] | null {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    // Try common params ll=lon,lat or lat/lon in pt param
    const ll = parsed.searchParams.get('ll');

    if (ll) {
      const [lon, lat] = ll.split(',').map((n) => Number(n));

      if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
        return [lat, lon];
      }
    }

    const pt = parsed.searchParams.get('pt');

    if (pt) {
      const [lon, lat] = pt
        .split(',')
        .slice(0, 2)
        .map((n) => Number(n));

      if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
        return [lat, lon];
      }
    }
  } catch {
    // ignore parse errors
  }

  return null;
}

export const YandexMap = ({ url, coordinates, coords }: YandexMapProps) => {
  let center: [number, number] = [59.9311, 30.3609];

  // 1. Try direct coordinates string first
  if (coordinates) {
    const parsedCoords = parseCoordsFromString(coordinates);

    if (parsedCoords) {
      center = parsedCoords;
    }
  }

  // 2. Try parsing from URL if coordinates not found
  if (!coordinates && url) {
    const parsedFromUrl = parseCoordsFromUrl(url);

    if (parsedFromUrl) {
      center = parsedFromUrl;
    }
  }

  // 3. Use fallback coordinates if provided
  if (coords) {
    center = coords;
  }

  return (
    <YMaps>
      <Map
        defaultState={{
          center,
          zoom: 17,
        }}
        width="100%"
        height="100%"
      >
        <Placemark
          modules={['geoObject.addon.balloon']}
          geometry={center}
          properties={{
            balloonContentHeader: '',
            balloonContentBody: `UltraStore`,
            iconContent: 'UltraStore',
          }}
          options={{ preset: 'islands#pinkStretchyIcon' }}
        />
      </Map>
    </YMaps>
  );
};
