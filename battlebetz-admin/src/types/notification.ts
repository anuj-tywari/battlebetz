export interface Notification {
  id: string;
  user_id?: string | null;
  title: string;
  message: string;
  read: boolean;
  sent_at: string;
  created_at: string;
}
