"use client";

import Link from "next/link";
import { useKeycloak } from "../auth/KeycloakProvider";
// import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";

export default function Navbar() {
    const { keycloak, authenticated, profile } = useKeycloak();
    // console.log("profile:", profile);
    // console.log("tokenParsed:", keycloak?.tokenParsed);

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
                    {authenticated && (
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/dashboard/stats" className="text-sm">Stats</NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                    {authenticated && profile && (
                        <span className="mr-2 text-sm">Witaj, {profile.username}!</span>
                    )}
                    {authenticated && profile && keycloak?.tokenParsed?.realm_access?.roles?.includes('app-admin') && (
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/dashboard/admin" className="text-sm">Admin Panel</NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                    {!authenticated && keycloak && (
                        <>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/login" className="text-sm">Login</NavigationMenuLink>
                            </NavigationMenuItem>
                        </>
                    )}
                    {authenticated && keycloak && (
                        <NavigationMenuItem>
                            {/*<Button variant="destructive" onClick={() => keycloak.logout({ redirectUri: window.location.origin })}>*/}
                            {/*    Logout*/}
                            {/*</Button>*/}
                            <NavigationMenuLink href="/logout" className="text-sm">Logout</NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                </NavigationMenuList>
            </div>
        </NavigationMenu>
    );
}

{/*<Button onClick={() => keycloak.login()}>Login</Button>*/}
