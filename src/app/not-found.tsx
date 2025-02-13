import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code2, Coffee } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center space-y-8 px-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            404: Page Not Found
          </h1>
          <h2 className="text-xl font-medium text-muted-foreground">
            Oops! Looks like this page took a coffee break ☕
          </h2>
        </div>

        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <Code2 className="h-12 w-12" />
          <Coffee className="h-8 w-8 animate-bounce" />
          <Code2 className="h-12 w-12" />
        </div>

        <p className="max-w-[600px] text-muted-foreground">
          While our code monkeys are busy debugging, why not head back to safety?
          They&apos;ve had too much coffee and might have misplaced this page.
        </p>

        <Button asChild className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Homepage
          </Link>
        </Button>

        <p className="text-sm text-muted-foreground">
          P.S. If you were looking for a 404 page, congratulations! You found it! 🎉
        </p>
      </div>
    </div>
  )
}