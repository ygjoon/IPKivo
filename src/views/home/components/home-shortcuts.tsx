import { ShortcutGrid } from "@/components/shortcut-grid";
import { Card, CardContent } from "@/components/ui/card";

/** Flat directory of every tool. */
export function HomeShortcuts() {
  return (
    // `data-plain-links`: the home page's hover-underline rule skips these tiles.
    <Card data-plain-links="">
      <CardContent>
        <ShortcutGrid />
      </CardContent>
    </Card>
  );
}
