import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Newspaper, Users, GraduationCap, Briefcase, Heart, Rocket, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/use-in-view";

interface CommunityItem {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  /** Tailwind config'de TANIMLI renk token'ları (transparent ikon bug'ından kaçınmak için) */
  iconClass: string;
  glowClass: string;
}

const communityItems: CommunityItem[] = [
  {
    icon: Users,
    title: "Öğrenci Kulüpleri",
    description: "Öğrenci kulüplerini keşfet, üyelik başvurusu yap ve etkinliklere katıl.",
    href: "/clubs",
    iconClass: "bg-alm-blue/15 text-alm-blue group-hover:bg-alm-blue",
    glowClass: "group-hover:shadow-alm-blue/20 group-hover:border-alm-blue/40",
  },
  {
    icon: CalendarDays,
    title: "Öğrenci Etkinlikleri",
    description: "Öğrenci etkinliklerini keşfet ve duyuruları takip et.",
    href: "/etkinlikler",
    iconClass: "bg-office4/15 text-office4 group-hover:bg-office4",
    glowClass: "group-hover:shadow-office4/20 group-hover:border-office4/40",
  },
  {
    icon: Rocket,
    title: "Öğrenci Takımları",
    description: "Öğrenci takımlarını keşfet ve projelerini takip et.",
    href: "/takimlar",
    iconClass: "bg-primary/15 text-primary group-hover:bg-primary",
    glowClass: "group-hover:shadow-primary/25 group-hover:border-primary/40",
  },
  {
    icon: Newspaper,
    title: "Duyurular",
    description: "Okul ve topluluk duyurularını takip et.",
    href: "/news",
    iconClass: "bg-alm-green/15 text-alm-green group-hover:bg-alm-green",
    glowClass: "group-hover:shadow-alm-green/20 group-hover:border-alm-green/40",
  },
  {
    icon: GraduationCap,
    title: "Öğrenciler",
    description: "Anonim öğrenci profilleri, mezuniyet yılı ve dönem bilgileri.",
    href: "/students",
    iconClass: "bg-alm-orange/15 text-alm-orange group-hover:bg-alm-orange",
    glowClass: "group-hover:shadow-alm-orange/20 group-hover:border-alm-orange/40",
  },
  {
    icon: Briefcase,
    title: "Mezunlar",
    description: "Mezun profilleri, iletişim ve destek olabilecekleri alanlar.",
    href: "/alumni",
    iconClass: "bg-alm-yellow/15 text-alm-yellow group-hover:bg-alm-yellow",
    glowClass: "group-hover:shadow-alm-yellow/20 group-hover:border-alm-yellow/40",
  },
  {
    icon: Heart,
    title: "Mezunlar Dayanışma",
    description: "Mezunlar arası dayanışma ve destek alanı.",
    href: "/mezun-dayanisma",
    iconClass: "bg-primary/15 text-primary group-hover:bg-primary",
    glowClass: "group-hover:shadow-primary/25 group-hover:border-primary/40",
  },
];

interface CommunityCardProps {
  item: CommunityItem;
  index: number;
}

const CommunityCard = ({ item, index }: CommunityCardProps) => {
  const { ref, inView } = useInView<HTMLAnchorElement>();

  return (
    <Link
      ref={ref}
      to={item.href}
      className={`w-full opacity-0 ${inView ? "animate-fade-in-up" : ""}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Card
        className={`group h-full cursor-pointer border-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${item.glowClass}`}
      >
        <CardHeader>
          <div
            className={`mb-2 flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:text-black ${item.iconClass}`}
          >
            <item.icon size={24} />
          </div>
          <CardTitle className="text-lg">{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-relaxed">
            {item.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

const CommunityCards = () => {
  return (
    <section id="community-areas" className="py-20 bg-black">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Keşfet
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Topluluk Alanları
          </h2>
        </div>

        <div className="mx-auto grid max-w-2xl gap-6 grid-cols-1">
          {communityItems.map((item, index) => (
            <CommunityCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityCards;
