import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import AdminStats from "@/src/components/admin/AdminStats";
import UserTable from "@/src/components/admin/UserTable";
import GameTable from "@/src/components/admin/GameTable";
import DictionaryManager from "@/src/components/admin/DictionaryManager";

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
