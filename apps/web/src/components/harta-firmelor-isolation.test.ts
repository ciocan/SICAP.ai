import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The harta-firmelor card belongs on the COMPANY page and nowhere else.
 *
 * That was agreed before a line was written: their embed is a trade-registry
 * snapshot of a firm, which means nothing beside a contracting authority. The
 * guarantee today is structural rather than conditional, and a structural
 * guarantee is exactly the kind that erodes silently: one barrel export, or one
 * authority component reaching for a company one, and the card lands on a page
 * it has no business being on with every test still green.
 *
 * So the import graph is read off the file tree instead of trusted to a
 * docblock. Nothing here is a hand-kept list: the walk finds every source under
 * `src/` and computes reachability, so a new importer reds this the day it is
 * added.
 *
 * Written without spread over iterators on purpose: this package's TypeScript
 * target rejects it (TS2802).
 */

const SRC = path.resolve(__dirname, "..");
const CARD = "harta-firmelor-card";
const LINK_FILE = "harta-firmelor-link.tsx";

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...sourceFiles(full));
    } else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const files = sourceFiles(SRC);
const rel = (abs: string): string => path.relative(SRC, abs).split(path.sep).join("/");
const read = (abs: string): string => readFileSync(abs, "utf8");

function matchGroups(source: string, pattern: RegExp): string[] {
  const re = new RegExp(
    pattern.source,
    pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`,
  );
  const found: string[] = [];
  let m = re.exec(source);
  while (m !== null) {
    found.push(m[1] ?? "");
    m = re.exec(source);
  }
  return found;
}

/**
 * Every module path this file imports from, EXCLUDING type-only imports.
 *
 * `import type { X } from "@/components"` is erased at compile time: the module
 * is never loaded and nothing in it can render. The authority page has exactly
 * one such edge, to the barrel, and the barrel does `export * from
 * "./company-all"`. Counting it would fail this guard on an import that cannot
 * put a card on any page, which is the difference between measuring the module
 * graph and measuring what renders.
 *
 * The exclusion is per STATEMENT, and that word is load-bearing. It used to be
 * per SPECIFIER — collect the type-only specifiers, then filter every specifier
 * equal to one of them — which meant a single plausible line disabled the whole
 * guard. The authority page already carries `import type { SearchParams } from
 * "@/components"`. Add the value import the barrel exists to invite, `import
 * { ListItem } from "@/components"`, and BOTH edges vanish: the walk stayed at
 * 18 files and stayed green while the card really was in the authority page's
 * module graph. The control that proved it was the same value import without
 * the type import beside it — walk 49 files, guard red.
 *
 * `import("...")` counts too. `next/dynamic` around a lazily-loaded card is a
 * plausible refactor, and the old specifier regex required whitespace after
 * `import`, so a dynamic import was simply not an edge. Combined with a local
 * rename it put the card on the authority page past all four assertions.
 */
function importsOf(abs: string): string[] {
  // Drop the type-only import STATEMENTS first, so what survives is exactly the
  // specifiers that are still loaded at runtime, whoever else names them.
  const src = read(abs).replace(/\bimport\s+type\s[^;]*?from\s+["'][^"']+["']\s*;?/g, "");
  const staticSpecs = matchGroups(src, /(?:from|import)\s+["']([^"']+)["']/);
  const dynamicSpecs = matchGroups(src, /\bimport\s*\(\s*["']([^"']+)["']/);
  return staticSpecs.concat(dynamicSpecs);
}

describe("the harta-firmelor card cannot reach the authority page", () => {
  it("finds the source tree it is supposed to police", () => {
    // Anti-vacuity: a walk that returned nothing would make everything below
    // pass about no files at all.
    expect(files.length).toBeGreaterThan(50);
    expect(files.map(rel)).toContain("components/authority-all.tsx");
    expect(files.map(rel)).toContain("components/company-all.tsx");
  });

  it("is imported by exactly one module, the company page's body", () => {
    const importers = files
      .filter((f) => importsOf(f).some((s) => s.includes(CARD)))
      .map(rel)
      .sort();
    expect(importers).toEqual(["components/company-all.tsx"]);
  });

  it("is exported from no barrel, so no barrel import can carry it elsewhere", () => {
    const barrels = files.filter((f) => /\/index\.tsx?$/.test(rel(f)));
    expect(barrels.length, "no barrel found; this guard would be vacuous").toBeGreaterThan(0);
    for (const barrel of barrels) {
      expect(read(barrel), `${rel(barrel)} re-exports the card`).not.toContain(CARD);
    }
  });

  it("the authority page's tree reaches neither the card nor the company body", () => {
    // Transitive, not one hop: the card is safe only if NOTHING the authority
    // page loads can arrive at it by any path.
    const byRel = new Map<string, string>();
    for (const f of files) {
      byRel.set(rel(f), f);
    }
    // Both spellings the app uses: relative siblings, and the `@/` alias that
    // tsconfig maps to `src/`. An unresolved specifier is a package, not ours.
    const resolve = (fromRel: string, spec: string): string | undefined => {
      let base: string | undefined;
      if (spec.startsWith("@/")) {
        base = spec.slice(2);
      } else if (spec.startsWith(".")) {
        base = path.posix.join(path.posix.dirname(fromRel), spec);
      }
      if (base === undefined) {
        return undefined;
      }
      const candidates = [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`];
      return candidates.find((candidate) => byRel.has(candidate));
    };

    const START = "app/(main)/autoritate/[nationalId]/page.tsx";
    expect(byRel.has(START), "the authority route moved; this guard is stale").toBe(true);

    const seen: string[] = [];
    const queue = [START];
    while (queue.length > 0) {
      const current = queue.shift();
      if (current === undefined || seen.includes(current)) {
        continue;
      }
      seen.push(current);
      const abs = byRel.get(current);
      if (abs === undefined) {
        continue;
      }
      for (const spec of importsOf(abs)) {
        const next = resolve(current, spec);
        if (next !== undefined) {
          queue.push(next);
        }
      }
    }

    expect(seen, "the authority page must not reach the card").not.toContain(
      `components/${CARD}.tsx`,
    );
    expect(seen, "the authority page must not reach the company body").not.toContain(
      "components/company-all.tsx",
    );
    // The walk has to have gone somewhere, or "does not contain" is trivially true.
    expect(seen.length).toBeGreaterThan(15);
  });

  it("renders on the company route and on no other route", () => {
    // Reachability is about what a bundle may CONTAIN. This is about what a page
    // RENDERS, which is the promise actually made: the card appears under
    // /firma/[nationalId] and nowhere else. Both ends are read off the tree.
    //
    // A grep for the JSX tag, so a LOCAL RENAME slips past it — `const X =
    // dynamic(() => import("./harta-firmelor-card"))`, then `<X />`. That case
    // is caught one test up instead: the dynamic specifier is an edge in the
    // import graph now, so the importer set goes red. Do not read this test as
    // the only thing standing between the card and another page.
    const rendersCard = files.filter((f) => read(f).includes("<HartaFirmelorCard")).map(rel);
    expect(rendersCard.sort()).toEqual(["components/company-all.tsx"]);

    const rendersCompanyBody = files.filter((f) => read(f).includes("<CompanyAll")).map(rel);
    expect(rendersCompanyBody.sort()).toEqual(["app/(main)/firma/[nationalId]/page.tsx"]);
  });
});

