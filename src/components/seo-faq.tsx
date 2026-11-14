import { locale } from "@/i18n";
import { localizedFaq } from "@/lib/seo-faq";
import { LookupFaq } from "./lookup-faq";

export function SeoFaq({ route }: { route: string }) {
  const items = localizedFaq(route, locale).map(({ question, answer }) => ({
    title: question,
    text: answer,
  }));
  return <LookupFaq items={items} />;
}
