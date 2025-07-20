export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
}

export function MenuItemSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-3">
      <LoadingSkeleton className="h-48 w-full" />
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-3 w-full" />
      <LoadingSkeleton className="h-3 w-2/3" />
      <div className="flex justify-between items-center">
        <LoadingSkeleton className="h-6 w-16" />
        <LoadingSkeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

export function OrderSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-3">
      <div className="flex justify-between items-center">
        <LoadingSkeleton className="h-5 w-20" />
        <LoadingSkeleton className="h-6 w-16" />
      </div>
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-2/3" />
      <div className="flex justify-between items-center">
        <LoadingSkeleton className="h-4 w-16" />
        <LoadingSkeleton className="h-8 w-24" />
      </div>
    </div>
  )
}
