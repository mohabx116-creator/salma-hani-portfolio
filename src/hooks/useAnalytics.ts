import { useEffect } from "react";

type AnalyticsMetadata = Record<string, string | number | boolean | null>;

export function trackAnalyticsEvent(
  event: "page_view" | "project_view" | "contact_submit",
  page: string,
  metadata: AnalyticsMetadata = {},
) {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({ event, page, metadata });
  const blob = new Blob([payload], { type: "application/json" });

  if (navigator.sendBeacon?.("/api/analytics", blob)) return;

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

export function usePageAnalytics(
  event: "page_view" | "project_view",
  metadata: AnalyticsMetadata = {},
) {
  const metadataKey = JSON.stringify(metadata);

  useEffect(() => {
    const page = `${window.location.pathname}${window.location.search}`;
    trackAnalyticsEvent(event, page, JSON.parse(metadataKey) as AnalyticsMetadata);
  }, [event, metadataKey]);
}
