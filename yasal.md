# CAL deposu için footer yasal metinleri derin araştırma raporu

## Yönetici özeti

`ubterzioglu/cal` deposunda footer hukuk seti teknik olarak mevcut, ancak mevcut metinler kapsam ve doğruluk bakımından eksik. Depoda merkezi footer bileşeni `src/components/layout/Footer.tsx` altında duruyor; footer’dan `İletişim`, `Gizlilik Politikası`, `KVKK Aydınlatma Metni`, `Çerez Politikası`, `Kullanım Şartları ve Sorumluluk Reddi` ve `Açık Rıza Metni` sayfalarına link veriliyor. Bu linklerin route tanımları `src/App.tsx` içinde bulunuyor. Mevcut hukuki metinler ise büyük ölçüde kısa, genel ve birbirleriyle tam uyumlu değil. Özellikle çerez/izleme tarafında depo kodu ile metinler arasında açık bir uyumsuzluk var: istemci başlangıcında Microsoft Clarity ve GoatCounter scriptleri doğrudan yükleniyor; buna karşılık KVKK metni Google Analytics’ten söz ediyor, çerez politikası ise kullanılan somut çerezleri, sağlayıcıları, süreleri ve rıza mekanizmasını listelemiyor. citeturn43view0turn11view0turn28view0turn15view1turn11view2

En kritik boşluklar şunlar: Clarity için rıza öncesi script yüklenmesi; açık rızanın tek cümlelik, “bundled” ve genel bir kabul şeklinde kurgulanması; üçüncü taraf hizmet envanterinin eksik/yanlış olması; saklama sürelerinin tablo bazlı verilmemesi; veri sahibi başvuru sürecinin operasyonel olarak tarif edilmemesi; açık rıza kayıtlarının ve çerez onay loglarının bulunmaması; ayrıca alumni profili akışında WhatsApp numarası, e‑posta ve sosyal bağlantılar gibi verilerin toplanıp API yanıtında “public” görünüm üzerinden döndürülmesinin ciddi görünürlük ve minimizasyon riski yaratmasıdır. KVKK aydınlatma yükümlülüğünde veri sorumlusu kimliği, amaç, aktarım, hukuki sebep ve haklar açık biçimde verilmelidir; çerez tarafında ise KVKK Çerez Rehberi, zorunlu olmayan çerezlerde açık rıza, eşit seviyede “kabul et/reddet/tercihler” yaklaşımı ve bundled rızadan kaçınmayı önerir. GDPR ve Planet49 kararı da önceden işaretli kutularla veya başka işlemlere iliştirilmiş rızayla geçerli onay alınamayacağını açık biçimde ortaya koyar. citeturn23view0turn42view0turn37view5turn37view6turn39view0turn36view1turn37view7

Depoda bugün itibarıyla ürün, sepet, ödeme veya checkout rotaları görünmüyor; yani mevcut proje esasen topluluk/haber/iletişim odaklı bir web uygulaması. Buna rağmen siz özellikle ürün, blog ve checkout türleri için de şablon istediğiniz için, bu rapor mevcut depo için “hemen zorunlu” belgeler ile ileride e‑ticaret açılırsa devreye alınacak “koşullu” belgeleri ayrı ayrı veriyor. Mesafeli satış kurulursa 6502, Mesafeli Sözleşmeler Yönetmeliği ve 6563 kapsamındaki ön bilgilendirme, satıcı bilgileri, cayma ve ticari ileti onayı katmanları ayrıca aktive edilmelidir. citeturn10view3turn11view0turn31search3turn36view5turn29search3turn32search11turn32search4

Pratik sonuç şudur: Bu depo için en doğru yaklaşım, footer hukuk setini “tek tek sayfalar” olarak bırakmak ama arkasında tek bir hukuk-konfigürasyon katmanı kurmak; tüm metinleri bir `legal.config` üzerinden üretmek; çerez tercih merkezini eklemek; analitik scriptlerini rızaya göre koşullamak; açık rızayı yalnızca gerçekten rıza gerektiren işleme senaryolarında, ayrı ve ispatlanabilir biçimde almak; metin sürümlerini ve kullanıcı onay kayıtlarını loglamaktır. Microsoft Clarity’nin kendi resmi dokümantasyonu da EEA/UK/CH ziyaretçileri için geçerli consent sinyalini ve `consentv2` entegrasyonunu gerekli kılar. citeturn40view1turn40view2turn39view0

## Depodaki footer ve hukuk envanteri

Depodaki mevcut footer ve buna bağlı hukuk sayfaları aşağıdaki gibidir. Bu tablo, yalnızca “footer dosyaları” değil, footer metinlerinin hukuken kapsaması gereken ama kodda ayrıca görünen ilgili dosyaları da içerir; çünkü gerçek uyum analizi yalnızca `Footer.tsx` ile sınırlı tutulursa, depo içindeki işleme faaliyetleri gözden kaçar. citeturn43view0turn11view0turn28view0turn13view3turn23view1turn23view0turn26view0turn26view1

| Dosya / yol | İşlev | Repo’daki durumu | Hukuki önemi |
|---|---|---|---|
| `src/components/layout/Footer.tsx` | Merkezi footer bileşeni | Footer linkleri ve kısa disclaimer burada tanımlı. “CAL Community” markası, hukuk linkleri, “gayriresmi topluluk” notu ve telif satırı burada yer alıyor. citeturn43view0 | Footer’ın ana hukuki giriş noktası budur; eksik belge linkleri burada görünür hale gelir. |
| `src/pages/GizlilikPolitikasi.tsx` | Gizlilik politikası sayfası | Yalnızca iki kısa paragraf içeriyor; veri satılmaması ve ücretsiz topluluk yapısı gibi genel ifadeler var. citeturn11view3 | Çevrim içi gizlilik bildirimi için yetersiz; işlem envanteri, aktarım, saklama ve hak yönetimi eksik. |
| `src/pages/Kvkk.tsx` | KVKK aydınlatma metni | Veri sorumlusu, bazı veri kategorileri, amaç, hukuki sebep, aktarım, saklama ve haklar kısmen listelenmiş. citeturn14view2turn15view1 | Türkiye odaklı çekirdek belge; ancak güncel teknik gerçeklikle tam örtüşmüyor. |
| `src/pages/CerezPolitikasi.tsx` | Çerez politikası | Tek paragraf düzeyinde; çerezleri deneyim, güvenlik ve analiz için kullandığını söylüyor. citeturn11view2 | Kullanılan çerezlerin türleri, süreleri, sağlayıcıları, rıza/reddet mekanizması ve tercih merkezi eksik. |
| `src/pages/KullanimSartlari.tsx` | Kullanım şartları ve sorumluluk reddi | Topluluk tanımı, kullanıcı içeriği, içerik kaldırma, üçüncü taraf hizmetler ve hesap silme gibi başlıklar var. citeturn14view3turn15view0 | İyi bir başlangıç ama bağlayıcılık, değişiklik bildirimi, lisans, şikâyet prosedürü ve yetkili hukuk mahkemesi belirsiz. |
| `src/pages/AcikRiza.tsx` | Açık rıza metni | Tek cümlelik genel kabul metni. citeturn14view4 | Geçerli açık rıza standardını karşılamıyor; belirli, ayrı, ispatlanabilir ve geri alınabilir rıza yapısı yok. |
| `src/pages/Contact.tsx` | İletişim sayfası | E‑posta, iki telefon, fiziksel adres, kişisel site ve LinkedIn yer alıyor. citeturn15view2 | Veri sorumlusu iletişim kanalı açısından önemli; ayrıca hukuki bildirim/başvuru kanalı olarak yapılandırılmalı. |
| `src/App.tsx` | Rotasyon / route tanımı | Yasal sayfaların rotaları `/gizlilik-politikasi`, `/cerez-politikasi`, `/kullanim-sartlari`, `/acik-riza`, `/kvkk`, `/contact`. citeturn11view0 | Hangi belgelerin fiilen yayınlandığını gösterir; blog/checkout rotası görünmediği için e‑ticaret belgeleri şu an koşullu. |
| `src/main.tsx` | İstemci başlangıcı | Microsoft Clarity script’i ve GoatCounter script’i doğrudan `document.head` içine ekleniyor. citeturn28view0 | Çerez/rıza ve üçüncü taraf analiz ifşası açısından kritik dosya. |
| `.env.example` | Ortam değişkenleri | `VITE_CLARITY_ID`, Supabase URL/anon key, service role key, `ALLOWED_ORIGINS`, `IP_HASH_SALT` tanımlı. citeturn13view3 | Analitik, veri tabanı, CORS ve IP hash mantığına ilişkin yasal/teknik işleme izini verir. |
| `api/_shared.js` | Sunucu yardımcıları | CORS, Supabase admin client, IP hash, rate limit kayıtları. citeturn22view0turn23view1 | İşlenen teknik verileri ve güvenlik tedbirlerini hukuki metinlerde doğru anlatmak için temel kaynak. |
| `api/alumni-profiles.js` | Mezun profili API’si | Ad soyad, mezuniyet yılı, WhatsApp, e‑posta, LinkedIn, Instagram, biyografi, destek konuları işliyor; `public_alumni_profiles` görünümünden alan döndürüyor. citeturn22view1turn23view0 | Toplanan veri kategorileri ve görünürlük riski yüksek; KVKK/Gizlilik metinlerinin bunları açıkça kapsaması gerekir. |
| `api/solidarity/topics.js` ve `api/solidarity/comments.js` | Dayanışma modülü API’leri | Kullanıcı başlık ve yorum metni işleniyor, rate limit uygulanıyor. citeturn26view0turn26view1 | Kullanıcı içeriği, moderasyon, kötüye kullanım ve loglama hükümleri için kapsanmalı. |
| `src/pages/AlumniCreate.tsx` | Mezun profili oluşturma arayüzü | Formda zorunlu alanlar: ad soyad, mezuniyet yılı, WhatsApp. Opsiyonel alanlar: e‑posta, LinkedIn, Instagram, kısa bilgi, destek konuları, anonimlik. Açık rıza checkbox’ı görünmüyor. citeturn42view0turn42view2turn42view3 | Form-altı aydınlatma ve gerekiyorsa ayrı rıza blokları burada zorunlu. |
| `src/pages/AlumniSolidarity.tsx` | Dayanışma topluluk akışı | Başlık ve yorum metinleri için textarea tabanlı kullanıcı girişi var. citeturn42view5 | Kullanıcı içeriği moderasyonu, hak ihlali bildirimi ve sorumluluk hükümleriyle eşleştirilmeli. |

