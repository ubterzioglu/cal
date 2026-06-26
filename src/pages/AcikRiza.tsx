import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/seo/Seo";

const AcikRiza = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="Açık Rıza Metni"
        description="CAL Community açık rıza metni: rızanın kapsamı, profil görünürlüğü, yurt dışı aktarım ve rızanın geri alınması."
        path="/acik-riza"
      />
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">AÇIK RIZA METNİ</h1>

          <p className="text-sm text-muted-foreground">
            Yürürlük Tarihi: 26.06.2026 · Sürüm: v2.0
          </p>

          <section className="space-y-3">
            <p className="text-muted-foreground">
              Kullanıcı; CAL Community (calcom.club) platformuna üye olurken, KVKK Aydınlatma Metni'nde
              açıklanan kapsam doğrultusunda kişisel verilerinin işlenmesine ve saklanmasına özgür
              iradesiyle açık rıza verdiğini kabul eder.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Rızanın Kapsamı</h2>
            <p className="text-muted-foreground">
              Bu açık rıza özellikle aşağıdaki işleme faaliyetlerini kapsar:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>
                Mezun profilinizde paylaştığınız iletişim ve sosyal medya bilgilerinin (e-posta,
                WhatsApp numarası, LinkedIn, Instagram) diğer üyeler tarafından görüntülenmesi.
              </li>
              <li>
                Hizmetin sunulması için kullanılan üçüncü taraf sağlayıcıların (Vercel, Supabase, GitHub,
                Microsoft Clarity) altyapısı üzerinden verilerin yurt dışında işlenmesi.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Rızanın Geri Alınması</h2>
            <p className="text-muted-foreground">
              Verdiğiniz açık rızayı dilediğiniz zaman geri alabilirsiniz. Geri alma talebinizi
              ubterzioglu@gmail.com adresine iletebilirsiniz. Geri alma işlemi geleceğe etkili sonuç
              doğurur ve önceki işlemlerin hukukiliğini etkilemez.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Önemli Not</h2>
            <p className="text-muted-foreground">
              Üyeliğin kurulması ve sürdürülmesi için zorunlu olan veri işleme faaliyetleri açık rızaya
              değil, sözleşmenin ifası ve meşru menfaat gibi diğer hukuki sebeplere dayanır. Bu açık rıza
              yalnızca yukarıda sayılan, rıza gerektiren işlemler bakımından geçerlidir.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AcikRiza;