/**
 * The height listener must go through `isTrustedEmbedOrigin`, not a literal.
 *
 * A cross-origin frame posts from the host it was loaded from, so a listener
 * validating `event.origin` against any other host rejects every message the
 * frame sends. Nothing in this suite would go red for it: the card would simply
 * never resize. That is not hypothetical. The frame briefly loaded from a
 * different host than the anchor pointed at, and the wrong comparison in this
 * listener would have shipped green.
 *
 * There is one origin again, so a hand-inlined comparison would be CORRECT
 * today. These assertions keep it out anyway: the predicate is the only form of
 * the check a test can call (the runner is `environment: "node"` with no DOM, so
 * the component cannot be mounted), and it is the seam a second origin would be
 * added to instead of a second literal appearing here.
 *
 * READ THE TITLES LITERALLY. Every assertion below is a GREP OVER THE FRAME'S
 * SOURCE TEXT. None of them runs the listener, so none of them can observe a
 * message being accepted or rejected — they fail only when the text changes.
 * They are pins, deliberately, and they are named as pins; they were previously
 * named as if they verified behaviour, which put the `event.source` half of the
 * brief's criterion 5 on record as tested by nothing at all.
 *
 * The BEHAVIOUR is on record elsewhere, verified in a real browser against the
 * production build with a positive control (SMOKE-SICAP-AI.md section 3.4):
 * a message with harta's origin and the WRONG source left the frame at 236px,
 * the same message with the RIGHT source resized it to 1333px (the control that
 * proves the run could have failed), a wrong origin with the right source was
 * ignored, and height 9999 was refused by the upper bound.
 */
