import Link from "next/link";

const github =
  process.env.NEXT_PUBLIC_GITHUB_URL ??
  "https://github.com/MuhammadMuneeb007/LeadForge";

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
      <div className="footer-column">
        <strong>Product</strong>
        <Link href="/">Discover businesses</Link>
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/#workspace">Import a list</Link>
      </div>
      <div className="footer-column">
        <strong>Resources</strong>
        <Link href="/about/data">Data and privacy</Link>
        <a href={github} target="_blank" rel="noreferrer">
          Source code ↗
        </a>
        <a href={`${github}/issues`} target="_blank" rel="noreferrer">
          Report an issue ↗
        </a>
      </div>
      <div className="footer-bottom">
        <span>Open source under the MIT License.</span>
        <span>Verify public listing details before contacting a business.</span>
      </div>
    </footer>
  );
}
