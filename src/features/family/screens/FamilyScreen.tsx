import React from 'react';

import { ModuleScaffold } from '@/components';

export const FamilyScreen: React.FC = () => {
  return (
    <ModuleScaffold
      title="Family"
      summary="Profiles, admin status, health records, emergency contacts, announcements, and join requests."
      actions={[
        {
          title: 'Members',
          summary: 'View approved family members, roles, admin status, and shared access.',
        },
        {
          title: 'Join requests',
          summary: 'Review pending requests and approve or decline access for new members.',
        },
        {
          title: 'Health records',
          summary: 'Organize prescriptions, doctors, visit history, and important health notes.',
        },
        {
          title: 'Emergency and SOS',
          summary: 'Keep emergency contacts, medical details, and urgent family information ready.',
        },
      ]}
    />
  );
};
