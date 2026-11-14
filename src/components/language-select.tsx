import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isSupportedLocale, locale, setLocale } from "@/i18n";
import { Languages } from "lucide-react";

export function LanguageSelect() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground md:size-9 md:rounded-lg"
          aria-label="语言 / Language"
          title="语言 / Language"
        >
          <Languages aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => {
            if (isSupportedLocale(value)) setLocale(value);
          }}
        >
          <DropdownMenuRadioItem value="zh-CN">简体中文</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="zh-TW">繁體中文</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ja">日本語</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ru">Русский</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
