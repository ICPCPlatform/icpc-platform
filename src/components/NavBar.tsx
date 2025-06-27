"use client";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useTheme } from "next-themes";
import { useUserContext } from "@/providers/user";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FaUserCircle, FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import { signOutAction } from "@/app/actions/signout";
import { useTransition } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const user = useUserContext();
  const startTransition = useTransition()[1];

  function handleSignOut() {
    startTransition(async () => {
      await signOutAction();
      window.location.href = "/";
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-6 mr-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/icon.png"
              alt="ICPC Assiut Logo"
              width={32}
              height={32}
              className="h-8 w-8"
              priority
              unoptimized
              onError={(e) => {
                console.error("Error loading image:", e);
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="flex flex-col relative">
              <span className="hidden text-sm font-medium sm:inline-block">
                ICPC Assiut
              </span>
              <span className="text-[0.45rem] text-green-500 font-medium absolute -right-6 bottom-0">
                DEMO
              </span>
            </div>
          </Link>
          <div className="w-2" />
          <NavigationMenu className="hidden sm:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">
                  Training
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[280px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/protected/trainings"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium">
                            Trainings
                          </div>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            Browse all available training programs.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/applications"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium">
                            Applications
                          </div>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            Track your training applications.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/about" className={navigationMenuTriggerStyle()}>
                    About Us
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/virtual-mentor" className={navigationMenuTriggerStyle()}>
                    Virtual Mentor
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="https://forms.gle/i22PhB5fZYF4THa46" target="_blank">
                    Report a bug
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex flex-1 gap-4 items-center justify-end">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-3">
                  <FaUserCircle className="w-5 h-5" />
                  <span className="font-medium max-w-[120px] truncate">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/protected/profile">
                    <FaUserCircle className="mr-2" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/protected/edit-profile">
                    <FaUserEdit className="mr-2" /> Edit Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-md border border-input hover:bg-accent"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
