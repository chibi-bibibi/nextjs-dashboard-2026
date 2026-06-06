export default function PageHeader({
  parent,
  title,
}: {
  parent?: string;
  title: string;
}) {
  return (
    <h1 className="mb-6 flex items-center gap-1.5 text-lg font-semibold text-foreground">
      {parent && (
        <>
          <span className="font-normal text-muted-foreground">{parent}</span>
          <span className="text-muted-foreground">›</span>
        </>
      )}
      {title}
    </h1>
  );
}
