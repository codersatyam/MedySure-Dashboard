import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/http";

import { demoRequestSchema, type DemoRequestFormValues } from "../schema";
import { useCreateDemoRequest } from "../api/demoRequests.queries";

/** Form-field names we can safely route server `details.field` errors onto. */
const FORM_FIELDS: ReadonlyArray<keyof DemoRequestFormValues> = ["name", "email", "phoneNo"];

/**
 * Modal demo-request form. `trigger` is rendered as the dialog opener (e.g. the
 * existing "Request Demo" button), so callers keep their own styling.
 */
export function DemoRequestDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const createDemoRequest = useCreateDemoRequest();

  const form = useForm<DemoRequestFormValues>({
    resolver: zodResolver(demoRequestSchema),
    defaultValues: { name: "", email: "", phoneNo: "" },
  });

  const onSubmit = (values: DemoRequestFormValues) => {
    createDemoRequest.mutate(values, {
      onSuccess: () => {
        toast.success("Thanks! We'll be in touch shortly.");
        form.reset();
        setOpen(false);
      },
      onError: (err) => {
        // Surface backend field-level validation onto the matching inputs.
        if (err instanceof ApiError && err.status === 400 && err.details?.length) {
          for (const detail of err.details) {
            if ((FORM_FIELDS as string[]).includes(detail.field)) {
              form.setError(detail.field as keyof DemoRequestFormValues, {
                message: detail.message,
              });
            }
          }
          return;
        }
        toast.error(err instanceof Error ? err.message : "Could not submit demo request.");
      },
    });
  };

  // Reset transient state when the dialog closes.
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request a demo</DialogTitle>
          <DialogDescription>
            Tell us how to reach you and our team will set up a personalized walkthrough.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Rahul Sharma" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="rahul@clinic.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={createDemoRequest.isPending}>
              {createDemoRequest.isPending && <Loader2 className="size-4 animate-spin" />}
              {createDemoRequest.isPending ? "Submitting…" : "Request demo"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
