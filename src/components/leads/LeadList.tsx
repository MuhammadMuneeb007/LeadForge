import type { BusinessLead } from "@/types/lead";
import { LeadCard } from "./LeadCard";
export function LeadList(props: {
  leads: BusinessLead[];
  selected: Set<string>;
  enriching: Set<string>;
  activeId?: string;
  onSelect: (lead: BusinessLead) => void;
  onEnrich: (leads: BusinessLead[]) => void;
  onFocus: (id: string) => void;
}) {
  if (!props.leads.length)
    return (
      <div className="empty-state">
        <span>⌕</span>
        <h3>No businesses match these filters</h3>
        <p>Broaden the filters or start a new search.</p>
      </div>
    );
  return (
    <div className="lead-list">
      {props.leads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          selected={props.selected.has(lead.id)}
          enriching={props.enriching.has(lead.id)}
          active={props.activeId === lead.id}
          onSelect={() => props.onSelect(lead)}
          onEnrich={() => props.onEnrich([lead])}
          onFocus={() => props.onFocus(lead.id)}
        />
      ))}
    </div>
  );
}
