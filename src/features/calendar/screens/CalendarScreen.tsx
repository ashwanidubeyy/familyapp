import React from 'react';

import { ModuleScaffold } from '@/components';

export const CalendarScreen: React.FC = () => {
  return (
    <ModuleScaffold
      title="Calendar"
      summary="A unified monthly and weekly reminder engine fed by family, vault, and manual events."
      actions={[
        {
          title: 'Birthdays and festivals',
          summary: 'See family birthdays, anniversaries, festivals, and personal milestones.',
        },
        {
          title: 'Bills and expirations',
          summary: 'Track bill due dates, warranty expirations, renewals, and reminders.',
        },
        {
          title: 'Appointments',
          summary: 'Create manual appointments and reminders for family or personal events.',
        },
        {
          title: 'Notifications',
          summary: 'Manage push reminders and in-app fallback alerts for important dates.',
        },
      ]}
    />
  );
};
