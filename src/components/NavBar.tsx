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

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-row justify-around" >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ml-auto">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Code2 className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                ICPC Assiut
              </span>
            </Link>
            <NavigationMenu className="hidden sm:ml-6 sm:flex gap-7">
              <NavigationMenuList className="flex flex-row gap-7">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Training</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid  p-4 w-[300px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link1 href="/trainings">
                            <div className="text-sm font-medium leading-none">
                              All Trainings
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
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
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
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
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                              Track your training applications.
                            </p>
                          </Link1>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref className="ml-6">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      About Us
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-2">
            <nav className="flex items-center space-x-1 sm:space-x-2 gap-7">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" className="hidden sm:inline-flex" asChild>
                <Link href="/register">Register</Link>
              </Button>
              <Button variant="ghost" size="icon" className="sm:hidden" asChild>
                <Link href="/login">
                  <span className="sr-only">Login</span>
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

const Link1 = ({ children, href }: { children: any; href: string }) => (
  <Link
    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
    href={href}
  >
    {children}
  </Link>
);
