import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowRight } from "lucide-react";

import { getCachedCompanyAchizitii } from "@/lib/cached-queries";

import { formatNumber, moneyEur, moneyRon } from "@/utils";
import type { SLUG } from "@/utils/types";
import type { SearchParams } from "./search-list";
import { ListItem } from "./list-item";
import { Pagination } from "./pagination";
import { Chart } from "./chart";
import { PerPage } from "./per-page";
import { CSVDownload } from "./csv-download";
import { HartaFirmelorLink } from "./harta-firmelor-link";

interface CompanyAchizitiiProps {
  id: string;
  slug: SLUG;
  searchParams: SearchParams;
}

export async function CompanyAchizitii({ id, slug, searchParams }: CompanyAchizitiiProps) {
  await connection();
  const { p: page = 1, perPage = 20 } = searchParams;
  const propMappings = {
    autoritate: { authorityId: id },
    firma: { supplierId: id },
    cpv: { cpvCode: id },
  };
  const companyProps = propMappings[slug];
  let results: Awaited<ReturnType<typeof getCachedCompanyAchizitii>>;
  try {
    results = await getCachedCompanyAchizitii({ ...companyProps, page, perPage });
  } catch {
    return notFound();
  }
  const { total, contractingAuthority, supplier, stats } = results;
  const { fiscalNumber, entityName, city, county } = contractingAuthority;

  const totalValue = stats?.years.map((y) => y.value).reduce((a, b) => a + b, 0);
  const totalValueRon = moneyRon(totalValue);
  const totalValueEur = moneyEur(totalValue);

  const titleMappings = {
    autoritate: `${fiscalNumber} / ${entityName} / ${city}, ${county}`,
    firma: `${supplier.fiscalNumber} / ${supplier.entityName} / ${supplier.city}, ${supplier.county}`,
    cpv: `${results.contractingAuthority.cpvCodeAndName}`,
  };

  const title = titleMappings[slug];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-semibold text-lg">{title}</h1>
        <p className="text-sm">
          {formatNumber(total)} achizitii in valoare de{" "}
          <span className="text-primary font-mono">{totalValueRon}</span> /{" "}
          <span className="font-mono">{totalValueEur}</span>
        </p>
      </div>
      {slug === "firma" && supplier.numericFiscalNumber && (
        <div className="space-y-3">
          {/* The older firm page is the one search engines rank. Send them, and
              their readers, to the full profile and to harta-firmelor.ro. The
              route id here is e-licitatie's supplier entityId, not the CUI, so
              both links are built from the supplier record instead. */}
          <Link
            href={`/firma/${supplier.numericFiscalNumber}`}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Vezi profilul complet al firmei
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <HartaFirmelorLink nationalId={supplier.numericFiscalNumber} />
        </div>
      )}
      <Chart stats={stats} />
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs">
            Pagina {page} din {formatNumber(results.total)} rezultate
          </h3>
          <div className="flex gap-2">
            <CSVDownload items={results.items} />
            <PerPage total={perPage} pathname={`/achizitii/${slug}/${id}`} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {results.items.map((item) => (
            <ListItem key={item.id!} fields={item.fields} id={item.id!} index={item.index} />
          ))}
        </div>
        <Pagination
          page={page}
          hasPreviousPage={page > 1}
          hasNextPage={page * perPage < results.total}
          pathname={`/achizitii/${slug}/${id}`}
        />
      </div>
    </div>
  );
}
