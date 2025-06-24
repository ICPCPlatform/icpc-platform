import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DevToolsSidebarToggle({ onClick, className = "" }: { onClick: () => void, className?: string }) {
  const enabled = typeof window !== "undefined" && process.env.NEXT_PUBLIC_DEV_TOOLS === "true";
  if (!enabled) return <></>;
  return (
    <Button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-2xl ${className}`}
      variant="default"
      title="Toggle DevTools Sidebar"
      aria-label="Toggle DevTools Sidebar"
    >
      🛠️
    </Button>
  );
}

export function DevToolsSidebar({ open }: { open: boolean }) {
  const enabled = typeof window !== "undefined" && process.env.NEXT_PUBLIC_DEV_TOOLS === "true";
  const [status, setStatus] = useState<null | { user: string; status: string; dbUser?: { gmail?: string; username?: string; role?: string }; password: string }[]>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!enabled || !open) return;
    setLoading(true);
    setError("");
    fetch("/api/dev/seed")
      .then(res => res.json())
      .then(data => {
        setStatus(data.results);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not fetch dev user status.");
        setLoading(false);
      });
  }, [enabled, open]);
  if (!enabled) return <></>;
  if (!open) return <></>;
  return (
    <div className="fixed right-0 top-16 w-[370px] max-w-full h-[calc(100vh-4rem)] z-40 flex flex-col items-stretch bg-background/95 shadow-2xl border-l border-border">
      <Card className="h-full flex flex-col p-8 pt-8 rounded-none shadow-none bg-background border-0 auth-card">
        <h2 className="auth-title mb-6 flex items-center gap-2 text-lg font-bold">
          <span role="img" aria-label="tools">🛠️</span> Dev Login Users
        </h2>
        {error && <div className="text-destructive bg-destructive/10 border border-destructive rounded px-4 py-2 mb-4">
          {error} <Button variant="link" onClick={() => window.location.reload()} className="ml-2 text-primary p-0 h-auto">Retry</Button>
        </div>}
        {loading && !error && <div className="text-muted-foreground">Loading...</div>}
        {status && !loading && (
          <div className="bg-card rounded-lg shadow p-0 mb-6 border border-border overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-muted z-10">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Email</th>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Username</th>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Password</th>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {status.map((u) => (
                  <tr key={u.user} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-2 font-mono text-xs text-foreground whitespace-nowrap">{u.dbUser?.gmail || u.user}</td>
                    <td className="px-3 py-2 font-mono text-xs text-foreground whitespace-nowrap">{u.dbUser?.username || '-'}</td>
                    <td className="px-3 py-2 font-mono text-xs text-foreground whitespace-nowrap">{u.password}</td>
                    <td className="px-3 py-2 font-semibold flex items-center gap-2">
                      {u.status === 'created' ? (
                        <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                      ) : (
                        <span className="text-muted-foreground font-bold">•</span>
                      )}
                      <span className={u.status === 'created' ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}>{u.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-auto text-sm text-primary bg-primary/10 border border-primary rounded-lg px-4 py-3 font-medium shadow-sm">
          <b>Note:</b> This panel only appears if <code>NEXT_PUBLIC_DEV_TOOLS=true</code> in your .env file.<br />
          It will also create the users in the database if they do not exist.
        </div>
      </Card>
    </div>
  );
} 