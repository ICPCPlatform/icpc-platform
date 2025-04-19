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

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const user = useUserContext();

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
                          href="/protected/my-trainings"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium">
                            All Trainings
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
                          href="/protected/my-trainings"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium">
                            My Trainings
                          </div>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            View your enrolled and completed trainings.
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
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About Us
                  </NavigationMenuLink>
                </Link>
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
            <Link href="/protected/profile" className="flex items-center gap-2">
              profile
            </Link>
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
