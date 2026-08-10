"use client";
import dynamic from "next/dynamic";
import type { BusinessLead } from "@/types/lead";
const LeadMap = dynamic(
  () => import("./LeadMap").then((module) => module.LeadMap),
  {
    ssr: false,
    loading: () => <div className="map-loading">Loading map…</div>,
  },
);
export function LeadMapLoader(props: {
  leads: BusinessLead[];
  activeId?: string;
  onFocus: (id: string) => void;
}) {
  return <LeadMap {...props} />;
}
