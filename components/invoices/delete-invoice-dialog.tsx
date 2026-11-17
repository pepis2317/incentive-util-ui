import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";

export function DeleteInvoiceDialog({ id }: { id: number }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)
  const router = useRouter()
  const onSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/invoices?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "Failed to delete invoice");
      }

      toast.add({
        title: "Deleted invoice data",
      });
      router.refresh();
      setSubmitting(false);
      setOpen(false);
    } catch (e) {
      console.error(e);
      toast.add({
        title: "Error",
        description: e instanceof Error ? e.message : "Something went wrong. Please try again.",
      });
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="destructive"
            size="icon-sm"
            aria-label="Delete transaction"
          />
        }
      >
        <Trash2 />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete invoice</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this invoice? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose
            render={<Button variant="outline" disabled={isSubmitting} />}
          >
            Cancel
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => onSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

}
