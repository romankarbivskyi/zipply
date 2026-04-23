export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-center justify-center p-4 md:p-16">
      {children}
    </div>
  );
}
