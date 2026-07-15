import firestore from '@react-native-firebase/firestore';

import type { Reminder } from '@/domain';

const nowIso = (): string => new Date().toISOString();

class ReminderService {
  async scheduleVaultReminder(reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt' | 'notified'>): Promise<Reminder> {
    const ownerPath = reminder.familyId
      ? `families/${reminder.familyId}/reminders`
      : `users/${reminder.userId}/reminders`;
    const ref = firestore().collection(ownerPath).doc();
    const timestamp = nowIso();
    const nextReminder: Reminder = {
      ...reminder,
      id: ref.id,
      notified: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await ref.set(nextReminder);

    return nextReminder;
  }
}

export const reminderService = new ReminderService();
