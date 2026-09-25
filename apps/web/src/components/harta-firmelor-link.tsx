import { ArrowUpRight } from "lucide-react";

import { hartaFirmelorCompanyUrl, isEmbeddableCui } from "@/lib/harta-firmelor";

interface Props {
  /** The bare CUI. Anything else has no page on harta-firmelor.ro and renders nothing. */
  nationalId: string;
}

/**
 * The "Vezi mai mult pe harta-firmelor.ro" strip: one real anchor to the
 * company's page on harta-firmelor.ro, in our own server HTML.
 *
 * It is a separate component so that both firm pages render it. `/firma/[cui]`
 * gets it under the framed card (`harta-firmelor-card.tsx`), and the older
 * `/achizitii/firma/[id]` page, the one the sitemap advertises and search
 * engines rank, gets it without the frame. A link inside the framed document
 * would pass nothing: harta serves `/embed/...` as `noindex, nofollow`.
 *
 * No `nofollow` and no `sponsored` here, on purpose. The whole point of the
 * anchor is that it counts.
 */
export function HartaFirmelorLink({ nationalId }: Props) {
  if (!isEmbeddableCui(nationalId)) {
    return null;
  }

  return (
    <a
      href={hartaFirmelorCompanyUrl(nationalId)}
      target="_blank"
      rel="noopener"
      className="group flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-4 py-3 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="inline-flex items-center gap-2 text-foreground">
        <svg viewBox="0 0 48 64" aria-hidden="true" className="h-6 w-auto shrink-0">
          <path
            fillRule="evenodd"
            fill="currentColor"
            d="M24 62C21.8 55.8 17.9 50.2 13.5 44.2 8 36.7 4 30.6 4 22 4 10.95 12.95 2 24 2c11.05 0 20 8.95 20 20 0 8.6-4 14.7-9.5 22.2-4.4 6-8.3 11.6-10.5 17.8ZM12 11h6v6h-6Zm9 0h6v6h-6Zm9 0h6v6h-6ZM12 20h6v6h-6Zm9 0h6v6h-6Zm9 0h6v6h-6Z"
          />
          <rect x="21" y="29" width="6" height="10" className="fill-primary" />
        </svg>
        <span className="text-lg font-semibold leading-none tracking-tight">
          harta-firmelor<span className="font-medium text-muted-foreground">.ro</span>
        </span>
      </span>
      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        Vezi mai mult pe harta-firmelor.ro
        <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}
