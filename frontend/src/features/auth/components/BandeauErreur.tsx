export function BandeauErreur({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null

  return (
    <div
      role="alert"
      className="flex gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-800"
    >
      <ErreurIcon />
      <ul className="flex flex-col gap-1">
        {messages.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  )
}

function ErreurIcon() {
  return (
    <svg
      className="mt-0.5 size-3.5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6M12 16.5h.01" />
    </svg>
  )
}
