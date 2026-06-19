"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/format";
import { formatDateDisplay } from "@/lib/dates";

export type GeoTransaction = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  latitude: number;
  longitude: number;
  locationName: string | null;
  type: string;
};

type Props = {
  transactions: GeoTransaction[];
};

const MAP_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

// Buenos Aires default center
const DEFAULT_CENTER = { lng: -58.3816, lat: -34.6037 };

export const SpendingMapInner = ({ transactions }: Props) => {
  const t = useTranslations("map");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const markersRef = React.useRef<maplibregl.Marker[]>([]);
  const { resolvedTheme } = useTheme();

  const styleUrl =
    resolvedTheme === "dark" ? MAP_STYLES.dark : MAP_STYLES.light;

  // Initialize map
  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center =
      transactions.length > 0
        ? { lng: transactions[0].longitude, lat: transactions[0].latitude }
        : DEFAULT_CENTER;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [center.lng, center.lat],
      zoom: transactions.length > 0 ? 12 : 10,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right",
    );
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update style when theme changes
  React.useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(styleUrl);
  }, [styleUrl]);

  // Render markers
  React.useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (transactions.length === 0) return;

    const map = mapRef.current;

    const addMarkers = () => {
      transactions.forEach((tx) => {
        const el = document.createElement("div");
        el.className = "tx-marker";
        el.style.cssText = `
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${tx.type === "INCOME" ? "#10b981" : "#ef4444"};
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        `;
        el.textContent = tx.type === "INCOME" ? "+" : "-";
        el.style.color = "white";
        el.style.fontWeight = "bold";

        const popupContent = `
          <div style="padding: 8px; min-width: 180px;">
            <p style="margin:0; font-weight:600; font-size:13px;">${tx.description}</p>
            <p style="margin:2px 0; font-size:12px; color:#666;">${tx.category}</p>
            <p style="margin:2px 0; font-size:13px; font-weight:600; color:${tx.type === "INCOME" ? "#10b981" : "#ef4444"}">
              ${tx.type === "INCOME" ? "+" : "-"}${formatCurrency(tx.amount)}
            </p>
            <p style="margin:2px 0; font-size:11px; color:#888;">${new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
            ${tx.locationName ? `<p style="margin:2px 0; font-size:11px; color:#888;">📍 ${tx.locationName}</p>` : ""}
          </div>
        `;

        const popup = new maplibregl.Popup({
          offset: 15,
          closeButton: true,
        }).setHTML(popupContent);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([tx.longitude, tx.latitude])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });

      // Fit bounds if multiple markers
      if (transactions.length > 1) {
        const bounds = new maplibregl.LngLatBounds();
        transactions.forEach((tx) => {
          bounds.extend([tx.longitude, tx.latitude]);
        });
        map.fitBounds(bounds, { padding: 60, maxZoom: 14 });
      }
    };

    if (map.isStyleLoaded()) {
      addMarkers();
    } else {
      map.once("load", addMarkers);
    }
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="relative w-full h-full">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg border p-6 text-center max-w-xs">
            <p className="text-sm font-medium">{t("noGeoTagged")}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("noLocationsDescription")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
};
