import type { Reminder } from '@/domain';

export interface ReminderRepository {
  createReminder(reminder: Reminder): Promise<Reminder>;
  updateReminder(reminder: Reminder): Promise<void>;
  watchFamilyReminders(familyId: string, onChange: (reminders: Reminder[]) => void): () => void;
  watchUserReminders(userId: string, onChange: (reminders: Reminder[]) => void): () => void;
}
