import { footerColumns } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-primary">
        <div className="footer-brand">
          <span className="footer-mark">LF</span>
          <div>
            <strong>LeadForge</strong>
            <p>Turn open business data into a practical prospect list.</p>
          </div>
        </div>
        <p className="footer-description">
          Search a market, inspect businesses on the map, find public contact
          details, and export the records you choose. No account required.
        </p>
      </div>
      {footerColumns.map((column) => (
        <div className="footer-column" key={column.title}>
          <strong>{column.title}</strong>
          {column.links.map((link) => (
            <a
              key={`${column.title}-${link.href}`}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {link.label}
              {link.external ? <span aria-hidden="true"> ↗</span> : null}
            </a>
          ))}
        </div>
      ))}
      <div className="footer-bottom">
        <span>Open source under the MIT License.</span>
        <span>Verify public listing details before contacting a business.</span>
      </div>
    </footer>
  );
}
