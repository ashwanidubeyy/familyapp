import type {
  Announcement,
  Dependent,
  Family,
  FamilyMember,
  HealthRecordEntry,
  JoinRequest,
  Pet,
} from '@/domain';

export interface FamilyRepository {
  createFamily(name: string, adminUserId: string): Promise<Family>;
  requestToJoinFamily(inviteCode: string, userId: string): Promise<JoinRequest>;
  approveJoinRequest(requestId: string): Promise<void>;
  declineJoinRequest(requestId: string): Promise<void>;
  watchMembers(familyId: string, onChange: (members: FamilyMember[]) => void): () => void;
  watchDependents(familyId: string, onChange: (dependents: Dependent[]) => void): () => void;
  watchPets(familyId: string, onChange: (pets: Pet[]) => void): () => void;
  watchAnnouncements(familyId: string, onChange: (announcements: Announcement[]) => void): () => void;
  saveHealthRecordEntry(record: HealthRecordEntry): Promise<void>;
}
