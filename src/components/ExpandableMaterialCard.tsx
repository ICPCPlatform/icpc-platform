"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function ExpandableMaterialCard({ title, link, des }: { title: string; link: string; des: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="p-0 border-none shadow-none bg-transparent w-[480px]">
      <div
        className="flex items-center justify-between cursor-pointer px-2 py-1 border-b hover:bg-muted/50 min-w-0 w-[480px]"
        onClick={() => setOpen((v) => !v)}
        style={{ userSelect: 'none' }}
      >
        <span className="font-medium text-sm truncate block w-[370px]">
          {title && title.trim() ? title : 'Untitled Material'}
        </span>
        <span className="ml-2 text-xs text-muted-foreground min-w-[18px] text-center">
          {open ? '▲' : '▼'}
        </span>
      </div>
      <div style={{ minHeight: open ? undefined : 0 }}>
        {open && (
          <CardContent className="p-2 pt-1 bg-background border-l border-r border-b rounded-b-md w-[480px]">
            <a
              href={link}
              className="text-sm text-primary hover:underline break-all block w-full truncate"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link}
            </a>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line break-words w-full truncate">{des}</p>
          </CardContent>
        )}
      </div>
    </Card>
  );
} 