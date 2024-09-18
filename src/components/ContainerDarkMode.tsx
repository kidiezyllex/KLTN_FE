export default function ContainerDarkMode({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[1920px] w-full mx-auto xl:px-20 px-4 py-4 bg-slate-800 -my-8">
      {children}
    </div>
  );
}
