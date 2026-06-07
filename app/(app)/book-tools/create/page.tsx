import Form from "@/app/ui/invoices/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Books", href: "/book-tools" },
          {
            label: "Create Book",
            href: "/book-tools/create",
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
