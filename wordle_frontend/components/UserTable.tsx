import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function UserTable() {
    const users = [
        { name: "Jan Kowalski", email: "jan@wp.pl", games: 12 },
        { name: "Anna Nowak", email: "anna@gmail.com", games: 8 },
    ];

    return (
        <div className="mt-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Games</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user, i) => (
                        <TableRow key={i}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.games}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
