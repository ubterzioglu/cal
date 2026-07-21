import { supabase } from "@/lib/supabase";

export type FeedbackSubmission = {
  id: string;
  userId: string;
  userEmail: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type FeedbackSubmissionRow = {
  id: string;
  user_id: string;
  user_email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

const mapFeedback = (row: FeedbackSubmissionRow): FeedbackSubmission => ({
  id: row.id,
  userId: row.user_id,
  userEmail: row.user_email,
  message: row.message,
  isRead: row.is_read,
  createdAt: row.created_at,
});

const FEEDBACK_SELECT = "id, user_id, user_email, message, is_read, created_at";

// Goes through /api/feedback (not a direct Supabase insert) so the
// serverless handler can also send the admin notification email.
export const submitFeedback = async (message: string): Promise<void> => {
  if (!supabase) {
    throw new Error("SUPABASE_UNAVAILABLE");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("NOT_AUTHENTICATED");
  }

  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("FEEDBACK_SUBMIT_FAILED");
  }
};

// Superadmin-only: RLS restricts full-table reads to the superadmin email.
export const fetchAllFeedback = async (): Promise<FeedbackSubmission[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("feedback_submissions")
    .select(FEEDBACK_SELECT)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Geri bildirimler alınamadı", error);
    return [];
  }

  return (data as FeedbackSubmissionRow[]).map(mapFeedback);
};

export const markFeedbackAsRead = async (id: string): Promise<void> => {
  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from("feedback_submissions")
    .update({ is_read: true })
    .eq("id", id);

  if (error) {
    console.error("Geri bildirim güncellenemedi", error);
    throw new Error("FEEDBACK_UPDATE_FAILED");
  }
};
