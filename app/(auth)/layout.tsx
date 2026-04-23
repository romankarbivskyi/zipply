export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      {children}
    </div>
  );
}
