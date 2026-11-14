import { useEffect, useState } from "react";
import { locale } from "@/i18n";
import {
  getCachedLocalizedFaq,
  loadLocalizedFaq,
  type FaqItem,
} from "@/lib/seo-faq-client";
import { LookupFaq } from "./lookup-faq";

export function SeoFaq({ route }: { route: string }) {
  const [items, setItems] = useState<readonly FaqItem[]>(
    () => getCachedLocalizedFaq(route, locale) ?? [],
  );

  useEffect(() => {
    let active = true;
    void loadLocalizedFaq(route, locale).then((loaded) => {
      if (active) setItems(loaded);
    });
    return () => {
      active = false;
    };
  }, [route]);

  if (!items.length) return null;

  return (
    <LookupFaq
      items={items.map(({ question, answer }) => ({
        title: question,
        text: answer,
      }))}
    />
  );
}
