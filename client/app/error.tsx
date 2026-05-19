"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-foreground">Đã xảy ra lỗi</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Vui lòng thử tải lại trang.
        </p>
        <Button className="mt-6 rounded-none" onClick={reset}>
          Thử lại
        </Button>
      </div>
    </main>
  );
}
