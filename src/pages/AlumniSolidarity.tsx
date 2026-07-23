import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { fetchAlumni } from "@/data/alumni";
import { fetchStudents } from "@/data/students";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createSolidarityComment,
  createSolidarityTopic,
  fetchSolidarityComments,
  fetchSolidarityTopics,
} from "@/data/alumniSolidarity";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Seo from "@/seo/Seo";

const AlumniSolidarity = () => {
  const { data: alumni, isLoading: isAlumniLoading } = useQuery({
    queryKey: ["alumni"],
    queryFn: fetchAlumni,
  });
  const { data: students, isLoading: isStudentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });
  const { data: topics = [], isLoading: isTopicsLoading } = useQuery({
    queryKey: ["solidarity-topics"],
    queryFn: fetchSolidarityTopics,
  });
  const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
    queryKey: ["solidarity-comments"],
    queryFn: fetchSolidarityComments,
  });
  const queryClient = useQueryClient();
  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const currentAlumni = alumni?.[0];
  const currentStudent = students?.[0];
  const isLoading = isAlumniLoading || isStudentsLoading;
  const hasProfile = Boolean(currentAlumni || currentStudent);
  const isAllowed = Boolean(currentAlumni) || (currentStudent ? currentStudent.graduationYear < 2026 : false);
  const isBlocked = Boolean(currentStudent) && currentStudent.graduationYear >= 2026 && !currentAlumni;

  const commentsByTopic = useMemo(() => {
    const grouped: Record<string, typeof comments> = {};
    comments.forEach((comment) => {
      if (!grouped[comment.topicId]) {
        grouped[comment.topicId] = [];
      }
      grouped[comment.topicId].push(comment);
    });
    return grouped;
  }, [comments]);

  const createTopicMutation = useMutation({
    mutationFn: () => createSolidarityTopic(topicTitle.trim(), topicDescription.trim()),
    onSuccess: async () => {
      setTopicTitle("");
      setTopicDescription("");
      await queryClient.invalidateQueries({ queryKey: ["solidarity-topics"] });
      toast.success("Paylaşımın eklendi.");
    },
    onError: () => {
      toast.error("Paylaşım eklenemedi. Lütfen tekrar dene.");
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: ({ topicId, body }: { topicId: string; body: string }) =>
      createSolidarityComment(topicId, body),
    onSuccess: async (_data, variables) => {
      setCommentDrafts((prev) => ({ ...prev, [variables.topicId]: "" }));
      await queryClient.invalidateQueries({ queryKey: ["solidarity-comments"] });
      toast.success("Yorumun eklendi.");
    },
    onError: () => {
      toast.error("Yorum eklenemedi. Lütfen tekrar dene.");
    },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title="Mezun Dayanışması"
        description="Cağaloğlu Anadolu Lisesi mezunlarının birbirine destek olduğu dayanışma topluluğu."
        path="/mezun-dayanisma"
        noindex
      />
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Mezunlar Dayanışma</h1>
                <p className="text-muted-foreground text-lg">
                  Bu bölüm yalnızca mezunlara açıktır.
                </p>
              </div>

              {isLoading && (
                <p className="text-sm text-muted-foreground">Profil kontrol ediliyor...</p>
              )}

              {!isLoading && !hasProfile && (
                <p className="text-sm text-muted-foreground">Profil bulunamadı.</p>
              )}

              {!isLoading && isBlocked && (
                <p className="text-sm text-destructive">
                  Mezuniyet yılı 2026 ve sonrası olanlar bu bölüme erişemez.
                </p>
              )}

              {!isLoading && isAllowed && (
                <div className="space-y-8">
                  <div className="space-y-3 rounded-lg border p-4">
                    <h2 className="text-lg font-semibold">Yeni başlık</h2>
                    <Input
                      value={topicTitle}
                      onChange={(event) => setTopicTitle(event.target.value)}
                      placeholder="Başlık"
                    />
                    <Textarea
                      value={topicDescription}
                      onChange={(event) => setTopicDescription(event.target.value)}
                      placeholder="Açıklama"
                      rows={4}
                    />
                    <Button
                      onClick={() => createTopicMutation.mutate()}
                      disabled={!topicTitle.trim() || !topicDescription.trim() || createTopicMutation.isPending}
                    >
                      {createTopicMutation.isPending ? "Paylaşılıyor..." : "Paylaş"}
                    </Button>
                  </div>

                  {(isTopicsLoading || isCommentsLoading) && (
                    <p className="text-sm text-muted-foreground">Paylaşımlar yükleniyor...</p>
                  )}

                  <div className="space-y-6">
                    {topics.map((topic) => (
                      <div key={topic.id} className="rounded-lg border p-4 space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold">{topic.title}</h3>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {topic.description}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">Yorumlar</h4>
                          <div className="space-y-2">
                            {(commentsByTopic[topic.id] ?? []).length > 0 ? (
                              (commentsByTopic[topic.id] ?? []).map((comment) => (
                                <div key={comment.id} className="rounded-md border border-white/10 p-3 text-sm text-muted-foreground">
                                  {comment.body}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">Henüz yorum yok.</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Textarea
                              value={commentDrafts[topic.id] ?? ""}
                              onChange={(event) =>
                                setCommentDrafts((prev) => ({ ...prev, [topic.id]: event.target.value }))
                              }
                              placeholder="Yorum yaz"
                              rows={3}
                            />
                            <Button
                              onClick={() =>
                                createCommentMutation.mutate({
                                  topicId: topic.id,
                                  body: (commentDrafts[topic.id] ?? "").trim(),
                                })
                              }
                              disabled={!commentDrafts[topic.id]?.trim() || createCommentMutation.isPending}
                            >
                              {createCommentMutation.isPending ? "Gönderiliyor..." : "Gönder"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AlumniSolidarity;