İncelenen rotalar arasında ürün, sepet veya ödeme/checkout sayfaları görünmüyor; bu nedenle tüketici/e‑ticaret belgeleri bugünkü deploy için “hemen yayın zorunluluğu” değil, “özellik aktive edilirse devreye alınacak paket” olarak düşünülmelidir. Buna karşılık haber benzeri içerik için `/news` rotası bulunduğundan, blog/haber sayfalarına özel kısa editoryal disclaimer seti hazırlanmalıdır. citeturn10view3turn11view0

## Mevcut metinlerin analizi ve kapatılması gereken boşluklar

### Belge bazlı boşluk matrisi

Aşağıdaki matriste mevcut metinlerin neyi kapsadığı ve hangi boşlukların kapatılması gerektiği gösterilmektedir. Bu değerlendirme repo dosyaları ile Türk ve AB birincil/otoritatif kaynakların birlikte okunmasına dayanır. KVKK aydınlatma yükümlülüğü veri sorumlusu kimliği, amaç, aktarım, toplama yöntemi/hukuki sebep ve ilgili kişi haklarını zorunlu kılar; çerez rehberi ise özellikle zorunlu olmayan çerezlerde açık rıza, çerez paneli ve bundled rızadan kaçınma üzerinde durur. GDPR madde 7 ve Planet49 içtihadı da buna paralel bir standart getirir. citeturn37view5turn37view6turn34view1turn39view0turn36view1turn37view7

| Belge | Mevcut kapsam | Eksik / sorunlu alanlar | Sonuç |
|---|---|---|---|
| Gizlilik Politikası | Genel düzeyde veri güvenliği, minimal toplama, üçüncü tarafa satmama ve ücretsiz platform vurgusu var. citeturn11view3 | Veri sorumlusu kimliği, iletişim bilgisi, işleme amaçları, hukuki sebepler, veri kategorileri, saklama tablosu, uluslararası aktarım, üçüncü taraf sağlayıcı listesi, kullanıcı hakları, veri sahibi başvuru usulü, güncelleme tarihi, çocuk/öğrenci verisi bilgisi yok. citeturn11view3turn37view5turn37view6turn34view2 | Mevcut metin “özet beyan” seviyesinde kalıyor; yayıma uygun nihai politika değil. |
| KVKK Aydınlatma Metni | Veri sorumlusu gerçek kişi olarak verilmiş; bazı veri kategorileri, amaçlar, hukuki sebepler, aktarım, saklama ve haklar yazılmış. citeturn14view2turn15view1 | Kod-gerçeklik uyumsuzluğu var: metin Google Analytics derken istemci Clarity ve GoatCounter yüklüyor. Aktarım ülkeleri ve güvenceler, başvuru usulü/doğrulama, saklama matrisi, işleme yöntemi kanalları, log/çerez ayrımı eksik. citeturn15view1turn28view0turn40view0turn40view3 | Güncellenerek çekirdek aydınlatma metni yapılabilir; ama mutlaka teknik gerçekle hizalanmalı. |
| Çerez Politikası | Çerezlerin deneyim, güvenlik ve analiz için kullanıldığını ve tarayıcıdan kapatılabileceğini söylüyor. citeturn11view2 | Çerez envanteri, kategori, sağlayıcı, süre, amaç, hukuki sebep, rıza/reddet, tercih merkezi, geri çekme, üçüncü taraf çerezler, loglama ve banner davranışı yok. Clarity’nin çerezleri resmi dokümanlarda açıkça listelenmiş durumda. citeturn11view2turn40view0turn39view0turn37view7 | En acil revizyon ihtiyacı olan belge. |
| Kullanım Şartları | Topluluk tanımı, üyelik, kullanıcı içeriği sorumluluğu, içerik kaldırma, gayriresmilik, veri güvenliği, üçüncü taraf hizmetler ve hesap silme var. citeturn14view3turn15view0 | Kabul mekanizması, değişiklik bildirimi, hizmetin askıya alınması, fikri mülkiyet/lisans, şikâyet ve itiraz prosedürü, uygulanacak hukuk/yetki, içerik raporlama SLA’sı, yaş/ehliyet hususu ve spam/otomasyon yasakları eksik. citeturn14view3turn15view0 | Güçlü ama tamamlanmamış; bağlayıcılık için yeniden yapılandırılmalı. |
| Açık Rıza Metni | Kayıt olurken verilerin işlenmesi, saklanması ve aydınlatma metni doğrultusunda kullanılmasına açık rıza kabulü var. citeturn14view4 | Rıza çok genel; sözleşme/üyelik işleminden ayrı değil; amaç bazlı değil; geri alma ve ispat mekanizması yok. KVKK çerez rehberi bundled rızaya karşı uyarıyor; GDPR madde 7 ve Planet49 da açık, ayrıştırılmış ve affirmative action arıyor. citeturn14view4turn39view0turn36view1turn37view7 | Bu metin mevcut haliyle korunmamalı; yalnızca ihtiyaç duyulan işleme faaliyetleri için amaç-bazlı mini rıza metinlerine bölünmeli. |
| İletişim | Veri sorumlusuna ulaşılabilecek e‑posta, telefon, adres ve linkler mevcut. citeturn15view2 | Veri sahibi başvurusu için resmî kanal, cevap süresi, başvuruda kimlik doğrulama usulü, hukuki bildirim adresi, varsa ticari alanlar için MERSİS/VKN/TSNo gibi bilgiler yok. Mesafeli satışta bunlar zorunlu olabilir. citeturn15view2turn36view5 | “İletişim” sayfası ile “Hukuki Bildirim/İmpressum” ayrıştırılmalı. |

### Depo kodu ile metinler arasındaki kritik uyumsuzluklar

