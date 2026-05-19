"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Mail, Trash2 } from "lucide-react";
import { Contact } from "@/types/api";
import { deleteContact, getContacts, updateContact } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";
import { AdminPageHeader, ConfirmDialog, EmptyState, PageError, PageLoading, StatusBadge } from "@/components/admin";

const statuses = [
  { value: "", label: "Tất cả" },
  { value: "new", label: "Mới" },
  { value: "read", label: "Đã đọc" },
  { value: "replied", label: "Đã trả lời" },
] as const;

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Contact | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getContacts({ page, limit: 10, search: query, status: status as Contact["status"] | "" });
      setContacts(data.contacts);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setSelected((current) => current ? data.contacts.find((item) => item._id === current._id) || null : data.contacts[0] || null);
    } catch (error) {
      const message = getApiErrorMessage(error, "Không tải được liên hệ");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, query, status]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleStatus = async (contact: Contact, nextStatus: Contact["status"]) => {
    try {
      setUpdatingStatus(true);
      const updated = await updateContact(contact._id, nextStatus);
      setContacts((items) => items.map((item) => item._id === updated._id ? updated : item));
      setSelected(updated);
      toast.success("Đã cập nhật trạng thái");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không cập nhật được liên hệ"));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (contact: Contact) => {
    try {
      setDeleting(true);
      await deleteContact(contact._id);
      setConfirmDelete(null);
      setSelected(null);
      toast.success("Đã xóa liên hệ");
      await fetchContacts();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không xóa được liên hệ"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-svh bg-background">
      <div className="space-y-5 px-4 py-6 pt-20 sm:space-y-6 lg:px-6 lg:py-8">
        <AdminPageHeader
          title="Quản lý liên hệ"
          description="Xem, lọc, đổi trạng thái và xóa tin nhắn liên hệ"
          icon={<Mail className="h-5 w-5" />}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,320px)_160px]">
          <div className="space-y-1.5">
            <Label htmlFor="contacts-search">Tìm kiếm</Label>
            <Input
              id="contacts-search"
              className="rounded-none"
              placeholder="Tên, email, chủ đề..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contacts-status">Trạng thái</Label>
            <select
              id="contacts-status"
              className="h-9 w-full rounded-none border border-input bg-transparent px-2.5 text-sm"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              {statuses.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:gap-6">
          <Card className="min-w-0 rounded-none py-0">
            <CardContent className="p-0">
              {loading ? (
                <PageLoading className="border-0" />
              ) : error ? (
                <PageError message={error} onRetry={fetchContacts} className="border-0" />
              ) : contacts.length === 0 ? (
                <EmptyState title="Không có liên hệ phù hợp" className="border-0" />
              ) : (
                <div className="divide-y divide-border">
                  {contacts.map((contact) => (
                    <button
                      key={contact._id}
                      type="button"
                      onClick={() => setSelected(contact)}
                      className={`w-full min-w-0 p-4 text-left hover:bg-muted/40 ${selected?._id === contact._id ? "bg-muted/50" : ""}`}
                    >
                      <div className="flex min-w-0 items-center justify-between gap-3">
                        <p className="min-w-0 truncate font-medium">{contact.subject}</p>
                        <StatusBadge status={contact.status} className="shrink-0" />
                      </div>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {contact.name} - {contact.email}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="min-w-0 rounded-none py-0">
            <CardContent className="space-y-4 p-4 sm:p-5">
              {selected ? (
                <>
                  <div>
                    <h2 className="break-words font-semibold">{selected.subject}</h2>
                    <p className="text-sm text-muted-foreground">{new Date(selected.createdAt).toLocaleString("vi-VN")}</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="break-words"><span className="font-medium">Tên:</span> {selected.name}</p>
                    <p className="break-words"><span className="font-medium">Email:</span> {selected.email}</p>
                    {selected.phone && <p className="break-words"><span className="font-medium">Điện thoại:</span> {selected.phone}</p>}
                  </div>
                  <p className="whitespace-pre-wrap break-words border border-border p-3 text-sm leading-relaxed">{selected.message}</p>
                  <div className="space-y-1.5">
                    <Label htmlFor="selected-contact-status">Trạng thái xử lý</Label>
                    <select
                      id="selected-contact-status"
                      className="h-9 w-full rounded-none border border-input bg-transparent px-2.5 text-sm"
                      value={selected.status}
                      onChange={(event) => handleStatus(selected, event.target.value as Contact["status"])}
                      disabled={updatingStatus}
                    >
                      <option value="new">Mới</option>
                      <option value="read">Đã đọc</option>
                      <option value="replied">Đã trả lời</option>
                    </select>
                    {updatingStatus && <p className="text-xs text-muted-foreground">Đang cập nhật...</p>}
                  </div>
                  <Button
                    variant="ghost"
                    className="rounded-none text-destructive hover:text-destructive"
                    onClick={() => setConfirmDelete(selected)}
                    disabled={deleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa liên hệ
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Chọn một liên hệ để xem nội dung</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>
            Hiển thị {total > 0 ? `${(page - 1) * 10 + 1}-${Math.min(page * 10, total)}` : "0-0"} của {total}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1 || loading}
            aria-label="Trang trước"
          >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>{page}/{totalPages}</span>
            <Button
              variant="outline"
              size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages || loading}
            aria-label="Trang sau"
          >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Xác nhận xóa"
        description={`Xóa liên hệ từ ${confirmDelete?.name || "khách hàng"}? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa liên hệ"
        loading={deleting}
        onConfirm={() => {
          if (confirmDelete) return handleDelete(confirmDelete);
        }}
        onOpenChange={(open) => {
          if (!open) setConfirmDelete(null);
        }}
      />
    </div>
  );
}
