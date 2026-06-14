import PageHeader from '@/app/ui/page-header';
import LocationForm from '@/app/ui/locations/form';
import { fetchLocationById } from '@/app/lib/data.locations';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const loc = await fetchLocationById(id);
  if (!loc) notFound();

  return (
    <main>
      <PageHeader parent="場所" title={loc.name} />
      <LocationForm
        readOnly
        cancelHref="/locations"
        editHref={`/locations/${id}/edit`}
        defaultName={loc.name}
        defaultNameKana={loc.name_kana ?? ''}
        defaultNameRome={loc.name_rome ?? ''}
        createdAt={loc.created_at}
        updatedAt={loc.updated_at}
      />
    </main>
  );
}
