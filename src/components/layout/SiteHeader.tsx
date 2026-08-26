"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  isNavItemActive,
  primaryNavigation,
  type NavItem,
  type NavLink,
} from "@/lib/navigation";
import { githubUrl } from "@/lib/site";

/**
 * The one header used by every public page.
 *
 * Links are ordinary anchors rather than next/link on purpose: a
 * Content-Security-Policy attaches to the document, so a client-side transition
 * would carry one page's policy — and any already-executed ad runtime — from a
 * monetised article into the unmonetised workspace. See next.config.ts.
 */
export function SiteHeader({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const menuId = useId();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const closeAll = useCallback(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (!openMenu && !mobileOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeAll();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeAll();
      const active = headerRef.current?.querySelector<HTMLButtonElement>(
        "[aria-expanded='true']",
      );
      active?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu, mobileOpen, closeAll]);

  const renderLink = (link: NavLink) => (
    <a
      key={link.href}
      href={link.href}
      aria-current={pathname === link.href ? "page" : undefined}
      {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {link.label}
      {link.external ? <span aria-hidden="true"> ↗</span> : null}
    </a>
  );

  const renderDesktopItem = (item: NavItem) => {
    const active = isNavItemActive(item, pathname);
    if (!item.children) {
      return (
        <li key={item.label}>
          <a
            className={`nav-link ${active ? "active" : ""}`}
            href={item.href}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </a>
        </li>
      );
    }
    const id = `${menuId}-${item.label.toLowerCase()}`;
    const open = openMenu === item.label;
    return (
      <li
        key={item.label}
        className="has-menu"
        onMouseEnter={() => setOpenMenu(item.label)}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <button
          type="button"
          className={`nav-link ${active ? "active" : ""}`}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpenMenu(open ? null : item.label)}
        >
          {item.label}
          <span className="nav-caret" aria-hidden="true">
            ▾
          </span>
        </button>
        <div className="nav-menu" id={id} hidden={!open}>
          {item.children.map(renderLink)}
        </div>
      </li>
    );
  };

  const renderMobileItem = (item: NavItem) => {
    if (!item.children) {
      return (
        <a
          key={item.label}
          className={`mobile-link ${isNavItemActive(item, pathname) ? "active" : ""}`}
          href={item.href}
        >
          {item.label}
        </a>
      );
    }
    const id = `${menuId}-m-${item.label.toLowerCase()}`;
    const open = openSection === item.label;
    return (
      <div className="mobile-group" key={item.label}>
        <button
          type="button"
          className={`mobile-link ${isNavItemActive(item, pathname) ? "active" : ""}`}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpenSection(open ? null : item.label)}
        >
          {item.label}
          <span className="nav-caret" aria-hidden="true">
            {open ? "−" : "+"}
          </span>
        </button>
        <div className="mobile-sublist" id={id} hidden={!open}>
          {item.children.map(renderLink)}
        </div>
      </div>
    );
  };

  return (
    <header className="top-nav site-header" ref={headerRef}>
      <div className="nav-inner">
        <a className="wordmark" href="/">
          <span>LF</span>
          <span className="brand-copy">
            <strong>LeadForge</strong>
            <small>OPEN BUSINESS DISCOVERY</small>
          </span>
        </a>
        <nav className="site-nav" aria-label="Primary">
          <ul>{primaryNavigation.map(renderDesktopItem)}</ul>
        </nav>
        <div className="nav-actions">
          <a
            className="github-link"
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a className="nav-cta" href="/#workspace">
            Find businesses
          </a>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={mobileOpen}
            aria-controls={`${menuId}-mobile`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span aria-hidden="true">{mobileOpen ? "✕" : "☰"}</span>
            <b>Menu</b>
          </button>
        </div>
      </div>
      <div className="mobile-nav" id={`${menuId}-mobile`} hidden={!mobileOpen}>
        <nav aria-label="Site">
          {primaryNavigation.map(renderMobileItem)}
          <a
            className="mobile-link"
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </nav>
        <a className="nav-cta" href="/#workspace">
          Find businesses
        </a>
      </div>
      {children}
    </header>
  );
}