İncelenen istemci kodu, `VITE_CLARITY_ID` ile Microsoft Clarity scriptini ve ayrıca GoatCounter scriptini sayfa yüklenirken doğrudan `document.head` içine ekliyor. Buna karşın KVKK metni veri aktarımı için Google Analytics’ten söz ediyor; incelediğimiz istemci tarafı dosyalarda Google Analytics kurulumu görünmüyor. Bu, aydınlatma yükümlülüğü açısından “gerçek teknik işleme faaliyetinin doğru açıklanmaması” sorunu doğurur. citeturn28view0turn15view1turn16view0turn16view4

Clarity’nin resmi dokümantasyonu, tipik kullanımda zorunlu olmayan çerezler set ettiğini ve `_clck`, `_clsk`, `CLID`, `MUID` gibi birinci/üçüncü taraf cookie’ler kullandığını açıkça söylüyor. Aynı dokümantasyon, EEA/UK/CH ziyaretçileri için geçerli consent sinyalini ve `consentv2` entegrasyonunu öngörüyor. Bu nedenle Clarity scriptini rıza öncesi yükleyen mevcut `main.tsx` yaklaşımı, en azından muhafazakâr Türkiye/AB uyum kurgusunda savunulması güç bir tasarım. citeturn40view0turn40view1turn40view2turn28view0turn39view0turn37view7

GoatCounter tarafı daha nüanslıdır. Resmî GoatCounter dokümantasyonuna göre servis tarayıcıya cookie/localStorage yazmadan çalışabilir ve IP adresini veritabanında tutmaz; buna rağmen sayfa görüntüleme verisi işler ve hosted servis kullanımında veriler Finlandiya/Almanya’daki sunucularda tutulabilir. Bu nedenle GoatCounter, Clarity ile aynı risk seviyesinde değildir; ancak yine de politika metninde sağlayıcı, veri kategorisi, hukuki dayanak ve tercih mekanizması şeffaf biçimde yazılmalıdır. Türkiye/AB ortak zemininde en güvenli yol, GoatCounter’ı da analitik kategorisinde açıklamak ve ya meşru menfaat değerlendirmesi + opt‑out yapmak ya da rızaya bağlamaktır. citeturn40view3turn39view0turn34view3

Mezun profili akışında form; ad soyad, mezuniyet yılı, WhatsApp numarası, e‑posta, LinkedIn, Instagram, kısa biyografi ve destek konuları topluyor. Sunucu tarafında bu veriler `alumni_profiles` tablosuna yazılıyor; ardından `public_alumni_profiles` görünümünden `email` ve `whatsapp_number` dahil alanlar geri seçiliyor. Bu desen, görünürlük ve veri minimizasyonu bakımından ciddi bir hukuki risk işaretidir; çünkü “public” görünüm ve kamusal profile dönüşme ihtimali, özellikle telefon/e‑posta gibi iletişim verileri için ayrı, belirli ve gösterilebilir görünürlük iradesi gerektirir. Mevcut formda böyle bir katman açıkça görülemiyor. citeturn42view0turn42view2turn42view3turn22view1turn23view0

Benzer şekilde dayanışma modülü kullanıcıların başlık ve yorum metni girmesine izin veriyor ve yalnızca teknik rate‑limit ile korunuyor. Bu, kullanım şartlarında hakaret, kişisel veri ifşası, telif ihlali, şikâyet/notice‑and‑takedown ve moderasyon kayıt süreci hükümlerinin çok daha net yazılmasını gerektirir. citeturn26view0turn26view1turn14view3turn15view0

## Gerekli belge paketi ve Türkçe şablonlar

### Hangi belgeler hemen gerekli, hangileri koşullu

Mevcut depo yapısı için aşağıdaki belge seti önerilir. “Hemen gerekli” sütunu, bugünkü repo işlevleri bakımından; “koşullu” sütunu ise ürün/ödeme/abonelik/e‑ticaret açılması durumunda devreye alınacak metinleri gösterir. Türkiye odaklı aydınlatma yükümlülüğü ve veri sahibi hakları bakımından KVKK; çerezler bakımından KVKK Çerez Rehberi ve AB cookie-consent çizgisi; satış kurulursa da 6502, Mesafeli Sözleşmeler Yönetmeliği ve 6563 temel dayanaklardır. citeturn37view5turn37view6turn39view0turn31search3turn36view5turn29search3turn32search4

| Belge | Bugünkü repo için | İleride ürün/checkout için | Asgari alanlar |
|---|---|---|---|
| Gizlilik Politikası | Gerekli | Gerekli | İşlenen tüm çevrim içi veriler, sağlayıcılar, güvenlik, saklama, haklar, iletişim |
| KVKK Aydınlatma Metni | Gerekli | Gerekli | Veri sorumlusu, amaç, aktarım, yöntem/hukuki sebep, haklar, başvuru usulü |
| Çerez Politikası | Gerekli | Gerekli | Çerez tablosu, sağlayıcı, süre, kategori, hukuki dayanak, tercih merkezi |
| Çerez Tercih Merkezi Metni | Gerekli | Gerekli | Zorunlu/analitik/pazarlama ayrımı, kabul/reddet/tercih yönetimi, geri alma |
| Kullanım Şartları | Gerekli | Gerekli | Kabul, yasak kullanımlar, IP/lisans, moderasyon, fesih, değişiklik, sorumluluk |
| İletişim ve Hukuki Bildirim | Gerekli | Gerekli | Veri sorumlusu/işletmeci kimliği, başvuru kanalları, varsa şirket bilgileri |
| Açık Rıza Metinleri | Yalnızca gerçekten gerekiyorsa | Yalnızca gerçekten gerekiyorsa | Amaç-bazlı, ayrı, geri alınabilir, ispatlanabilir rıza |
| Ticari Elektronik İleti Onayı | Şu an opsiyonel | Pazarlama başlarsa gerekli | Marka/işletmeci bilgisi, kanal, amaç, geri alma, İYS/6563 uyumu |
| Ön Bilgilendirme Metni | Şu an gerekli değil | Checkout’ta gerekli | Satıcı adı/unvanı, MERSİS/VKN, fiyat, teslim/ifa, cayma, iletişim |
| Mesafeli Satış Sözleşmesi | Şu an gerekli değil | Checkout’ta gerekli | Taraflar, konu, bedel, ifa, teslim, cayma, uyuşmazlık |
| İptal‑İade‑Cayma Politikası | Şu an gerekli değil | Checkout’ta gerekli | Cayma süresi, istisnalar, prosedür, masraflar, iade yöntemi |

### Ana footer mimarisi için örnek metin

Aşağıdaki footer iskeleti, bu repo için en pratik ve hukuken savunulabilir başlangıç modelidir. Gerçek kişi veri sorumlusu kurgusuna göre yazılmıştır; işletmeci şirketleşirse aşağıdaki placeholder’larda kişi yerine şirket alanları doldurulmalıdır.

```text
[MARKA_ADI], [ISLETMECI_TURU] tarafından işletilen bağımsız bir topluluk platformudur.
Veri işlemesine ilişkin ayrıntılar için Gizlilik Politikası, KVKK Aydınlatma Metni ve Çerez Politikası’nı inceleyiniz.
Çerez tercihlerinizi dilediğiniz zaman güncelleyebilirsiniz.
Hukuki bildirimler ve veri sahibi başvuruları için: [HUKUKI_EPOSTA]
Son güncelleme: [YYYY-AA-GG] • Sürüm: [vX.Y]
© [YIL] [MARKA_ADI]. Tüm hakları saklıdır.
```

Bu gövde, mevcut footer’daki “gayriresmidir” ifadesini koruyabilir; ancak bunu daha teknik ve daha az muğlak hale getirmek gerekir. Eğer okul veya başka bir kurumla resmî bağ yoksa şu kısa satır eklenebilir:

```text
Bu platform, [KURUM_ADI] tarafından resmî olarak işletilmemekte veya temsil edilmemektedir.
```

Mevcut footer’daki “öğrenci isimleri yalnızca baş harflerle verilir” cümlesi tek başına bir yasal politika değil, uygulama notudur. Bu ifade ancak gerçekten sistematik olarak uygulanıyorsa kalmalıdır; ayrıca ilgili görünürlük kuralı, gizlilik politikasında “profil görünürlük ayarları” başlığı altında daha açık şekilde yazılmalıdır. Repo şu an bu iddiayı footer’da taşıyor, fakat görünürlük mantığının tüm veri kategorileri için nasıl işlendiği hukuk metinlerinde detaylandırılmamış durumda. citeturn43view0turn23view0

