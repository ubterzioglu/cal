import { supabase } from "@/lib/supabase";

export type SolidarityTopic = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export type SolidarityComment = {
  id: string;
  topicId: string;
  body: string;
  createdAt: string;
};

type TopicRow = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

type CommentRow = {
  id: string;
  topic_id: string;
  body: string;
  created_at: string;
};

const mapTopic = (row: TopicRow): SolidarityTopic => ({
  id: row.id,
  title: row.title,
  description: row.description,
  createdAt: row.created_at,
});

const mapComment = (row: CommentRow): SolidarityComment => ({
  id: row.id,
  topicId: row.topic_id,
  body: row.body,
  createdAt: row.created_at,
});

export const fetchSolidarityTopics = async (): Promise<SolidarityTopic[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("public_alumni_solidarity_topics")
    .select("id, title, description, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Dayanışma başlıkları alınamadı", error);
    return [];
  }

  return data.map(mapTopic);
};

export const fetchSolidarityComments = async (): Promise<SolidarityComment[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("public_alumni_solidarity_comments")
    .select("id, topic_id, body, created_at")
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.error("Dayanışma yorumları alınamadı", error);
    return [];
  }

  return data.map(mapComment);
};

export const createSolidarityTopic = async (title: string, description: string) => {
  if (!supabase) {
    return;
  }

  const response = await fetch("/api/solidarity/topics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    console.error("Dayanisma basligi olusturulamadi", errorPayload);
    throw new Error("Dayanisma basligi olusturulamadi");
  }
};

export const createSolidarityComment = async (topicId: string, body: string) => {
  if (!supabase) {
    return;
  }

  const response = await fetch("/api/solidarity/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topicId, body }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    console.error("Dayanisma yorumu olusturulamadi", errorPayload);
    throw new Error("Dayanisma yorumu olusturulamadi");
  }
};
