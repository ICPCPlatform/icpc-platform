"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    return <Suspense >
        <Login />
    </Suspense>
}

function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const username = searchParams.get("username") ?? "";
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            <Card className="w-full max-w-md p-8 shadow-lg rounded-lg mt-10">
                <h1 className="text-2xl font-bold mb-4 text-center">Welcome Back</h1>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                    Please enter your credentials to continue
                </p>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <Input
                            type="text"
                            id="username"
                            name="username"
                            defaultValue={username}
                            required
                            placeholder="Enter your username"
                            className="mt-1 border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            required
                            placeholder="Enter your password"
                            className="mt-1 border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-black text-white py-2 rounded-md"
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                </form>
                {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
                <p className="text-sm text-center mt-6">
                    Don{"'"}t have an account? <Link href="/register" className="text-primary">Sign up</Link>
                </p>
            </Card>
        </div>
    )

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError("");
        
        const form = event.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                credentials: "include",
                body: JSON.stringify(data),
            });

            if (response.status === 200 || response.status === 307) {
                router.push("/profile");
            } else if (response.status === 429) {
                setError("Too many login attempts. Please try again later.");
            } else {
                const result = await response.json().catch(() => ({}));
                setError(result.error || "Invalid username or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }
}
