import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const GizlilikPolitikasi = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">GİZLİLİK POLİTİKASI</h1>

          <p className="text-sm text-muted-foreground">
            Yürürlük Tarihi: 26.06.2026 · Sürüm: v2.0
          </p>

          <section className="space-y-2">
            <p className="text-muted-foreground">
              Bu Gizlilik Politikası, CAL Community (calcom.club) internet sitesi ve ilişkili dijital
              hizmetler kapsamında hangi kişisel verilerin hangi amaçla işlendiğini, kimlerle
              paylaşılabileceğini ve haklarınızı nasıl kullanabileceğinizi açıklamaktadır.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Veri Sorumlusu</h2>
            <p className="text-muted-foreground">
              Kişisel verileriniz, veri sorumlusu sıfatıyla Umut Barış Terzioğlu tarafından
              işlenmektedir. Adres: Gutenbergstrasse 28, 44139 Dortmund, Almanya. İletişim:
              ubterzioglu@gmail.com, +49 173 956 94 29 ve +90 530 240 49 95.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">İşlenen Veri Kategorileri</h2>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Kimlik ve profil verileri: ad soyad, mezuniyet yılı</li>
              <li>İletişim verileri: e-posta, WhatsApp numarası, sosyal medya bağlantıları</li>
              <li>Hesap ve üyelik verileri: giriş kayıtları, üyelik durumu</li>
              <li>Kullanıcı içeriği: profil biyografisi, dayanışma başlıkları, yorumlar</li>
              <li>Teknik veriler: IP adresinin özetlenmiş (hash) hâli, zaman damgası, tarayıcı bilgisi, güvenlik ve hata logları</li>
              <li>Analitik veriler: sayfa görüntüleme, oturum olayları ve benzeri ölçüm verileri</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">İşleme Amaçları</h2>
            <p className="text-muted-foreground">
              Kişisel verileriniz; hesabın oluşturulması ve yönetimi, öğrenci ve mezun topluluğu
              arasındaki etkileşimin yürütülmesi, kullanıcı destek taleplerinin cevaplanması, güvenliğin
              sağlanması ve kötüye kullanımın önlenmesi, hizmet performansının ölçülmesi, hukuki
              yükümlülüklerin yerine getirilmesi ve uyuşmazlıkların yönetimi amaçlarıyla işlenir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Hukuki Dayanaklar</h2>
            <p className="text-muted-foreground">
              Veriler; sözleşmenin (üyeliğin) kurulması ve ifası, veri sorumlusunun meşru menfaati,
              hukuki yükümlülüklerin yerine getirilmesi ve yalnızca gerektiği hâllerde açık rıza hukuki
              sebeplerine dayanılarak işlenir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Üçüncü Taraf Hizmet Sağlayıcılar</h2>
            <p className="text-muted-foreground">
              Hizmetin sunulması kapsamında aşağıdaki sağlayıcılar kullanılmaktadır:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Barındırma / dağıtım: Vercel</li>
              <li>Veritabanı / backend: Supabase</li>
              <li>Kod yönetimi / operasyon: GitHub</li>
              <li>Analitik: Microsoft Clarity ve GoatCounter</li>
            </ul>
            <p className="text-muted-foreground">
              Her sağlayıcı yalnızca ilgili hizmetin gerektirdiği ölçüde veri işleyebilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Uluslararası Veri Aktarımı</h2>
            <p className="text-muted-foreground">
              Kişisel veriler, kullanılan hizmet sağlayıcıların altyapısına bağlı olarak Türkiye dışında
              veya Avrupa Ekonomik Alanı dışında bulunan ülkelerde işlenebilir. Uygulanabildiği ölçüde
              sözleşmesel ve teknik güvenlik önlemleri alınır.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Profil Görünürlüğü</h2>
            <p className="text-muted-foreground">
              Mezun profili oluştururken paylaştığınız iletişim ve sosyal medya bilgileri, profilinizin
              diğer üyeler tarafından görüntülenmesini sağlamak amacıyla kullanılabilir. Öğrencilerimizi
              korumak amacıyla öğrenci isimleri yalnızca baş harfleriyle gösterilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Saklama Süreleri</h2>
            <p className="text-muted-foreground">
              Kişisel veriler, işleme amacı için gerekli süre boyunca ve mevzuattan doğan saklama
              yükümlülükleri süresince tutulur. Hesabınızın silinmesi hâlinde, hukuki yükümlülükler
              kapsamında saklanması gerekenler dışındaki verileriniz makul süre içinde silinir veya anonim
              hâle getirilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Güvenlik</h2>
            <p className="text-muted-foreground">
              Kişisel verilerin korunması için erişim kontrolü, loglama, istek hız sınırlandırması
              (rate-limit), kimlik doğrulama, IP adreslerinin özetlenmesi (hash) ve ihtiyaç bazlı
              yetkilendirme gibi teknik ve idari tedbirler uygulanır. İnternet ortamında hiçbir aktarımın
              mutlak güvenliği garanti edilemez.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Haklarınız</h2>
            <p className="text-muted-foreground">
              İlgili kişi olarak; verilerinize erişme, düzeltme, silme, işlemeye itiraz ve zararın
              giderilmesini talep etme haklarına sahipsiniz. Taleplerinizi ubterzioglu@gmail.com adresine
              iletebilirsiniz.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Değişiklikler</h2>
            <p className="text-muted-foreground">
              Bu politika güncellenebilir. Esaslı değişikliklerde yeni sürüm tarihi yayımlanır ve gerekli
              hâllerde kullanıcıya bildirim gösterilir.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GizlilikPolitikasi;
