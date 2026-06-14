import Link from 'next/link';
import { fetchLocations } from '@/app/lib/data.locations';


export default async function LocationsTable({ query = '', currentPage = 1 }: { query?: string; currentPage?: number }) {
  const locations = await fetchLocations(query, currentPage);

  return (
    <div className="mt-4 overflow-auto h-90">
      <table className="w-full table-fixed text-sm">
        <colgroup>
          <col className="w-full" />
        </colgroup>
        <thead>
          <tr className="text-left text-xs font-medium text-muted-foreground">
            <th className="sticky top-0 z-10 bg-card border-b border-border py-2 px-3 font-medium">場所名</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {locations.length === 0 ? (
            <tr>
              <td colSpan={1} className="py-12 text-center text-sm text-muted-foreground">
                {query ? '検索結果が見つかりません' : '場所が登録されていません'}
              </td>
            </tr>
          ) : (
            locations.map((loc) => (
              <tr key={loc.id} className="relative hover:bg-muted/50 cursor-pointer">
                <td className="py-2.5 px-3 font-medium text-foreground">
                  <Link
                    href={`/locations/${loc.id}`}
                    className="block after:absolute after:inset-0"
                  >
                    <span className="block truncate">{loc.name}</span>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
