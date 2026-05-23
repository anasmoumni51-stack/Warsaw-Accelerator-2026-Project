export default function Spinner() {
  return (
    <div className="flex h-96 items-center justify-center" role="status" aria-label="Loading">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-hairline border-t-primary" />
    </div>
  )
}
