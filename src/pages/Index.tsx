import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CommunityCards from "@/components/home/CommunityCards";
import CommunityMessage from "@/components/home/CommunityMessage";
import Seo from "@/seo/Seo";
import { DEFAULT_TITLE } from "@/seo/siteConfig";
import { organizationSchema, websiteSchema } from "@/seo/jsonLd";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title={DEFAULT_TITLE}
        description="Cağaloğlu Anadolu Lisesi öğrenci ve mezunlarını buluşturan dijital topluluk platformu. Haberler, kulüpler, etkinlikler, takımlar ve mezun dayanışması bir arada."
        path="/"
        jsonLd={[organizationSchema(), websiteSchema()]}
      />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CommunityMessage />
        <CommunityCards />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
