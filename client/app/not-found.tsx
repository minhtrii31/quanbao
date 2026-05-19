import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Không tìm thấy trang</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Trang bạn đang mở không tồn tại hoặc đã được di chuyển.
        </p>
        <Button asChild className="mt-6 rounded-none">
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    </main>
  );
}
