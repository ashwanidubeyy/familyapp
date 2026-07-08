import React from 'react';

import { ModuleScaffold } from '@/components';

export const ProfileScreen: React.FC = () => {
  return (
    <ModuleScaffold
      title="Profile"
      summary="Account, family QR code, members, notification preferences, and security settings."
      actions={[
        {
          title: 'Account',
          summary: 'Edit name, photo, date of birth, password, and core profile details.',
        },
        {
          title: 'Family setup',
          summary: 'Create a family, join one later, or update household membership settings.',
        },
        {
          title: 'Family QR code',
          summary: 'View and share the family QR code so trusted members can request access.',
        },
        {
          title: 'Security and logout',
          summary: 'Manage security preferences and log out without changing family membership.',
        },
      ]}
    />
  );
};
