import { useQuery } from '@tanstack/react-query'

async function fetchData(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load data (${res.status})`)
  return res.json()
}

function LoadingSkeleton() {
  return (
    <ul aria-label="Loading" className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <li
          key={i}
          aria-hidden="true"
          className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm animate-pulse flex flex-col gap-2"
        >
          <div className="h-4 bg-gray-200 rounded w-2/5" />
          <div className="h-3 bg-gray-100 rounded w-3/5" />
        </li>
      ))}
    </ul>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      <div className="flex-1">
        <p className="font-semibold text-red-700">Something went wrong</p>
        <p className="text-red-600 text-sm mt-1">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="shrink-0 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg
                   hover:bg-red-700 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
      >
        Try again
      </button>
    </div>
  )
}

function EmptyState({ label }) {
  return (
    <p role="status" className="text-gray-500 text-sm py-4">
      No {label ?? 'items'} found.
    </p>
  )
}

/**
 * ApiList — generic data-fetching list component.
 *
 * Props:
 *   url         string   — API endpoint to fetch, e.g. "/api/results"
 *   queryKey    array    — TanStack Query cache key, e.g. ["results"]
 *   renderItem  fn       — (item) => React node, called for each item
 *   emptyLabel  string   — noun shown in empty state, e.g. "results"
 *   heading     string   — optional section heading
 */
function ApiList({ url, queryKey, renderItem, emptyLabel, heading }) {
  const { data = [], isPending, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchData(url),
  })

  return (
    <section aria-labelledby={heading ? 'api-list-heading' : undefined} className="w-full">
      {heading && (
        <h2 id="api-list-heading" className="text-2xl font-bold tracking-tight text-green-700 mb-4">
          {heading}
        </h2>
      )}

      {isPending && <LoadingSkeleton />}

      {isError && (
        <ErrorState message={error.message} onRetry={refetch} />
      )}

      {!isPending && !isError && data.length === 0 && (
        <EmptyState label={emptyLabel} />
      )}

      {!isPending && !isError && data.length > 0 && (
        <ul className="flex flex-col gap-3">
          {data.map((item, index) => (
            <li key={item.id ?? index}>
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ApiList
