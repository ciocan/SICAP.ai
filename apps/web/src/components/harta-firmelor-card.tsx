import { hartaFirmelorEmbedUrl, isEmbeddableCui } from "@/lib/harta-firmelor";

import { HartaFirmelorFrame } from "./harta-firmelor-frame";
import { HartaFirmelorLink } from "./harta-firmelor-link";

interface Props {
  /** The route nationalId, which on /firma/[nationalId] is the bare CUI. */
  nationalId: string;
}

/**
 * Trade-registry snapshot from harta-firmelor.ro, on the COMPANY page only.
 *
 * The card itself is framed. The "Vezi mai mult" strip that normally sits under
 * it is rebuilt in our own server HTML instead (`harta-firmelor-link.tsx`),
 * because the framed document is served `noindex, nofollow`: a link inside it
 * passes nothing to anybody. That is the entire reason the frame asks for the
 * `/bare` variant.
 *
 * NEVER render this on an authority page. The guard is structural rather than
 * conditional: this component is imported only by `company-all.tsx`, which is
 * rendered only by `firma/[nationalId]/page.tsx`, and it is deliberately absent
 * from `components/index.tsx` so no barrel import can carry it somewhere else.
 * `authority-all.tsx` is a separate file with a separate tree.
 *
 * If a Content-Security-Policy is ever added to this app it must allow
 * `frame-src https://harta-firmelor.ro` (HARTA_FIRMELOR_ORIGIN).
 */
export function HartaFirmelorCard({ nationalId }: Props) {
  if (!isEmbeddableCui(nationalId)) {
    return null;
  }

  return (
    <section aria-label="Date din registrul comerțului pe harta-firmelor.ro" className="space-y-4">
      <div className="overflow-hidden rounded-lg border bg-background">
        <HartaFirmelorFrame
          src={hartaFirmelorEmbedUrl(nationalId)}
          title={`Fișa firmei cu CUI ${nationalId} pe harta-firmelor.ro`}
        />
      </div>

      <HartaFirmelorLink nationalId={nationalId} />
    </section>
  );
}
