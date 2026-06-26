import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const CommunityMessage = () => {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className="py-20 bg-black">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div id="how-it-works" className="scroll-mt-24">
            <div
              ref={ref}
              className={`rounded-2xl bg-gradient-to-br from-primary/40 via-white/10 to-alm-blue/20 p-px shadow-lg opacity-0 ${
                inView ? "animate-fade-in-up" : ""
              }`}
            >
              <div className="rounded-2xl bg-black/95 p-6 sm:p-8">
                <div className="mb-6 flex flex-col items-center gap-3 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <HelpCircle size={24} />
                  </span>
                  <h3 className="text-xl font-semibold text-white">Sayfamız nasıl çalışıyor?</h3>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-primary hover:no-underline font-medium transition-colors">
                      CAL Community nasıl çalışır?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      CAL Community; öğrenci ve mezunları tek bir dijital çatı altında buluşturan sade bir paylaşım alanıdır. Kulüpler kendi sayfalarını günceller, gelişmeler bölümünde duyuru ve etkinlik bilgileri paylaşılır.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-primary hover:no-underline font-medium transition-colors">
                      Kulüpler ve gelişmeler bölümü ne işe yarar?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Kulüpler kendi faaliyetlerini ve güncellemelerini burada paylaşır. “Gelişmeler” alanı ise duyurular, etkinlikler ve önemli bilgilendirmeler için kullanılır.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-primary hover:no-underline font-medium transition-colors">
                      Destek ihtiyaçları nasıl belirtilir?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Destek talepleri “maddi” ve “manevi” olarak sınıflandırılır. Gerekli açıklamalar ilgili başlık altında yer alır.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-primary hover:no-underline font-medium transition-colors">
                      Mezunlar bölümü nedir?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Mezunlar bölümünde profiller bulunur. İsteyen mezunlar anonim kalabilir; anonim profillerde yalnızca isim-soyisim baş harfleri ve mezuniyet yılı görünür.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-primary hover:no-underline font-medium transition-colors">
                      Öğrenciler anonim kalabilir mi?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Evet. Öğrenciler için de anonim profil esası geçerlidir. Sadece baş harfler, mezuniyet yılı ve dönem bilgisi paylaşılır.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-primary hover:no-underline font-medium transition-colors">
                      Mezunlar Dayanışma alanı nedir?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Mezunlara özel bir paylaşım alanıdır. Mezunlar kısa başlıklar ve açıklamalarla konular açabilir, diğer mezunlar yorum ekleyebilir. Böylece bilgi ve deneyim paylaşımı düzenli ve güvenli şekilde ilerler.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-primary hover:no-underline font-medium transition-colors">
                      Kişisel veriler nasıl korunur?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Tüm içerikler KVKK prensiplerine uygun, minimum kişisel veri yaklaşımıyla sunulur.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8" className="border-b-0">
                    <AccordionTrigger className="text-white hover:text-primary hover:no-underline font-medium transition-colors">
                      Amaç nedir?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Okul topluluğunu bir arada tutmak, iletişimi kolaylaştırmak ve dayanışmayı güçlendirmek.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityMessage;
