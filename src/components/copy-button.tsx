import { useEffect, useState } from "react";
import { t } from "@/i18n";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

type CopyButtonProps = {
  value: string;
  className?: string;
};

export function CopyButton({ value, className }: CopyButtonProps) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const copied = copiedValue === value;
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => {
      setCopiedValue((previous) => (previous === value ? null : previous));
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied, value]);
  const label = copied ? t("common.copied") : t("common.copy");
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={className}
      aria-label={label}
      title={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopiedValue(value);
        } catch {
          toast.error(
            t("common.couldCopyAutomaticallySelectPressHoldLinkCopy"),
          );
        }
      }}
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
      <span className="sr-only" role="status">
        {copied ? label : ""}
      </span>
    </Button>
  );
}
