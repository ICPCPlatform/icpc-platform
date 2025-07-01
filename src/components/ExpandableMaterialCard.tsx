"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function ExpandableMaterialCard({ title, link, des }: { title: string; link: string; des: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="p-0">
      <div
        className="flex items-center justify-between cursor-pointer p-2 border-b hover:bg-muted/50"
        onClick={() => setOpen((v) => !v)}
        style={{ userSelect: 'none' }}
      >
        <span className="font-medium text-sm">
          {title && title.trim() ? title : 'Untitled Material'}
        </span>
        <span className="ml-2 text-xs text-muted-foreground">{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <CardContent className="p-2">
          {title && title.trim() && (
            <p className="text-sm font-semibold mb-1">{title}</p>
          )}
          <a
            href={link}
            className="text-sm text-primary hover:underline break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link}
          </a>
          <p className="text-sm text-muted-foreground mt-1">{des}</p>
        </CardContent>
      )}
    </Card>
  );
} 