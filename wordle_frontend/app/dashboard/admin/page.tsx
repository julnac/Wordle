import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminStats from "@/components/AdminStats";
import UserTable from "@/components/UserTable";
import GameTable from "@/components/GameTable";
import DictionaryManager from "@/components/DictionaryManager";

export default function AdminPage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <DictionaryManager />
            <AdminStats />
            <Tabs defaultValue="users" className="mt-6">
                <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="games">Games</TabsTrigger>
                </TabsList>
                <TabsContent value="users">
                    <UserTable />
                </TabsContent>
                <TabsContent value="games">
                    <GameTable />
                </TabsContent>
            </Tabs>
        </div>
    );
}
