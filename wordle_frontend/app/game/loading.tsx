export default function GameLoading() {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="rounded-lg border bg-card p-6 space-y-4 animate-pulse">
                <div className="h-8 w-48 rounded bg-muted" />
                <div className="h-4 w-64 rounded bg-muted" />
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-10 rounded bg-muted" />
                    <div className="h-10 rounded bg-muted" />
                    <div className="h-10 rounded bg-muted" />
                </div>
                <div className="h-10 w-40 rounded bg-muted" />
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex gap-2">
                            {Array.from({ length: 5 }).map((_, j) => (
                                <div key={j} className="h-12 w-12 rounded border bg-muted" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
