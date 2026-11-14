import { useState } from "react";
import { ShortcutGrid } from "@/components/shortcut-grid";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { t } from "@/i18n";
import { LayoutGrid } from "lucide-react";

export function ToolsLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={t("home.popularTools")}
        title={t("home.popularTools")}
        onClick={() => setOpen(true)}
      >
        <LayoutGrid className="size-4" aria-hidden="true" />
      </Button>
      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title={t("home.popularTools")}
        description={t("navigation.tagline")}
        dialogClassName="sm:max-w-[540px]"
      >
        <div className="pt-1" data-plain-links="">
          <ShortcutGrid
            onSelect={() => setOpen(false)}
            className="grid-cols-4 gap-1.5 max-xs:grid-cols-3"
          />
        </div>
      </ResponsiveDialog>
    </>
  );
}
