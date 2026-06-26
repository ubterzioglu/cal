import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Kvkk = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">KVKK AYDINLATMA METNİ</h1>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Veri Sorumlusu</h2>
            <p className="text-muted-foreground">
              Bu platform kapsamında kişisel verileriniz, veri sorumlusu sıfatıyla aşağıda bilgileri
              yer alan kişi tarafından işlenmektedir. Veri sorumlusu Umut Barış Terzioğlu'dur. Adres
              bilgisi Gutenbergstrasse 28, 44139 Dortmund, Almanya'dır. İletişim için
              ubterzioglu@gmail.com e-posta adresi ile +49 173 956 94 29 ve +90 530 240 49 95 numaralı
              telefonlar kullanılabilir. Platform CAL Community Web (calcom.club) üzerinden faaliyet
              göstermektedir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">İşlenen Kişisel Veriler</h2>
            <p className="text-muted-foreground">
              Platforma kayıt ve kullanım kapsamında kullanıcıların ad soyad bilgileri, mezuniyet
              yılı, e-posta adresi, WhatsApp numarası, sosyal medya bağlantıları (LinkedIn, Instagram),
              profil biyografisi, platform içi etkileşimleri ile dayanışma başlığı ve yorum gibi
              kullanıcı içerikleri ve sistem log kayıtları (özetlenmiş IP adresi, zaman damgası gibi
              teknik veriler) işlenebilmektedir. Platform kapsamında fotoğraf verisi toplanmamaktadır.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">İşleme Amaçları</h2>
            <p className="text-muted-foreground">
              Kişisel veriler; kullanıcı hesabının oluşturulması ve yönetilmesi, öğrenci ve mezun
              topluluğu arasındaki iletişimin sağlanması, platform güvenliğinin sağlanması, teknik
              operasyonların yürütülmesi ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla
              işlenmektedir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
            <p className="text-muted-foreground">
              Kişisel verileriniz; üyelik ve profil formları, iletişim kanalları, çerezler ve benzeri
              ölçüm teknolojileri, sunucu logları, API talepleri ve kullanıcı içerikleri gibi elektronik
              ortamlar üzerinden toplanmaktadır. Veriler; açık rıza, sözleşmenin (üyeliğin) kurulması ve
              ifası, veri sorumlusunun meşru menfaati ve yürürlükteki kanuni yükümlülüklerin yerine
              getirilmesi hukuki sebeplerine dayanılarak işlenmektedir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Veri Aktarımı</h2>
            <p className="text-muted-foreground">
              Kişisel verileriniz; teknik altyapı, barındırma ve dağıtım hizmeti sağlayan Vercel,
              veritabanı ve backend hizmeti sağlayan Supabase, kod yönetimi ve operasyon hizmeti sağlayan
              GitHub, kullanım analizi kapsamında Microsoft Clarity ve GoatCounter ile ve yasal talepler
              doğrultusunda yetkili resmi kurumlarla sınırlı ve ölçülü biçimde paylaşılabilir. Bu
              sağlayıcıların altyapısına bağlı olarak veriler yurt dışında işlenebilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Veri Saklama Süresi</h2>
            <p className="text-muted-foreground">
              Kişisel veriler, kullanıcı hesabı aktif olduğu sürece ve işleme amacı ile hukuki
              yükümlülükler kapsamında gerekli olan süre boyunca saklanmaktadır. Saklama süresi sona eren
              veriler silinir, yok edilir veya anonim hâle getirilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Kullanıcı Hakları</h2>
            <p className="text-muted-foreground">
              Kullanıcılar KVKK'nın 11. maddesi kapsamında; kişisel verilerinin işlenip işlenmediğini
              öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amaca uygun kullanılıp
              kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,
              eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme,
              bu işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme, işlenmesine itiraz etme ve
              kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme haklarına sahiptir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Başvuru Usulü</h2>
            <p className="text-muted-foreground">
              Haklarınıza ilişkin taleplerinizi, kimliğinizi tevsik edici bilgilerle birlikte
              ubterzioglu@gmail.com adresine iletebilirsiniz. Talepleriniz, mevzuatta öngörülen süre
              içinde sonuçlandırılır.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Kvkk;
