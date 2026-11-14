import { locale } from "@/i18n";
import { toSeoLocale } from "@/lib/seo";
import { localizedFaq } from "@/lib/seo-faq";
import { LookupFaq } from "./lookup-faq";

export function SeoFaq({ route }: { route: string }) {
  const items = localizedFaq(route, toSeoLocale(locale)).map(
    ({ question, answer }) => ({
      title: question,
      text: answer,
    }),
  );
  return <LookupFaq items={items} />;
}
