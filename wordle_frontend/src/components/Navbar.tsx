"use client";

import { useAuth } from "@/src/components/auth/AuthProvider";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/src/components/ui/navigation-menu";

export default function Navbar() {
    const { authenticated, profile } = useAuth();

    return (
        <NavigationMenu className="w-full bg-background border-b">
            <div className="container mx-auto flex justify-between items-center py-3">
                <NavigationMenuList className="flex items-center">
                    <NavigationMenuItem>
                        <NavigationMenuLink  href="/" className="text-xl font-bold">WordleApp</NavigationMenuLink >
                    </NavigationMenuItem>
                </NavigationMenuList>
                <NavigationMenuList className="flex items-center gap-2">
                    {authenticated && (
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/dashboard" className="text-sm">Dashboard</NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                    {authenticated && (
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/dashboard/game" className="text-sm">Play</NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                    {authenticated && (
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/dashboard/leaderboard" className="text-sm">Leaderboard</NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                    {!authenticated && (
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/login" className="text-sm">Login</NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                    {authenticated && (
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/logout" className="text-sm">Logout</NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                    {authenticated && profile && (
                        <span className="mr-2 text-sm">{profile.username}</span>
                    )}
                </NavigationMenuList>
            </div>
        </NavigationMenu>
    );
}

{/*<Button onClick={() => keycloak.login()}>Login</Button>*/}