describe("the height listener's origin and source checks are pinned in its source text", () => {
  const frameSource = read(path.join(SRC, "components", "harta-firmelor-frame.tsx"));
  // Comment text is not code. Strip it so a URL written in prose cannot pass
  // for a hardcoded origin, and a hardcoded origin cannot hide in a comment.
  const frameCode = frameSource.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

  it("spells event.origin's check as a call to the shared predicate", () => {
    expect(frameSource, "the frame must still read event.origin at all").toContain("event.origin");
    expect(
      frameCode,
      "event.origin has to go through isTrustedEmbedOrigin, the single source for which " +
        "host may resize this box",
    ).toContain("isTrustedEmbedOrigin(event.origin)");
  });

  it("names no origin of its own, by constant or by literal", () => {
    expect(
      frameCode,
      "the frame must not reach for HARTA_FIRMELOR_ORIGIN directly; isTrustedEmbedOrigin " +
        "is the single place that says which host may resize this box",
    ).not.toContain("HARTA_FIRMELOR_ORIGIN");
    expect(
      frameCode,
      "no literal origin in the frame: the predicate owns which host is trusted",
    ).not.toContain("https:");
  });

  it("still contains the source-check line that stops another frame spoofing a height", () => {
    // A grep, and only a grep: this cannot observe a spoofed message being
    // rejected. That WAS observed, in a browser, with a positive control —
    // right origin + wrong source left the frame at 236px while right origin +
    // right source moved it to 1333px (SMOKE-SICAP-AI.md section 3.4, rows 4b
    // and 4c). This line keeps the check from being deleted between browser runs.
    expect(frameCode).toContain("event.source !== frame.contentWindow");
  });

  it("spells the height range as a call to the shared predicate", () => {
    // Same seam, same reason, and this one has a scar: the range lived here as
    // `data.height < 120`, which refused the 89px box harta returns for a sixth
    // of our companies. A literal inside an unmountable listener is a bound no
    // test can reach; `isEmbedHeight` is asserted directly in harta-firmelor.test.ts.
    expect(
      frameCode,
      "the height range has to go through isEmbedHeight, which is the only form of " +
        "the bound a node-environment test can call",
    ).toContain("isEmbedHeight(data.height)");
    expect(
      frameCode,
      "no numeric height bound of the frame's own: 120 was one, and it silently " +
        "dropped the 404 card's 89px message on ~17% of company pages",
    ).not.toMatch(/\bMIN_HEIGHT\b|\bMAX_HEIGHT\b/);
  });

  it("feeds the frame the embed url and the anchor the company url", () => {
    const card = read(path.join(SRC, "components", "harta-firmelor-card.tsx"));
    expect(card, "the iframe src must be built from the embed origin").toMatch(
      /src=\{hartaFirmelorEmbedUrl\(/,
    );
    expect(card, "the card must render the shared anchor strip").toContain("<HartaFirmelorLink");
    const link = read(path.join(SRC, "components", LINK_FILE));
    expect(link, "the anchor href must be built from the site origin").toMatch(
      /href=\{hartaFirmelorCompanyUrl\(/,
    );
  });
});

/**
 * The anchors exist to pass link equity to harta-firmelor.ro (issue #82). Two
 * things would silently undo that: a `nofollow` or `sponsored` rel, and the
 * anchor dropping off the older `/achizitii/firma/[id]` page, which is the one
 * the sitemap advertises and search engines rank. Both are greps over source
 * text, so they only say the code still spells it that way.
 */
describe("the outbound anchors to harta-firmelor.ro count", () => {
  const link = () => read(path.join(SRC, "components", LINK_FILE));
  const footer = () => read(path.join(SRC, "components", "footer.tsx"));

  it("is rendered by both firm pages, the framed card and the older contract list", () => {
    const renders = files.filter((f) => read(f).includes("<HartaFirmelorLink")).map(rel);
    expect(renders.sort()).toEqual([
      "components/company-achizitii.tsx",
      "components/harta-firmelor-card.tsx",
    ]);
  });

  it("on the older page, only for the firm slug, never for an authority or a cpv", () => {
    const page = read(path.join(SRC, "components", "company-achizitii.tsx"));
    expect(page).toMatch(/slug === "firma" &&[^(]*\(\s*<div[^>]*>[\s\S]*?<HartaFirmelorLink/);
  });

  it("on the older page, is fed the supplier's CUI, not the route id", () => {
    // /achizitii/firma/[id] takes e-licitatie's supplier entityId (41221 for
    // CUI 2864518). Handing that to the anchor would link a different company.
    const page = read(path.join(SRC, "components", "company-achizitii.tsx"));
    expect(page).toMatch(/<HartaFirmelorLink nationalId=\{supplier\.numericFiscalNumber\} \/>/);
    expect(page).toMatch(/href=\{`\/firma\/\$\{supplier\.numericFiscalNumber\}`\}/);
    expect(page).not.toMatch(/<HartaFirmelorLink nationalId=\{id\}/);
  });

  it("the footer links the harta home through the shared origin constant", () => {
    expect(footer()).toMatch(/href=\{HARTA_FIRMELOR_ORIGIN\}/);
  });

  it("carries neither nofollow nor sponsored", () => {
    for (const source of [link(), footer()]) {
      expect(source).not.toMatch(/rel="[^"]*(nofollow|sponsored)/);
    }
  });
});

/**
 * Tailwind's scanner is a regex over raw file text, not a type-aware pass. An
 * arbitrary-value class assembled at runtime (`h-[${n}px]`) produces no CSS at
 * all, and the frame would then have NO pre-JS height: no error, no warning,
 * just a collapsed box until the height message lands, and nothing at all with
 * JS off. So the four measured values have to survive as literal text.
 */
describe("the frame's measured placeholder heights stay literal", () => {
  const frameSource = read(path.join(SRC, "components", "harta-firmelor-frame.tsx"));

  it.each(["h-[800px]", "sm:h-[640px]", "md:h-[380px]", "lg:h-[350px]", "xl:h-[260px]"])(
    "carries %s as a literal class",
    (cls) => {
      expect(
        frameSource,
        `${cls} must appear literally or Tailwind emits no rule for it. These are ` +
          "MEASURED frame heights; re-measure before changing one.",
      ).toContain(cls);
    },
  );
});
