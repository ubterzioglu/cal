import { CheckCircle2 } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const items = [
  "Kulübüne veya takımına göz at, güncellemelerini takip et.",
  "Etkinlikleri kaçırma, neler oluyor bir bak.",
  "Duyuruları ve haberleri buradan takip et.",
  "Bir kulübü, etkinliği veya takımı sahiplenip kendi bilgilerini güncelleyebilirsin.",
  "Mezunsan profilini oluştur, iletişimde kalmak istediğin konuları paylaş.",
  "Hâlâ öğrenciysen anonim ya da kendi adınla profil aç, dönemini bul.",
  "Mezun Dayanışma alanında konu açabilir, başkalarının konularına yorum yazabilirsin.",
  "Bir şey eksik mi, aklına bir fikir mi geldi? Aşağıdan bize yaz.",
];

const WhatCanYouDo = () => {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className="py-20 bg-black">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Başlarken
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ne Yapabilirsin?</h2>
        </div>

        <div
          ref={ref}
          className={`mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 opacity-0 ${
            inView ? "animate-fade-in-up" : ""
          }`}
        >
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhatCanYouDo;
