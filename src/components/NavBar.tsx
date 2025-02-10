"use client";
import Link from "next/link";
import { Code2, User, Sun, Moon } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from 'next-themes';
import { TypographyH1 } from "@/components/ui/typography";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.style.getPropertyValue('--background') === '#000000';
    root.style.setProperty('--background', isDark ? '#ffffff' : '#000000');
    root.style.setProperty('--foreground', isDark ? '#333333' : '#ffffff');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-1">
              <Code2 className="h-4 w-4" />
              <TypographyH1 className="hidden text-base font-semibold sm:inline-block">
                ICPC Assiut
              </TypographyH1>
            </Link>
            <NavigationMenu className="hidden sm:ml-4 sm:flex gap-5">
              <NavigationMenuList className="flex flex-row gap-5">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Training</NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white dark:bg-black">
                    <ul className="grid p-3 w-[280px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link1 href="/trainings">
                            <div className="text-sm font-medium leading-none">
                              All Trainings
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                              Browse all available training programs.
                            </p>
                          </Link1>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link1 href="/my-trainings">
                            <div className="text-sm font-medium leading-none">
                              My Trainings
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                              View your enrolled and completed trainings.
                            </p>
                          </Link1>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link1 href="/applications">
                            <div className="text-sm font-medium leading-none">
                              Applications
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                              Track your training applications.
                            </p>
                          </Link1>
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
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-1">
            <nav className="flex items-center space-x-1 sm:space-x-2 gap-5">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

const Link1 = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <Link
    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
    href={href}
  >
    {children}
  </Link>
);
