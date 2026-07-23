import { useQuery } from "@tanstack/react-query";
import { fetchAnnouncements } from "@/data/announcements";

const AnnouncementMarquee = () => {
  const { data } = useQuery({
    queryKey: ["announcements"],
    queryFn: fetchAnnouncements,
  });

  const announcements = data ?? [];

  if (announcements.length === 0) {
    return null;
  }

  const items = [...announcements, ...announcements];

  return (
    <div className="announcement-marquee mb-8 opacity-0 animate-fade-in-up [animation-delay:120ms]">
      <div className="announcement-marquee-track">
        {items.map((announcement, index) => (
          <div
            key={`${announcement.id}-${index}`}
            className="flex shrink-0 items-center gap-3 rounded-full border border-primary/30 bg-primary/10 py-2 pl-2 pr-5"
          >
            {announcement.imageUrl && (
              <img
                src={announcement.imageUrl}
                alt=""
                className="h-8 w-8 shrink-0 rounded-full object-cover"
                loading="lazy"
              />
            )}
            <div className="whitespace-nowrap text-sm">
              <span className="font-semibold">{announcement.title}</span>
              <span className="mx-2 text-muted-foreground">·</span>
              <span className="text-muted-foreground">{announcement.body}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementMarquee;
