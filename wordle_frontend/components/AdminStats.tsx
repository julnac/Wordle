import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>132</CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Games Played</CardTitle>
                </CardHeader>
                <CardContent>425</CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Win Rate</CardTitle>
                </CardHeader>
                <CardContent>63%</CardContent>
            </Card>
        </div>
    );
}
