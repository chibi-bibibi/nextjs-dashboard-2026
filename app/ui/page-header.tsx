export default function PageHeader({
  parent,
  title,
  className,
}: {
  parent?: string;
  title: string;
  className?: string;
}) {
  return (
    <h1 className={`mb-6 flex items-center gap-1.5 text-lg font-semibold text-foreground${className ? ` ${className}` : ""}`}>
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