### Çekirdek belge şablonları

Aşağıdaki şablonlar, doğrudan React/HTML içine aktarılabilecek kadar somut; ama değişken alanlar placeholder olarak bırakılmıştır.

#### Gizlilik Politikası şablonu

```text
GİZLİLİK POLİTİKASI

Yürürlük Tarihi: [YYYY-AA-GG]
Sürüm: [vX.Y]

Bu Gizlilik Politikası, [MARKA_ADI] internet sitesi ve ilişkili dijital hizmetler kapsamında hangi kişisel verilerin hangi kapsamda işlendiğini açıklamaktadır.

Veri sorumlusu / işletmeci
[VERI_SORUMLUSU_ADI_UNVANI]
[ADRES]
[E-POSTA]
[TELEFON]
[KEP veya hukuki bildirim adresi, varsa]

İşlenen veri kategorileri
- Kimlik ve profil verileri: [ör. ad soyad, mezuniyet yılı, kullanıcı adı]
- İletişim verileri: [ör. e-posta, telefon, WhatsApp]
- Hesap ve üyelik verileri: [ör. giriş kayıtları, üyelik durumu]
- Kullanıcı içeriği: [ör. profil metni, yorum, dayanışma başlığı]
- Teknik veriler: [ör. IP hash, zaman damgası, tarayıcı bilgisi, hata ve güvenlik logları]
- Analitik veriler: [ör. sayfa görüntüleme, oturum olayları, çerez/benzeri izleme verileri]

İşleme amaçları
Kişisel verileriniz; hesabın oluşturulması ve yönetimi, topluluk etkileşiminin yürütülmesi, kullanıcı destek taleplerinin cevaplanması, güvenlik ve kötüye kullanımın önlenmesi, hizmet performansının ölçülmesi, hukuki yükümlülüklerin yerine getirilmesi ve uyuşmazlıkların yönetimi amaçlarıyla işlenir.

Hukuki dayanaklar
Veriler, ilgili mevzuata göre sözleşmenin kurulması veya ifası, veri sorumlusunun meşru menfaati, hukuki yükümlülüklerin yerine getirilmesi ve yalnızca gerektiği hallerde açık rıza hukuki sebeplerine dayanılarak işlenir.

Üçüncü taraf hizmet sağlayıcılar
Hizmet kapsamında aşağıdaki sağlayıcılar kullanılabilir:
- Barındırma / dağıtım: [VERCEL veya sağlayıcı]
- Veritabanı / backend: [SUPABASE veya sağlayıcı]
- Kod yönetimi / operasyon: [GITHUB veya sağlayıcı]
- Analitik: [MICROSOFT CLARITY], [GOATCOUNTER], [varsa diğerleri]
Her sağlayıcı yalnızca ilgili hizmetin gerektirdiği ölçüde veri işleyebilir.

Uluslararası veri aktarımı
Kişisel veriler, kullanılan hizmet sağlayıcıların altyapısına bağlı olarak Türkiye dışında veya Avrupa Ekonomik Alanı dışında bulunan ülkelere aktarılabilir. Uygulanabildiği ölçüde sözleşmesel ve teknik güvenlik önlemleri alınır. Güncel sağlayıcı listesi ve aktarım çerçevesi [PROVIDER_LIST_URL] adresinde yayımlanır.

Saklama süreleri
Kişisel veriler, işleme amacı için gerekli süre boyunca ve mevzuattan doğan saklama yükümlülükleri süresince tutulur. Ayrıntılı saklama tablosu bu Politika’nın eki veya bağlantılı sayfasında yayımlanır.

Haklarınız
İlgili kişi olarak [uygulanabildiği ölçüde KVKK / GDPR] kapsamındaki erişim, düzeltme, silme, kısıtlama, itiraz, veri taşınabilirliği ve zarar giderimi taleplerinizi [BASVURU_EPOSTASI] üzerinden iletebilirsiniz.

Çocuklar ve öğrenciler
Hizmetin öğrenci kullanıcılar tarafından kullanılabildiği hallerde, yaşa uygun bilgilendirme ve görünürlük kontrolleri uygulanır. Reşit olmayan kullanıcıların belirli alanlara erişimi ve görünürlük tercihleri ilave güvenlik kurallarına tabi tutulabilir.

Güvenlik
Kişisel verilerin korunması için erişim kontrolü, loglama, rate-limit, kimlik doğrulama, şifreleme/pseudonimleştirme ve ihtiyaç bazlı yetkilendirme gibi teknik ve idari tedbirler uygulanır.

Değişiklikler
Bu politika güncellenebilir. Esaslı değişikliklerde yeni sürüm tarihi ve gerekiyorsa kullanıcıya bildirim gösterilir.
```

#### KVKK Aydınlatma Metni şablonu

Bu belge, Türkiye hedefli ana aydınlatma metni olmalıdır. Tebliğ ve Kurum açıklamalarına uygun olarak veri sorumlusu kimliği, amaç, aktarım, toplama yöntemi/hukuki sebep ve 11. madde hakları ayrı başlıklarda verilmelidir. citeturn34view1turn37view5turn37view6

```text
KVKK AYDINLATMA METNİ

Veri Sorumlusu
6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla [VERI_SORUMLUSU_ADI_UNVANI] tarafından işlenmektedir.

İşlenen Kişisel Veriler
[VERI_KATEGORILERI_LISTESI]

Kişisel Verilerin İşlenme Amaçları
[AMACLAR_LISTESI]

Kişisel Verilerin Aktarılabileceği Taraflar ve Amaç
Kişisel verileriniz; teknik altyapı, barındırma, veritabanı, güvenlik, analiz, destek ve mevzuattan doğan yükümlülükler kapsamında [ALICI_GRUPLARI] ile sınırlı ve ölçülü biçimde paylaşılabilir.

Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi
Kişisel verileriniz; üyelik formları, iletişim formları, çerezler, sunucu logları, API talepleri, kullanıcı içerikleri ve benzeri elektronik ortamlar üzerinden toplanmakta; [HUKUKI_SEBEP_LISTESI] hukuki sebeplerine dayanılarak işlenmektedir.

İlgili Kişi Olarak Haklarınız
KVKK’nın 11. maddesi kapsamında;
- kişisel verilerinizin işlenip işlenmediğini öğrenme,
- işlenmişse buna ilişkin bilgi talep etme,
- işlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme,
- aktarıldığı üçüncü kişileri bilme,
- eksik/yanlış işlenmişse düzeltilmesini isteme,
- silinmesini veya yok edilmesini isteme,
- bu işlemlerin üçüncü kişilere bildirilmesini isteme,
- otomatik sistem analizine itiraz etme,
- kanuna aykırı işlem nedeniyle zararın giderilmesini talep etme
haklarına sahipsiniz.

Başvuru Usulü
Haklarınıza ilişkin taleplerinizi [BASVURU_EPOSTASI] adresine [kimlik doğrulama yöntemi] ile iletebilirsiniz. Talepler, mevzuatta öngörülen süre içinde sonuçlandırılır.
```

#### Çerez Politikası ve tercih merkezi şablonu

KVKK Çerez Rehberi, özellikle zorunlu olmayan çerezlerde açık rıza, “kabul et/reddet/tercihler” dengesini ve bundled rızadan kaçınmayı vurgular. Ayrıca iyi uygulama olarak panelde butonların eşit görünürlüğe sahip olmasını önerir. Clarity’nin resmî cookie dokümantasyonu da hangi cookie’lerin set edildiğini belirtir. citeturn39view0turn40view0turn40view1turn40view2

