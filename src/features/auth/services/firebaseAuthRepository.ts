import auth, { type FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore, {
  type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

import { FIREBASE_COLLECTIONS, familyScopedPath } from "@/firebase";
import type { Family, UserProfile } from "@/domain";

import type { SignupPayload } from "../types";
import type { AuthRepository } from "./authRepository";

const nowIso = (): string => new Date().toISOString();

const createInviteCode = (): string => {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
};

const mapUserDocument = (
  uid: string,
  email: string | null,
  data: FirebaseFirestoreTypes.DocumentData | undefined,
): UserProfile => {
  const createdAt =
    typeof data?.createdAt === "string" ? data.createdAt : nowIso();
  const updatedAt =
    typeof data?.updatedAt === "string" ? data.updatedAt : createdAt;

  return {
    id: typeof data?.id === "string" ? data.id : uid,
    uid: typeof data?.uid === "string" ? data.uid : uid,
    familyId: typeof data?.familyId === "string" ? data.familyId : null,
    name: typeof data?.name === "string" ? data.name : "",
    email: typeof data?.email === "string" ? data.email : email ?? "",
    phone: typeof data?.phone === "string" ? data.phone : undefined,
    dob: typeof data?.dob === "string" ? data.dob : undefined,
    address: typeof data?.address === "string" ? data.address : undefined,
    role: data?.role === "admin" ? "admin" : "member",
    relation: typeof data?.relation === "string" ? data.relation : undefined,
    authProviders: Array.isArray(data?.authProviders)
      ? data.authProviders
      : ["password"],
    pinHash: typeof data?.pinHash === "string" ? data.pinHash : null,
    biometricEnabled: Boolean(data?.biometricEnabled),
    photoURL: typeof data?.photoURL === "string" ? data.photoURL : undefined,
    status:
      data?.status === "active" || data?.status === "declined"
        ? data.status
        : "pendingFamily",
    createdAt,
    updatedAt,
    inviteCode: data?.inviteCode,
  };
};

class FirebaseAuthRepository implements AuthRepository {
  async getCurrentUser(): Promise<UserProfile | null> {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      return null;
    }

    return this.getUserProfile(currentUser);
  }

  async signInWithEmail(email: string, password: string): Promise<UserProfile> {
    const credential = await auth().signInWithEmailAndPassword(
      email.trim().toLowerCase(),
      password,
    );

    return this.getUserProfile(credential.user);
  }

  async signUpWithEmail(
    email: string,
    password: string,
    displayName: string,
  ): Promise<UserProfile> {
    return this.createAccount({
      name: displayName,
      email,
      dob: "",
      phone: "",
      password,
      address: "",
    });
  }

  async createAccount(payload: SignupPayload): Promise<UserProfile> {
    const credential = await auth().createUserWithEmailAndPassword(
      payload.email.trim().toLowerCase(),
      payload.password,
    );
    const { uid } = credential.user;
    const timestamp = nowIso();
    const user: UserProfile = {
      id: uid,
      uid,
      familyId: null,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      dob: payload.dob.trim(),
      address: payload.address.trim(),
      role: "member",
      authProviders: ["password"],
      pinHash: null,
      biometricEnabled: false,
      status: "pendingFamily",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await firestore().collection(FIREBASE_COLLECTIONS.users).doc(uid).set(user);

    return user;
  }

  async sendPasswordReset(email: string): Promise<void> {
    await auth().sendPasswordResetEmail(email.trim().toLowerCase());
  }

  async signOut(): Promise<void> {
    await auth().signOut();
  }

  async createFamily(name: string, user: UserProfile): Promise<UserProfile> {
    const db = firestore();
    const familyRef = db.collection(FIREBASE_COLLECTIONS.families).doc();
    const memberRef = db.doc(
      `${familyScopedPath(familyRef.id, "members")}/${user.uid}`,
    );
    const userRef = db.collection(FIREBASE_COLLECTIONS.users).doc(user.uid);
    const timestamp = nowIso();
    const family: Family = {
      id: familyRef.id,
      name: name.trim(),
      adminCount: 1,
      memberCount: 1,
      inviteCode: createInviteCode(),
      inviteCodeExpiresAt: null,
      settings: {},
      createdAt: timestamp,
    };
    const updatedUser: UserProfile = {
      ...user,
      familyId: familyRef.id,
      role: "admin",
      status: "active",
      inviteCode: family.inviteCode,
      updatedAt: timestamp,
    };

    const batch = db.batch();
    batch.set(familyRef, family);
    batch.set(memberRef, {
      userId: user.uid,
      name: user.name,
      photoURL: user.photoURL ?? null,
      dob: user.dob ?? null,
      relation: user.relation ?? null,
      isAdmin: true,
      status: "approved",
      joinedAt: timestamp,
    });
    batch.update(userRef, {
      familyId: updatedUser.familyId,
      role: updatedUser.role,
      status: updatedUser.status,
      inviteCode: family.inviteCode,
      updatedAt: updatedUser.updatedAt,
    });
    await batch.commit();

    return updatedUser;
  }

  async requestToJoinFamily(
    inviteCode: string,
    user: UserProfile,
  ): Promise<UserProfile> {
    const normalizedInviteCode = inviteCode.trim().toUpperCase();
    const familySnapshot = await firestore()
      .collection(FIREBASE_COLLECTIONS.families)
      .where("inviteCode", "==", normalizedInviteCode)
      .limit(1)
      .get();

    if (familySnapshot.empty) {
      throw new Error("No family found for this invite code.");
    }

    const familyDoc = familySnapshot.docs[0];
    const timestamp = nowIso();
    const memberRef = firestore().doc(
      `${familyScopedPath(familyDoc.id, "members")}/${user.uid}`,
    );
    const userRef = firestore()
      .collection(FIREBASE_COLLECTIONS.users)
      .doc(user.uid);
    const updatedUser: UserProfile = {
      ...user,
      familyId: familyDoc.id,
      role: "member",
      status: "active",
      updatedAt: timestamp,
    };

    const batch = firestore().batch();
    batch.set(memberRef, {
      userId: user.uid,
      name: user.name,
      photoURL: user.photoURL ?? null,
      dob: user.dob ?? null,
      relation: user.relation ?? null,
      isAdmin: false,
      status: "approved",
      joinedAt: timestamp,
    });
    batch.update(familyDoc.ref, {
      memberCount: firestore.FieldValue.increment(1),
    });
    batch.update(userRef, {
      familyId: updatedUser.familyId,
      role: updatedUser.role,
      status: updatedUser.status,
      updatedAt: updatedUser.updatedAt,
    });
    await batch.commit();

    return updatedUser;
  }

  private async getUserProfile(
    firebaseUser: FirebaseAuthTypes.User,
  ): Promise<UserProfile> {
    const doc = await firestore()
      .collection(FIREBASE_COLLECTIONS.users)
      .doc(firebaseUser.uid)
      .get();

    if (!doc.exists) {
      throw new Error("User profile was not found.");
    }

    return mapUserDocument(firebaseUser.uid, firebaseUser.email, doc.data());
  }
}

export const firebaseAuthRepository = new FirebaseAuthRepository();
