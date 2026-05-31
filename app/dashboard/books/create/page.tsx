import Form from "@/app/ui/invoices/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Books", href: "/dashboard/books" },
          {
            label: "Create Book",
            href: "/dashboard/books/create",
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
