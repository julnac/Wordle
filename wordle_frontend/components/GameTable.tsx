import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function GameTable() {
    const games = [
        { id: "g1", player: "Jan Kowalski", result: "Win", attempts: 5 },
        { id: "g2", player: "Anna Nowak", result: "Lose", attempts: 8 },
    ];

    return (
        <div className="mt-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Game ID</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Attempts</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {games.map((game, i) => (
                        <TableRow key={i}>
                            <TableCell>{game.id}</TableCell>
                            <TableCell>{game.player}</TableCell>
                            <TableCell>{game.result}</TableCell>
                            <TableCell>{game.attempts}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
