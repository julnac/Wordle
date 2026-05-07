export default function DashboardLoading() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-pulse">
            <div className="space-y-2">
                <div className="h-9 w-64 rounded bg-muted" />
                <div className="h-4 w-48 rounded bg-muted" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
                        <div className="h-4 w-24 rounded bg-muted" />
                        <div className="h-10 w-16 rounded bg-muted" />
                    </div>
                ))}
            </div>
            <div className="h-12 w-40 rounded bg-muted" />
        </div>
    );
}
