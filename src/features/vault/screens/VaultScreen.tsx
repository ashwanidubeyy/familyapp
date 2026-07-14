import React from 'react';

import { ModuleScaffold } from '@/components';

export const VaultScreen: React.FC = () => {
  return (
    <ModuleScaffold
      title="Vault"
      summary="Private and public storage for documents, assets, bills, passwords, and secure records."
      actions={[
        {
          title: 'Private and public vault',
          summary: 'Keep personal records private or share approved items with the family.',
        },
        {
          title: 'Documents',
          summary: 'Store IDs, certificates, policies, receipts, and other household files.',
        },
        {
          title: 'Properties and vehicles',
          summary: 'Track ownership papers, service history, insurance, and warranty details.',
        },
        {
          title: 'Bills and warranties',
          summary: 'Save recurring bills, due dates, warranty expirations, and paid status.',
        },
        {
          title: 'Secure items',
          summary: 'Protect sensitive notes and passwords with biometric or PIN re-authentication.',
        },
      ]}
    />
  );
};
