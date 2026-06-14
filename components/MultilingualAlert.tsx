import { SafetyMessage } from "@/lib/mockData";

/** Worker safety message in English, Arabic, Hindi, and Urdu. */
export default function MultilingualAlert({
  messages,
}: {
  messages: SafetyMessage[];
}) {
  return (
    <div className="glass p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">💬</span>
        <h3 className="text-base font-bold text-brand-900">
          Worker safety alert
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.code}
            className="rounded-2xl bg-white/50 p-3"
            dir={msg.rtl ? "rtl" : "ltr"}
          >
            <p
              className="text-[11px] font-bold uppercase tracking-wide text-brand-600"
              dir="ltr"
            >
              {msg.language}
            </p>
            <p
              className={`mt-1 text-sm leading-relaxed text-brand-900 ${
                msg.rtl ? "text-right" : ""
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
