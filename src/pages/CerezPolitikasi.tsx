import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const cookieRows = [
  {
    provider: "Microsoft Clarity",
    name: "_clck",
    category: "Analitik",
    purpose: "Ziyaretçinin tanımlanması ve oturum tutarlılığı",
    duration: "1 yıl",
    party: "Birinci taraf",
  },
  {
    provider: "Microsoft Clarity",
    name: "_clsk",
    category: "Analitik",
    purpose: "Oturum içindeki sayfa görüntülemelerinin ilişkilendirilmesi",
    duration: "1 gün",
    party: "Birinci taraf",
  },
  {
    provider: "Microsoft Clarity",
    name: "CLID",
    category: "Analitik",
    purpose: "Sitenin ilk kez ziyaret edilip edilmediğinin belirlenmesi",
    duration: "1 yıl",
    party: "Üçüncü taraf",
  },
  {
    provider: "Microsoft Clarity",
    name: "MUID",
    category: "Analitik",
    purpose: "Microsoft hizmetlerinde tekil kullanıcıların tanınması",
    duration: "1 yıl",
    party: "Üçüncü taraf",
  },
  {
    provider: "GoatCounter",
    name: "(çerez kullanmaz)",
    category: "Analitik",
    purpose: "Sayfa görüntüleme istatistiği; çerez veya kalıcı tanımlayıcı kullanmadan ölçüm yapar",
    duration: "—",
    party: "Üçüncü taraf",
  },
];

const CerezPolitikasi = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">ÇEREZ POLİTİKASI</h1>

          <p className="text-sm text-muted-foreground">
            Yürürlük Tarihi: 26.06.2026 · Sürüm: v2.0
          </p>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Çerez Nedir?</h2>
            <p className="text-muted-foreground">
              Çerezler, ziyaret ettiğiniz internet sitesi tarafından tarayıcınıza yerleştirilen küçük
              veri dosyalarıdır. CAL Community (calcom.club), kullanıcı deneyimini geliştirmek, oturum
              yönetimini sağlamak, güvenliği artırmak ve kullanımı ölçmek amacıyla çerezler ve benzeri
              teknolojiler kullanır. Bazı ölçüm teknolojileri çerez kullanmadan da çalışabilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Kullandığımız Çerez Kategorileri</h2>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Zorunlu çerezler: Oturum yönetimi ve güvenlik için gereklidir.</li>
              <li>Analitik / performans çerezleri: Sitenin nasıl kullanıldığını ölçmek için kullanılır.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Çerez Tablosu</h2>
            <p className="text-muted-foreground">
              Analitik ölçüm için Microsoft Clarity ve GoatCounter hizmetleri kullanılmaktadır. Bu
              hizmetlerin kullanabileceği çerezler aşağıda listelenmiştir. Süreler ilgili sağlayıcının
              uygulamasına göre değişebilir.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 pr-3 font-semibold">Sağlayıcı</th>
                    <th className="py-2 pr-3 font-semibold">Ad</th>
                    <th className="py-2 pr-3 font-semibold">Kategori</th>
                    <th className="py-2 pr-3 font-semibold">Amaç</th>
                    <th className="py-2 pr-3 font-semibold">Süre</th>
                    <th className="py-2 font-semibold">Taraf</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieRows.map((row) => (
                    <tr key={`${row.provider}-${row.name}`} className="border-b align-top">
                      <td className="py-2 pr-3 text-muted-foreground">{row.provider}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{row.name}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{row.category}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{row.purpose}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{row.duration}</td>
                      <td className="py-2 text-muted-foreground">{row.party}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Üçüncü Taraflar</h2>
            <p className="text-muted-foreground">
              Microsoft Clarity ve GoatCounter, kendi sistemleri üzerinden veri işleyebilir ve bu
              verileri yurt dışındaki sunucularda tutabilir. Bu sağlayıcılar kendi gizlilik
              politikalarına tabidir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Çerezleri Yönetme</h2>
            <p className="text-muted-foreground">
              Tarayıcı ayarlarınız üzerinden çerezleri silebilir veya engelleyebilirsiniz. Ayrıca pek
              çok tarayıcının "İzleme yapılmasın (Do Not Track)" özelliğini kullanabilirsiniz. Zorunlu
              teknik unsurlar devre dışı bırakılırsa platformun bazı özellikleri tam olarak
              çalışmayabilir.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CerezPolitikasi;
