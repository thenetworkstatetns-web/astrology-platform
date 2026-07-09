import Link from "next/link";
import type { FooterSection as FooterSectionType, SiteSettings } from "@astro/types";

export function FooterSection({
  data,
  settings,
}: {
  data: FooterSectionType;
  settings?: SiteSettings;
}) {
  const socials = settings?.socialLinks;
  const socialEntries = socials
    ? Object.entries(socials).filter(([, url]) => Boolean(url))
    : [];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm">{data.text || `© ${new Date().getFullYear()} All rights reserved.`}</p>

          {data.links.length > 0 ? (
            <nav className="flex flex-wrap justify-center gap-6">
              {data.links.map((link) => (
                <Link key={link.id} href={link.url} className="text-sm hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}

          {socialEntries.length > 0 ? (
            <div className="flex gap-4">
              {socialEntries.map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm capitalize hover:text-white"
                >
                  {platform}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {(settings?.contactEmail || settings?.contactPhone) && (
          <div className="mt-6 flex flex-col items-center gap-1 text-xs text-slate-400 sm:flex-row sm:justify-center sm:gap-4">
            {settings?.contactEmail ? <span>{settings.contactEmail}</span> : null}
            {settings?.contactPhone ? <span>{settings.contactPhone}</span> : null}
          </div>
        )}
      </div>
    </footer>
  );
}
