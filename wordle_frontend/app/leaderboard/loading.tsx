export default function LeaderboardLoading() {
    return (
        <div className="p-6 max-w-5xl mx-auto mt-8 animate-pulse">
            <div className="rounded-lg border bg-card p-6 space-y-4">
                <div className="h-8 w-48 rounded bg-muted" />
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-10 rounded bg-muted" />
                    <div className="h-10 rounded bg-muted" />
                    <div className="h-10 rounded bg-muted" />
                </div>
                <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="h-8 w-8 rounded bg-muted" />
                            <div className="h-8 flex-1 rounded bg-muted" />
                            <div className="h-8 w-20 rounded bg-muted" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
