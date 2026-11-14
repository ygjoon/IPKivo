import { lazy, Suspense, useState, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog";

const ResponsiveMobileDrawer = lazy(() =>
  import("./drawer").then((m) => ({ default: m.ResponsiveMobileDrawer })),
);

export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  dialogClassName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
  dialogClassName?: string;
}) {
  const mobile = useIsMobile();
  const [hasOpened, setHasOpened] = useState(open);
  if (open && !hasOpened) setHasOpened(true);

  if (!open && !hasOpened) return null;

  if (mobile)
    return (
      <Suspense fallback={null}>
        <ResponsiveMobileDrawer
          open={open}
          onOpenChange={onOpenChange}
          title={title}
          description={description}
        >
          {children}
        </ResponsiveMobileDrawer>
      </Suspense>
    );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[85dvh] overflow-y-auto",
          dialogClassName ?? "sm:max-w-xl",
        )}
      >
        <DialogHeader className="gap-1">
          <DialogTitle className="pr-8 text-sm leading-5">{title}</DialogTitle>
          <DialogDescription className="text-xs leading-4 empty:hidden">
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