```text
ÇEREZ POLİTİKASI

Yürürlük Tarihi: [YYYY-AA-GG]
Sürüm: [vX.Y]

Bu politika, [MARKA_ADI] üzerinde kullanılan çerezleri ve benzeri teknolojileri açıklar.

Çerez nedir?
Çerezler, ziyaret ettiğiniz internet sitesi tarafından tarayıcınıza yerleştirilen küçük veri dosyalarıdır. Bazı teknolojiler çerez kullanılmaksızın benzer ölçüm işlevleri görebilir.

Kullandığımız kategoriler
- Zorunlu çerezler / zorunlu teknolojiler
- Analitik / performans çerezleri
- İşlevsel çerezler
- Pazarlama / reklam çerezleri [varsa]

Çerez tablosu
[SAYFADA TABLO OLARAK YER ALMALI]
Alanlar:
Sağlayıcı | Çerez/Teknoloji Adı | Kategori | Amaç | Süre | Birinci/Üçüncü Taraf | Hukuki Dayanak

Tercih yönetimi
Zorunlu olmayan çerezler ve benzeri izleme teknolojileri, yalnızca tercihlerinize göre aktive edilir. Ayarlarınızı “Çerez Tercihleri” bağlantısından dilediğiniz zaman güncelleyebilirsiniz.

Tarayıcı ayarları
Tarayıcı ayarlarınız üzerinden çerezleri silebilir veya engelleyebilirsiniz. Ancak zorunlu teknik unsurlar devre dışı bırakılırsa bazı hizmetler çalışmayabilir.

Üçüncü taraflar
[CLARITY], [GOATCOUNTER], [varsa diğerleri] gibi üçüncü taraf hizmetler kendi sistemleri üzerinden veri işleyebilir. Bu sağlayıcılar hakkında güncel bilgi [PROVIDER_LIST_URL] adresinde yer alır.

Açık rızanın geri alınması
Daha önce verdiğiniz izinleri, tercih merkezinizden her zaman geri alabilirsiniz. Geri alma işlemi geleceğe etkili sonuç doğurur.
```

#### Kullanım Şartları şablonu

```text
KULLANIM ŞARTLARI

Kapsam
Bu şartlar, [MARKA_ADI] internet sitesi ve ilgili dijital hizmetlerin kullanımına uygulanır.

Hizmetin niteliği
Platform, [TOPLULUK_TANIMI] amacıyla sunulur. Platformun [KURUM_ADI] ile resmî temsil/bağ ilişkisi yoktur. [Varsa açıklama]

Üyelik ve erişim
Kullanıcı, kayıt sırasında sunduğu bilgilerin doğru ve güncel olduğunu kabul eder.
[YAŞ/UYGUNLUK_KOSULU]
Veri sorumlusu/işletmeci, hesabı doğrulama, askıya alma veya kapatma hakkını saklı tutar.

Kullanıcı içeriği
Kullanıcı; yüklediği metin, yorum, bağlantı ve diğer içeriklerden bizzat sorumludur.
Kullanıcı, hukuka aykırı, hakaret içeren, kişisel veri ifşa eden, telif ihlaline yol açan veya topluluk kurallarına aykırı içerik paylaşmayacağını kabul eder.

Moderasyon ve kaldırma
İşletmeci, hukuka aykırı veya hizmet güvenliğini tehlikeye atan içerikleri önceden bildirim yapmaksızın kaldırabilir; uygun durumlarda gerekçe ve itiraz kanalı sunar.

Fikri mülkiyet
Platform kodu, tasarımı, marka unsurları ve işletmeci içeriği üzerindeki tüm haklar [HAK_SAHIBI]’ne aittir. Kullanıcı içerikleri bakımından platforma yalnızca hizmetin işletimi için gerekli sınırlı kullanım lisansı verilir.

Üçüncü taraf hizmetler
Platform; [SUPABASE], [VERCEL], [GITHUB], [CLARITY], [GOATCOUNTER] ve benzeri sağlayıcılardan yararlanabilir. Bu hizmetlerin kendi şart ve politikaları ayrıca uygulanabilir.

Sorumluluğun sınırı
Hizmet “olduğu gibi” sunulur. İşletmeci, hukuken zorunlu olan haller dışında, kesinti, veri kaybı, kullanıcı içeriği ve üçüncü taraf hizmetlerden kaynaklanan dolaylı zararlardan sorumlu tutulamaz.

Değişiklikler
Şartlar güncellenebilir. Esaslı değişiklikler yeni sürüm tarihi ile yayımlanır ve gerekli hâllerde kullanıcıya bildirilir.

Uygulanacak hukuk ve yetki
Bu şartlar [HUKUK_SECIMI] hukukuna tabidir. Yetkili merci [YETKILI_MERCI]’dir.
```

#### Hukuki bildirim ve iletişim şablonu

```text
HUKUKİ BİLDİRİM VE İLETİŞİM

İşletmeci / Veri Sorumlusu
[AD / UNVAN]
[ADRES]
[E-POSTA]
[TELEFON]
[KEP]
[MERSIS / VKN / TİCARET SİCİLİ / ŞİRKET MERKEZİ - varsa]
[Meslek/oda bilgisi - gerekirse]

Veri Sahibi Başvuruları
KVKK/GDPR kapsamındaki taleplerinizi [BASVURU_EPOSTASI] üzerinden iletebilirsiniz.

İçerik Şikâyetleri ve İhlal Bildirimi
Hak ihlali, kişisel veri ifşası, telif ihlali veya hukuka aykırı içerik bildirimleri için: [NOTICE_EMAIL]

Destek
Genel destek talepleri için: [DESTEK_EPOSTASI]
Hedef yanıt süresi: [örn. 7 iş günü]
```

#### Açık rıza şablonları

Açık rıza yalnızca gerçekten “rıza gerektiren” işleme faaliyetlerinde kullanılmalıdır; sözleşme/üyelik için zorunlu veri işleme ile pazarlama/isteğe bağlı görünürlük/fotoğraf kullanımı gibi alanlar ayrılmalıdır. KVKK rehberi ve GDPR çizgisi, bundled rızayı reddeder. citeturn39view0turn36view1turn37view7

**Opsiyonel profil görünürlüğü rızası**
```text
[ ] Profilimde yer alan [e-posta / telefon / sosyal medya bağlantıları / kısa biyografi] bilgilerinin diğer kullanıcılar tarafından görüntülenmesine özgür irademle izin veriyorum. Bu izni dilediğim zaman hesap ayarlarımdan veya [DESTEK_EPOSTASI] üzerinden geri alabileceğimi biliyorum.
```

**Analitik/izleme rızası**
```text
[ ] Site kullanımının ölçülmesi amacıyla analitik çerezler ve benzeri teknolojilerin kullanılmasına izin veriyorum. Tercihimi dilediğim zaman “Çerez Tercihleri” alanından değiştirebileceğimi biliyorum.
```

**Ticari ileti rızası**
```text
[ ] [MARKA_ADI] tarafından [e-posta / SMS / WhatsApp] kanallarıyla kampanya, duyuru ve tanıtım içerikleri gönderilmesine onay veriyorum. Bu onayı istediğim an geri alabilirim.
```

### Sayfa türlerine göre kısa footer metinleri

Repo şu an ürün ve checkout içermese de, aşağıdaki kısa metinler ileriye dönük kullanılabilir.

#### Anasayfa için

```text
[MARKA_ADI] bağımsız bir topluluk platformudur. Kişisel verilerinizin işlenmesine ilişkin ayrıntılar için Gizlilik Politikası, KVKK Aydınlatma Metni ve Çerez Politikası bağlantılarını inceleyiniz.
```

#### Ürün sayfası için

```text
Bu sayfadaki ürün/hizmet bilgileri, fiyat ve stok/erişilebilirlik durumu sipariş anındaki kayıtlarla birlikte değerlendirilir. Satıcı bilgileri, cayma ve teslimat koşulları için Ön Bilgilendirme ve Mesafeli Satış Sözleşmesi bağlantılarını inceleyiniz.
```

#### Blog / haber sayfası için

```text
Bu sayfadaki içerik bilgilendirme amaçlıdır; hukuki, mali veya mesleki tavsiye niteliği taşımaz. Kaynak gösterilmeden kopyalanamaz; içerik ihlal bildirimleri [NOTICE_EMAIL] adresine iletilebilir.
```

#### İletişim sayfası için

```text
Bu sayfa üzerinden iletilen bilgiler yalnızca talebinizin cevaplanması amacıyla işlenir. İletişim verilerinizin nasıl işlendiğini öğrenmek için İletişim Formu Aydınlatma Metni’ni inceleyiniz.
```

#### Checkout için

