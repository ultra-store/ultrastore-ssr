'use client';

import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

export interface YandexMapProps {
  /** Full iframe HTML or just URL from contacts.map_iframe */
  iframe?: string
  /** Fallback coordinates if not parsed from iframe */
  coords?: [number, number]
  /** Width/height inherit from parent container */
}

function parseCoordsFromIframe(iframe?: string): [number, number] | null {
  if (!iframe) {
    return null;
  }

  const url = iframe.includes('<iframe')
    ? (/src="([^"]+)"/.exec(iframe)?.[1] || '')
    : iframe;

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
      const [lon, lat] = pt.split(',').slice(0, 2).map((n) => Number(n));

      if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
        return [lat, lon];
      }
    }
  } catch {
    // ignore parse errors
  }

  return null;
}

export const YandexMap = ({ iframe, coords }: YandexMapProps) => {
  const parsed = parseCoordsFromIframe(iframe || '');
  const center: [number, number] = parsed || coords || [59.9311, 30.3609];

  return (
    <YMaps>
      <Map
        defaultState={{
          center,
          zoom: 16,
        }}
        width="100%"
        height="100%"
      >
        <Placemark geometry={center} />
      </Map>
    </YMaps>
  );
};
