import { Link, useLocation } from "react-router";

export function Header() {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/projects", label: "Projects" },
  ];

  return (
    <header className="flex-none flex items-center justify-between border-b border-border dark:border-border-dark px-6 py-3 bg-surface dark:bg-surface-dark z-10">
      <Link to="/" className="flex items-center gap-2 text-primary">
        <img src="/prove.png" alt="Prove Logo" className="w-8 h-8 rounded-md" />
      </Link>
      <nav className="flex items-center gap-2">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-colors ${location.pathname === link.to
              ? "bg-surface-hover dark:bg-surface-dark-hover text-fg dark:text-fg-dark"
              : "text-fg-muted dark:text-fg-muted-dark hover:bg-surface-hover dark:hover:bg-surface-dark-hover hover:text-fg dark:hover:text-fg-dark"
              }`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-lg transition-colors bg-primary text-white hover:bg-primary-hover"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Project
        </Link>
      </nav>
    </header>
  );
}
