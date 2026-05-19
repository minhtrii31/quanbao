"use client";

import { ConfirmDialog } from "./confirm-dialog";

export function DirtyFormProtectionDialog({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <ConfirmDialog
      open={open}
      title="Bỏ thay đổi chưa lưu?"
      description="Biểu mẫu hiện có thay đổi chưa lưu. Nếu tiếp tục, các thay đổi này sẽ bị bỏ."
      confirmLabel="Tiếp tục"
      destructive={false}
      onConfirm={onConfirm}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel();
      }}
    />
  );
}
