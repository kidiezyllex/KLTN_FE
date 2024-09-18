export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1920px] w-full mx-auto xl:px-20 px-4 py-4 dark:bg-slate-800 bg-white">
      {children}
    </div>
  );
}
