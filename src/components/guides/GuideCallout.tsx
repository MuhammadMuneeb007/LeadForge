const labels = {
  key: "KEY POINT",
  tip: "TIP",
  caution: "CAUTION",
  example: "EXAMPLE",
} as const;

export type CalloutVariant = keyof typeof labels;

/**
 * Short aside inside an article. Variants map onto the existing palette —
 * lime/green for a key point, card/green for a tip, the small orange accent for
 * a caution, neutral card for an example. Use sparingly.
 */
export function GuideCallout({
  variant = "key",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className={`guide-callout guide-callout-${variant}`}>
      <p className="kicker">{title ?? labels[variant]}</p>
      {children}
    </aside>
  );
}
