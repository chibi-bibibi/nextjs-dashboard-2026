import PageHeader from '@/app/ui/page-header';
import LocationForm from '@/app/ui/locations/form';
import { fetchLocationById } from '@/app/lib/data.locations';
import { updateLocation } from '@/app/lib/actions.locations';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const loc = await fetchLocationById(id);
  if (!loc) notFound();

  const action = updateLocation.bind(null, id);

  return (
    <main>
      <PageHeader parent="場所" title={`${loc.name} を編集`} />
      <LocationForm
        action={action}
        cancelHref={`/locations/${id}`}
        defaultName={loc.name}
        defaultNameKana={loc.name_kana ?? ''}
        defaultNameRome={loc.name_rome ?? ''}
      />
    </main>
  );
}