```text
Siparişi tamamlayarak ödeme yükümlülüğü altına girdiğinizi kabul edersiniz. Sipariş öncesi Ön Bilgilendirme, Mesafeli Satış Sözleşmesi, Cayma/İade Politikası ve Çerez Tercihleri bağlantılarını inceleyiniz.
```

### Checkout ve e‑ticaret için koşullu belge şablonları

Mesafeli Sözleşmeler Yönetmeliği madde 5, tüketicinin sözleşme kurulmadan önce mal/hizmetin temel nitelikleri, satıcı/sağlayıcı ve aracı hizmet sağlayıcı adı/unvanı ile MERSİS veya VKN gibi bilgileri içeren ön bilgilendirmeyi almasını zorunlu kılar; ayrıca internet yoluyla kurulumda ödeme yükümlülüğü doğmadan hemen önce belirli bilgilerin açıkça birlikte gösterilmesini ister. 6502 de tüketicinin ekonomik çıkarlarının korunmasını esas alır. citeturn36view5turn38view1turn31search3

**Ön bilgilendirme kısa omurgası**
```text
- Mal/hizmetin temel nitelikleri
- Satıcı/sağlayıcı unvanı
- MERSİS no veya VKN
- Açık adres, telefon, e-posta
- Vergiler dahil toplam fiyat
- Teslim/ifa masrafı ve yöntemi
- Ödeme araçları
- Cayma hakkı, süresi, kullanım prosedürü
- Uyuşmazlıkta başvuru yolları
```

**Checkout kutucukları**
```text
[ ] Ön Bilgilendirme Metni’ni okudum.
[ ] Mesafeli Satış Sözleşmesi’ni kabul ediyorum.
[ ] Dijital içeriğin ifasına hemen başlanmasını istiyorum ve bu nedenle cayma hakkımın etkilerini anladım. [yalnızca gerekirse]
```

## Teknik uygulama rehberi

### Önerilen mimari

Bugünkü yapıda hukuki metinler ayrı React sayfalarında tutuluyor; bu yaklaşım korunabilir. Ancak içeriklerin dağınık JSX paragrafları olarak saklanması, sürüm yönetimi, çok dil ve hukuki tutarlılık açısından zayıf bir yöntemdir. Bunun yerine merkezi bir hukuk konfigürasyonu kurulmalıdır: `src/legal/legal.config.ts`, `src/legal/documents/*.mdx` veya `*.json`, `src/components/legal/CookieBanner.tsx`, `src/components/legal/CookiePreferencesModal.tsx`, `src/components/layout/LegalFooter.tsx`. Bu sayede footer linkleri, son güncelleme tarihleri, sürüm numaraları, veri sorumlusu bilgileri ve üçüncü taraf hizmet listesi tek kaynaktan beslenir. Mevcut repo zaten React Router ile ayrı sayfa mantığını kullandığı için mimari dönüşüm düşük maliyetlidir. citeturn43view0turn11view0turn10view3

Ayrıca üçüncü taraf sağlayıcı kayıt defteri ayrı bir yapı olarak tutulmalıdır. Çünkü repo kodu Clarity, GoatCounter ve Supabase’i gösterirken metinlerde Google Analytics ve genel “Google” atıfları bulunuyor. Bu tür hataları engellemek için hukuk metnindeki sağlayıcı listesi ile kodda saptanan sağlayıcı işaretleri CI seviyesinde eşleştirilmelidir. `main.tsx`, `.env.example`, `package.json` ve kullanım şartları/KVKK sayfaları birlikte okunduğunda bu ihtiyacın somut olduğu görülüyor. citeturn28view0turn13view3turn16view0turn16view4turn15view1turn15view0

### React için önerilen hukuk konfigürasyonu

```ts
// src/legal/legal.config.ts
export const legalConfig = {
  brandName: "CAL Community",
  controller: {
    type: "real_person", // or "company"
    name: "Umut Barış Terzioğlu",
    address: "Gutenbergstrasse 28, 44139 Dortmund, Almanya",
    email: "ubterzioglu@gmail.com",
    phone: "+49 173 956 94 29",
    legalEmail: "privacy@calcommunity.example",
  },
  documents: {
    privacy: { version: "v2.0", effectiveDate: "2026-07-01", path: "/gizlilik-politikasi" },
    kvkk: { version: "v2.0", effectiveDate: "2026-07-01", path: "/kvkk" },
    cookies: { version: "v2.0", effectiveDate: "2026-07-01", path: "/cerez-politikasi" },
    terms: { version: "v2.0", effectiveDate: "2026-07-01", path: "/kullanim-sartlari" },
    legalNotice: { version: "v1.0", effectiveDate: "2026-07-01", path: "/hukuki-bildirim" },
  },
  processors: [
    { name: "Supabase", role: "database/backend" },
    { name: "Microsoft Clarity", role: "analytics" },
    { name: "GoatCounter", role: "analytics" },
    { name: "GitHub", role: "code hosting / operations" },
    { name: "Vercel", role: "hosting/deployment" },
  ],
};
```

### Footer entegrasyonu

```tsx
// src/components/layout/LegalFooter.tsx
import { Link } from "react-router-dom";
import { legalConfig } from "@/legal/legal.config";

export function LegalFooter() {
  const docs = legalConfig.documents;

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="container py-12 text-center text-xs space-y-4">
        <p className="text-white/80">
          {legalConfig.brandName} bağımsız bir topluluk platformudur.
          Kişisel verilerinizin işlenmesine ilişkin ayrıntılar için aşağıdaki bağlantıları inceleyiniz.
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <Link to="/contact">İletişim</Link>
          <span>|</span>
          <Link to={docs.privacy.path}>Gizlilik Politikası</Link>
          <span>|</span>
          <Link to={docs.kvkk.path}>KVKK Aydınlatma Metni</Link>
          <span>|</span>
          <Link to={docs.cookies.path}>Çerez Politikası</Link>
          <span>|</span>
          <Link to={docs.terms.path}>Kullanım Şartları</Link>
          <span>|</span>
          <Link to="/cerez-tercihleri">Çerez Tercihleri</Link>
        </nav>

        <p className="text-white/60">
          Son güncelleme: {docs.privacy.effectiveDate} •
          Gizlilik {docs.privacy.version} •
          KVKK {docs.kvkk.version}
        </p>
      </div>
    </footer>
  );
}
```

### Çerez banner’ı ve analitik scriptlerinin rıza ile yüklenmesi

Mevcut `main.tsx` Clarity ve GoatCounter’ı koşulsuz enjekte ediyor. Clarity için bu kalıbın değiştirilmesi gerekir; Microsoft’un kendi dökümantasyonu Clarity Consent Mode ve `consentv2` yaklaşımını öneriyor. GoatCounter için iki yol vardır: ya “analitik” kategorisine koyup rıza ile yüklemek ya da ayrı bir meşru menfaat değerlendirmesi yapıp buna göre cookieless, sınırlı ölçüm kullanmak. En düşük riskli çözüm, ikisini de banner sonrasında kategorik olarak yönetmektir. citeturn28view0turn40view0turn40view1turn40view2turn40view3

```ts
// src/legal/consent.ts
export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  policyVersion: string;
};

const KEY = "cal_cookie_consent";

export function getConsent(): ConsentState | null {
  const raw = window.localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) as ConsentState : null;
}

export function saveConsent(consent: ConsentState) {
  window.localStorage.setItem(KEY, JSON.stringify(consent));
}
```

```tsx
// src/legal/loaders.ts
declare global {
  interface Window {
    clarity?: (...args: any[]) => void;
  }
}

export function loadClarity(clarityId: string) {
  if (document.querySelector(`script[data-clarity="true"]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${clarityId}`;
  script.dataset.clarity = "true";
  document.head.appendChild(script);
}

export function updateClarityConsent(granted: boolean) {
  if (typeof window.clarity === "function") {
    window.clarity("consentv2", {
      ad_Storage: granted ? "denied" : "denied",
      analytics_Storage: granted ? "granted" : "denied",
    });
  }
}

export function loadGoatCounter() {
  if (document.querySelector(`script[data-goatcounter="true"]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://gc.zgo.at/count.js";
  script.dataset.goatcounter = "https://calcommunity.goatcounter.com/count";
  script.dataset.goatcounter = "https://calcommunity.goatcounter.com/count";
  script.setAttribute("data-goatcounter", "true");
  document.head.appendChild(script);
}
```

```tsx
// örnek banner davranışı
function onAcceptAnalytics() {
  const consent = {
    necessary: true,
    analytics: true,
    marketing: false,
    timestamp: new Date().toISOString(),
    policyVersion: "cookies-v2.0",
  } as const;

  saveConsent(consent);
  loadClarity(import.meta.env.VITE_CLARITY_ID);
  updateClarityConsent(true);
  loadGoatCounter();

  // ayrıca backend consent log endpoint'ine POST ediniz
}

