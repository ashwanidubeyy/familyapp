export interface NotificationRepository {
  registerDevice(userId: string): Promise<void>;
  scheduleReminderNotification(reminderId: string): Promise<void>;
  showInAppFallback(userId: string, message: string): Promise<void>;
}
