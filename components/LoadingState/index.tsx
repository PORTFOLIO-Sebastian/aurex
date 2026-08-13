export default function LoadingState() {
  return (
    <div className="w-full flex flex-col gap-4 animate-pulse">
      <div className="flex justify-between items-center px-4">
        <div className="h-8 bg-aurex-surface rounded-md w-48"></div>
        <div className="h-8 bg-aurex-surface rounded-md w-32 hidden md:block"></div>
      </div>
      <div className="h-[600px] bg-aurex-surface rounded-2xl w-full border border-aurex-surface-alt"></div>
    </div>
  );
}