function onRejectAll() {
  saveConsent({
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: new Date().toISOString(),
    policyVersion: "cookies-v2.0",
  });

  updateClarityConsent(false);
}
```

### Consent log ve sürüm ispatı

GDPR madde 7, rızaya dayanılıyorsa veri sorumlusunun rızayı gösterebilmesini ister. KVKK silme/yok etme yönetmeliği de yapılan işlemlerin kayıt altına alınmasını ve bu kayıtların en az üç yıl saklanmasını öngörür. Bu nedenle yalnızca ön yüzde `localStorage`’a tercih yazmak yeterli değildir; sunucu tarafında da sürüm, zaman, kategori ve kanıt mantığı kurulmalıdır. citeturn36view1turn34view2

Önerilen tablo:

```sql
create table consent_events (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid null,
  pseudonymous_id text not null,
  locale text not null,
  policy_version text not null,
  consent_scope jsonb not null,
  source_page text not null,
  ip_hash text null,
  user_agent_hash text null,
  created_at timestamptz not null default now()
);
```

### Çok dil desteği

Kullanıcı özellikle Türkçe rapor istediği için önerilen sistemin “ana dil”i Türkçe olmalıdır. Eğer İngilizce sürüm yayınlanacaksa, hukuki olarak bağlayıcı metin Türkçe; İngilizce sürüm kolaylık çevirisi olarak işaretlenmelidir. Aynı sürüm numarası altında her iki dilin de içerik paritesi sürüm kontrolüyle test edilmelidir. KVKK aydınlatma gibi belgelerde çeviri uyuşmazlığı ciddi risk yaratır; bu nedenle MDX/JSON kaynaklarında aynı placeholder seti kullanılmalıdır. Bu gereklilik, özellikle aydınlatma yükümlülüğünün açık ve anlaşılır şekilde yerine getirilmesi ilkesiyle uyumludur. citeturn34view1turn37view5

### Otomatik güncelleme ve CI kontrolleri

Repo özelinde en faydalı otomasyon, “teknik sağlayıcı envanteri ile hukuk metinleri senkron mu?” kontrolüdür. Çünkü bugünkü metinler Google Analytics derken kod Clarity ve GoatCounter kullanıyor. Basit bir CI adımı, kaynak kodda şu pattern’leri tarayabilir: `clarity.ms`, `goatcounter`, `supabase`, `vercel`, `github`, `wa.me`, `linkedin.com`. Çıkan liste, `legal.config.processors` ile karşılaştırılır; fark varsa build fail edilir. Bu, aydınlatma metninin birkaç ay içinde tekrar bayatlamasını önler. citeturn28view0turn15view1turn15view0turn13view3

## Güvenlik ve gizlilik risk değerlendirmesi

Aşağıdaki risk tablosu doğrudan depodaki gözlenen davranışlara göre hazırlanmıştır.

| Risk | Seviye | Gözlem | Neden problem | Azaltım |
|---|---|---|---|---|
| Clarity’nin rıza öncesi yüklenmesi | Yüksek | `main.tsx` Clarity scriptini doğrudan yüklüyor. Clarity, tipik kullanımda zorunlu olmayan cookie’ler set ettiğini söylüyor. citeturn28view0turn40view0turn40view2 | Çerez ve onay rejimi bakımından savunması zayıf; KVKK rehberi ve Planet49 çizgisi ile çatışabilir. citeturn39view0turn37view7 | Script’i banner sonrası yükleyin; `consentv2` kullanın; reject all butonu accept ile eşit görünür olsun. |
| Yanlış/eksik üçüncü taraf ifşası | Yüksek | KVKK metninde Google Analytics geçiyor; istemci Clarity ve GoatCounter kullanıyor. citeturn15view1turn28view0 | Aydınlatma yükümlülüğü gerçeğe uygun olmazsa hukuki metin işlevsizleşir. citeturn37view5 | Sağlayıcı envanterini koddan türetin; hukuk metinlerini otomatik sürümleyin. |
| Profil verilerinin kamusal görünürlüğü | Yüksek | Alumni akışı WhatsApp/e‑posta/sosyal link topluyor; API “public” görünümden bu alanları seçiyor. citeturn42view0turn22view1turn23view0 | Telefon ve e‑posta gibi iletişim verileri için görünürlük minimizasyonu ve ayrı irade gerekir. | Varsayılan görünürlük kapalı olsun; alan bazlı ayrı opt‑in verin; telefon/e‑postayı maskeyle gösterin; erişimi üyelik duvarı arkasına alın. |
| Genel ve bundled açık rıza | Yüksek | `AcikRiza.tsx` tek cümlelik genel kabul metni sunuyor. citeturn14view4 | Rıza “belirli, ayrıştırılmış, anlaşılır, geri alınabilir” değil. citeturn36view1turn37view7turn39view0 | Açık rızayı amaç bazlı checkbox’lara bölün; üyeliğe bağlamayın; loglayın. |
| Saklama süresinin belirsizliği | Orta-Yüksek | KVKK metninde yalnızca hesap aktif olduğu sürece ve hukuki yükümlülükler boyunca deniyor. citeturn15view1 | Saklama matrisi ve imha prosedürü olmadan veri yaşam döngüsü belirsiz kalır. citeturn34view2 | Kategori bazlı saklama/imha tablosu yayımlayın; periyodik imha planı oluşturun. |
| Çocuk/öğrenci verisi riski | Orta-Yüksek | Kullanım Şartları lise öğrencilerinin de üye olabileceğini söylüyor. citeturn13view0 | Öğrenci kitlesi, görünürlük ve iletişim verilerinde daha sıkı koruma gerektirir. | “Öğrenci profili” için daha dar görünürlük, yaşa uygun aydınlatma ve ek güvenlik kurgusu ekleyin. |
| Kişisel iletişim bilgilerinin açık yayımlanması | Orta | İletişim sayfasında kişisel adres ve telefonlar açık. citeturn15view2 | Güvenlik, spam ve fiziksel gizlilik riski doğurabilir. | Genel destek için rol bazlı e‑posta kullanın; fiziksel adresi yalnızca hukuki bildirim sayfasında ve ihtiyaç kadar gösterin. |
| DSR / başvuru iş akışının operasyonel olmaması | Orta | Haklar metinde var, fakat başvuru usulü ve kimlik doğrulama akışı sınırlı. citeturn15view1turn37view6 | Hakların fiilen kullanılabilmesi için süreç gerekir. | `/privacy-request` formu, ticketing ve 30 günlük SLA mekanizması kurun. |
| Consentsiz ama cookieless analitik yorumu | Orta | GoatCounter cookieless çalışabilir, fakat yine de ölçüm verisi işler. citeturn40view3 | Yanlış hukuki dayanak seçimi ileride tartışma doğurabilir. | LIA yapın; kullanıcıya opt‑out verin; daha ihtiyatlıysanız rızaya bağlayın. |
| Transfer / DPA belirsizliği | Orta | Supabase ve Vercel gibi altyapı sağlayıcıları kullanılıyor; Supabase, verilerin ABD veya başka ülkelerde tutulabileceğini belirtiyor. citeturn13view3turn33search2turn33search3turn33search6turn33search7 | Türkiye/AB ekseninde uluslararası aktarım kurgusu belgeye bağlanmalı. | DPA/SCC/transfer impact assessment dosyalayın; processor register yayınlayın. |

Bu riskler içinde ilk sprintte kapatılması gereken üç konu net biçimde öne çıkıyor: Clarity consent akışı, üçüncü taraf sağlayıcı envanterinin düzeltilmesi ve “public profile” görünürlüğünün alan bazlı açık tercihe çevrilmesi. Bu üçü kapatılmadan “hukuki boşlukları kapattık” denmesi isabetli olmaz. citeturn28view0turn23view0turn15view1turn40view1

## Uyum kontrol listesi ve test planı

### Yayına alma öncesi kontrol listesi

Aşağıdaki tablo, hukuk ve teknik ekibin birlikte kullanabileceği operasyonel checklist’tir.

| Kontrol alanı | Kabul kriteri | Test yöntemi |
|---|---|---|
| Footer linkleri | Footer’da en az: İletişim, Gizlilik, KVKK, Çerez Politikası, Çerez Tercihleri, Kullanım Şartları görünür. citeturn43view0 | Snapshot/E2E testi |
| Belge sürümü | Her hukuk sayfasında yürürlük tarihi ve sürüm numarası var. | DOM testi |
| KVKK alanları | Veri sorumlusu, amaç, aktarım, yöntem+hukuki sebep, haklar eksiksiz. citeturn37view5turn37view6turn34view1 | İçerik doğrulama testi |
| Çerez tablosu | Her sağlayıcı için ad, amaç, süre, kategori, taraf ve hukuki dayanak var. citeturn39view0turn40view0 | İçerik + manuel hukuk kontrolü |
| Rıza banner’ı | “Kabul et”, “Reddet”, “Tercihler” eşit görünürlükte. KVKK rehberi çizgisine uygun. citeturn39view0 | Görsel regresyon + manuel inceleme |
| Clarity yükleme sırası | Rıza yoksa Clarity cookie’si set edilmez; rıza varsa `consentv2` ile aktive olur. citeturn40view1turn40view2 | Tarayıcı Network/Cookies E2E testi |
| GoatCounter davranışı | Seçilen hukuk modeline göre ya rıza sonrası yüklenir ya da belgelenmiş LIA ile opt‑out sunulur. citeturn40view3 | Network testi + hukuk onayı |
| Sağlayıcı envanteri | Kodda saptanan sağlayıcılar hukuk metinlerinde de aynen yer alır. | CI script |
| Form-altı aydınlatma | `AlumniCreate`, iletişim formu ve dayanışma giriş alanlarında kısa aydınlatma metni görünür. citeturn42view0turn42view5 | Bileşen testi |
| Profil görünürlüğü | Telefon/e‑posta varsayılan kapalı; alan bazlı opt‑in var. | Ürün testi |
| DSR süreci | Başvuru formu, ticket/queue, süre takibi ve cevap şablonu hazır. | Süreç testi |
| Saklama/imha | Kategori bazlı saklama tablosu ve imha prosedürü dokümante. citeturn34view2 | Doküman denetimi |
| İhlal yönetimi | Güvenlik olayı için iç prosedür ve iletişim şablonu hazır. | Tabletop exercise |
| Çok dil eşleşmesi | TR ve EN sürümler semantik olarak eşleşiyor; TR sürüm bağlayıcı notu var. | İçerik diff testi |

### Önerilen test planı

İlk katman birim ve entegrasyon testleridir. Footer linkleri, route’lar ve hukuk sayfası başlıkları için React Testing Library / Vitest kullanılabilir; depo zaten `vitest` içeriyor. Bu katmanda özellikle yanlış path, eksik link ve sürüm alanı boşluğu yakalanmalıdır. citeturn14view0

İkinci katman tarayıcı-tabanlı E2E testleridir. Playwright veya benzeri bir araçla şu senaryolar çalıştırılmalıdır: ilk ziyaretçide banner görünür; “Reddet” seçiliyken Clarity cookie’leri oluşmaz; “Kabul et” sonrası `clarity.ms` yüklenir ve izin sinyali konsolda doğrulanır; tercih merkezi yeniden açılıp izin geri alınabilir; banner metni ve butonları erişilebilirlik denetiminden geçer. Microsoft’un Clarity consent dokümantasyonu, doğrulama için konsolda `consentStatus` nesnesine bakılabileceğini özellikle anlatır. citeturn40view2turn40view1

Üçüncü katman hukuk-içerik regresyonudur. Bu aşamada her deploy öncesi “hukuk paket diff’i” üretilmeli; sürüm numarası değişmeden belge gövdesi değişiyorsa build hata vermelidir. Buna ek olarak sağlayıcı taramasıyla `clarity.ms`, `goatcounter`, `supabase`, `wa.me` gibi pattern’ler bulunup hukuk metnindeki sağlayıcı ve veri kategorisi kayıtlarıyla eşleştirilmelidir. Bu yaklaşım, depoda bugün görülen “Google Analytics metinde var, kodda yok; Clarity kodda var, metinde yok” türü drift’i sistematik olarak önler. citeturn28view0turn15view1turn15view2turn16view0turn16view4

### Önerilen otoritatif Türk ve AB kaynakları

Aşağıdaki kaynaklar, bu proje için “sık referans verilen otoritatif set” olarak tutulmalıdır.

| Kaynak | Neden önemli |
|---|---|
| 6698 sayılı Kişisel Verilerin Korunması Kanunu | Türkiye’de kişisel veri işlemenin ana kanunu. citeturn29search1 |
| KVKK Kurumu “Aydınlatma Yükümlülüğü” sayfası ve ilgili Tebliğ | Aydınlatma metninde hangi alanların zorunlu olduğunu pratik şekilde özetler. citeturn37view5turn34view1 |
| KVKK Kurumu “İlgili Kişinin Hakları” | Veri sahibi başvuru ve hak listesi için doğrudan referans. citeturn37view6 |
| KVKK “Çerez Uygulamaları Hakkında Rehber” | Çerez paneli, açık rıza, eşit buton, çerez duvarı ve bundled rıza konularında en kritik Türk kaynağı. citeturn39view0 |
| Kişisel Verilerin Silinmesi, Yok Edilmesi veya Anonim Hale Getirilmesi Hakkında Yönetmelik | Saklama/imha politikası ve kayıtların tutulması için temel kaynaktır. citeturn34view2 |
| GDPR resmi metni | AB kişisel veri rejiminin ana kaynağı; özellikle madde 7 ve 13 önemlidir. citeturn34view3turn36view1turn36view2 |
| ePrivacy Directive resmi metni | Terminal ekipmanına erişim ve cookie normlarının AB omurgasıdır. citeturn34view4turn36view3 |
| CJEU Planet49 kararı | Önceden işaretli kutular ve geçersiz cookie consent konusunda kilit içtihat. citeturn37view7 |
| Mesafeli Sözleşmeler Yönetmeliği ve 6502 | Ürün/checkout açılırsa ön bilgilendirme, satıcı bilgileri ve cayma rejimi için zorunludur. citeturn36view5turn38view1turn31search3 |
| 6563 ve Ticari Elektronik İletiler Yönetmeliği | Pazarlama iletileri ve elektronik ticaret bilgi verme yükümlülükleri için gerekir. citeturn29search3turn32search4turn32search11 |
| Microsoft Clarity resmi cookie ve consent dokümantasyonu | Clarity entegrasyonunun gerçek teknik davranışını ve consent API’sini açıklar. citeturn40view0turn40view1turn40view2 |
| GoatCounter resmi privacy dokümantasyonu | Cookieless analitik davranışı ve veri akışını anlamak için önemlidir. citeturn40view3 |
| Supabase ve Vercel resmi privacy/DPA kaynakları | Uluslararası aktarım ve işlemeci sözleşmeleri için gerekir. citeturn33search2turn33search3turn33search6turn33search7 |

Bu rapor, mevcut depodaki footer hukuk setini “genel, eksik ve kısmen hatalı” bir yapıdan; sürümlenebilir, teknik gerçekle uyumlu, Türkiye/AB ekseninde savunulabilir bir belge paketine dönüştürmek için tasarlanmıştır. Somut işletme modeli, gelir modeli, üyelik doğrulama yapısı veya ileride e‑ticaret eklentisi değişirse; özellikle satıcı bilgileri, şirket verileri, MERSİS/VKN alanları, mesafeli sözleşme seti ve ticari ileti onay akışları yeniden kalibre edilmelidir. Bu not, burada verilen metinlerin güçlü bir uygulama paketi olmasına rağmen, somut uyuşmazlıkta yerel avukat görüşünün yerini otomatik olarak almadığı anlamına gelir.