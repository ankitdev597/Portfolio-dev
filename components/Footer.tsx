import { siteConfig } from "@/data/data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-8">
      <div className="container-page flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-sm text-muted">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
        <p className="text-sm text-muted">{siteConfig.availability}</p>
      </div>
    </footer>
  );
}
