"use client";

import Link from "next/link";
import { useKeycloak } from "../auth/KeycloakProvider";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";

export default function Navbar() {
    const { keycloak, authenticated, profile } = useKeycloak();
    // console.log("profile:", profile);
    // console.log("tokenParsed:", keycloak?.tokenParsed);

    return (
        <NavigationMenu className="w-full bg-background border-b">
            <div className="container mx-auto flex justify-between items-center py-3">
                <NavigationMenuList className="flex items-center">
                    <NavigationMenuItem>
                        <Link href="/" className="text-xl font-bold">WordleApp</Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
                <NavigationMenuList className="flex items-center gap-2">
                    {authenticated && (
                        <NavigationMenuItem>
                            <Link href="/dashboard" className="text-sm">Dashboard</Link>
                        </NavigationMenuItem>
                    )}
                    {authenticated && (
                        <NavigationMenuItem>
                            <Link href="/dashboard/game" className="text-sm">Play</Link>
                        </NavigationMenuItem>
                    )}
                    {authenticated && (
                        <NavigationMenuItem>
                            <Link href="/dashboard/leaderboard" className="text-sm">Leaderboard</Link>
                        </NavigationMenuItem>
                    )}
                    {authenticated && (
                        <NavigationMenuItem>
                            <Link href="/dashboard/stats" className="text-sm">Stats</Link>
                        </NavigationMenuItem>
                    )}
                    {authenticated && profile && (
                        <span className="mr-2 text-sm">Witaj, {profile.username}!</span>
                    )}
                    {authenticated && profile && keycloak?.tokenParsed?.realm_access?.roles?.includes('app-admin') && (
                        <NavigationMenuItem>
                            <Link href="/dashboard/admin" className="text-sm">Admin Panel</Link>
                        </NavigationMenuItem>
                    )}
                    {!authenticated && keycloak && (
                        <>
                            <NavigationMenuItem>
                                <Link href="/login" className="text-sm">Login</Link>
                            </NavigationMenuItem>
                        </>
                    )}
                    {authenticated && keycloak && (
                        <NavigationMenuItem>
                            <Button variant="destructive" onClick={() => keycloak.logout({ redirectUri: window.location.origin })}>
                                Logout
                            </Button>
                        </NavigationMenuItem>
                    )}
                </NavigationMenuList>
            </div>
        </NavigationMenu>
    );
}

{/*<Button onClick={() => keycloak.login()}>Login</Button>*/}
