import { SeoFaq } from "@/components/seo-faq";
import AiDiagnostics from "@/views/components/ai-diagnostics";

export default function GptPage() {
  return (
    <div className="flex flex-col gap-3">
      <AiDiagnostics kind="gpt" />
      <SeoFaq route="/unlock/gpt" />
    </div>
  );
}
