import PageHeader from '@/app/ui/page-header';
import LocationForm from '@/app/ui/locations/form';
import { createLocation } from '@/app/lib/actions.locations';

export default function Page() {
  return (
    <main>
      <PageHeader parent="場所" title="場所を追加" />
      <LocationForm action={createLocation} cancelHref="/locations" />
    </main>
  );
}
