import firestore from "@react-native-firebase/firestore";
import {
  Family,
  FamilyMember,
  HealthInfo,
  Medicine,
  Prescription,
  DoctorVisit,
  MedicalExpense,
  Announcement,
  EmergencyContact,
  JoinRequest,
} from "../types/familyTypes";

const db = firestore();
const FAMILIES_COLLECTION = "families";

// Family Operations
export const createFamily = async (
  family: Omit<
    Family,
    | "familyId"
    | "inviteCode"
    | "memberCount"
    | "adminCount"
    | "createdAt"
    | "updatedAt"
  >,
): Promise<string> => {
  const familyName = family.familyName.trim();
  const description = family.description.trim();
  const createdBy = family.createdBy.trim();

  if (!familyName) {
    throw new Error("Family name is required.");
  }
  if (!createdBy) {
    throw new Error("Creator ID is required.");
  }

  try {
    const familyRef = db.collection(FAMILIES_COLLECTION).doc();

    // 1. Generate a guaranteed unique invite code outside the transaction
    const inviteCode = (await generateUniqueInviteCode()).toUpperCase();

    // 2. Open the transaction strictly to write the documents atomically
    await db.runTransaction(async (transaction) => {
      transaction.set(familyRef, {
        familyId: familyRef.id,
        familyName,
        inviteCode,
        createdBy,
        memberCount: 1,
        adminCount: 1,
        isActive: family.isActive ?? true,
        description,
        familyPhoto: family.familyPhoto ?? "",
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      const memberRef = familyRef.collection("members").doc(createdBy);

      transaction.set(memberRef, {
        userId: createdBy,
        displayName: "",
        name: "",
        email: "",
        phone: "",
        phoneNumber: "",
        relation: "",
        relationship: "",
        gender: "",
        address: "",
        bloodGroup: "",
        dob: null,
        profileImage: "",
        photoURL: "",
        isAdmin: true,
        status: "active",
        joinedAt: firestore.FieldValue.serverTimestamp(),
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    });

    return familyRef.id;
  } catch (error) {
    console.error("createFamily()", error);
    if (error instanceof Error) throw error;
    throw new Error("Unable to create family.");
  }
};

export const getFamily = async (familyId: string): Promise<Family | null> => {
  const trimmedId = familyId.trim();

  if (!trimmedId) {
    throw new Error("Family ID is required.");
  }

  try {
    const doc = await db.collection(FAMILIES_COLLECTION).doc(trimmedId).get();

    if (!doc.exists) {
      return null;
    }

    const family = {
      familyId: doc.id,
      ...(doc.data() as Omit<Family, "familyId">),
    };

    return family;
  } catch (error) {
    console.error("getFamily:", error);
    throw new Error("Unable to fetch family.");
  }
};

export const updateFamily = async (
  familyId: string,
  updates: Partial<Family>,
): Promise<void> => {
  const trimmedId = familyId.trim();

  if (!trimmedId) {
    throw new Error("Family ID is required.");
  }

  const allowedUpdates: Partial<Family> = {};

  if (updates.familyName !== undefined) {
    const familyName = updates.familyName.trim();

    if (familyName.length < 3) {
      throw new Error("Family name must be at least 3 characters.");
    }

    allowedUpdates.familyName = familyName;
  }

  if (updates.familyPhoto !== undefined) {
    allowedUpdates.familyPhoto = updates.familyPhoto;
  }

  if (updates.description !== undefined) {
    allowedUpdates.description = updates.description.trim();
  }

  if (updates.isActive !== undefined) {
    allowedUpdates.isActive = updates.isActive;
  }

  allowedUpdates.updatedAt = firestore.FieldValue.serverTimestamp() as any;

  try {
    await db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedId)
      .update(allowedUpdates);
  } catch (error) {
    console.error("updateFamily:", error);
    throw new Error("Unable to update family.");
  }
};

// Member Operations
export const addMember = async (
  familyId: string,
  memberData: Omit<
    FamilyMember,
    "joinedAt" | "status" | "createdAt" | "updatedAt"
  >,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const userId = memberData.userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!userId) {
    throw new Error("User ID is required.");
  }

  try {
    const familyRef = db.collection(FAMILIES_COLLECTION).doc(trimmedFamilyId);

    const memberRef = familyRef.collection("members").doc(userId);

    await db.runTransaction(async (transaction) => {
      const familySnap = await transaction.get(familyRef);

      if (!familySnap.exists) {
        throw new Error("Family not found.");
      }

      const family = familySnap.data() as Family;

      if (!family.isActive) {
        throw new Error("Family is inactive.");
      }

      const memberSnap = await transaction.get(memberRef);

      if (memberSnap.exists) {
        throw new Error("User is already a member of this family.");
      }

      transaction.set(memberRef, {
        ...memberData,
        userId,
        status: "active",
        joinedAt: firestore.FieldValue.serverTimestamp(),
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      transaction.update(familyRef, {
        memberCount: firestore.FieldValue.increment(1),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    });
  } catch (error) {
    console.error("addMember()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to add member.");
  }
};

export const getMember = async (
  familyId: string,
  userId: string,
): Promise<FamilyMember | null> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  try {
    const doc = await db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId)
      .get();

    if (!doc.exists) {
      return null;
    }

    return {
      userId: doc.id,
      ...(doc.data() as Omit<FamilyMember, "userId">),
    };
  } catch (error) {
    console.error("getMember()", error);

    throw new Error("Unable to fetch member.");
  }
};

export const getAllMembers = async (
  familyId: string,
): Promise<FamilyMember[]> => {
  const trimmedFamilyId = familyId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  try {
    const snapshot = await db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .orderBy("joinedAt", "asc")
      .get();

    return snapshot.docs.map((doc) => ({
      userId: doc.id,
      ...(doc.data() as Omit<FamilyMember, "userId">),
    }));
  } catch (error) {
    console.error("getAllMembers()", error);

    throw new Error("Unable to fetch members.");
  }
};

export const updateMember = async (
  familyId: string,
  userId: string,
  updates: Partial<FamilyMember>,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  const allowedUpdates: Partial<FamilyMember> = {};

  if (updates.displayName !== undefined) {
    const name = updates.displayName.trim();

    if (!name) {
      throw new Error("Display name cannot be empty.");
    }

    allowedUpdates.displayName = name;
  }

  if (updates.photoURL !== undefined) {
    allowedUpdates.photoURL = updates.photoURL;
  }

  if (updates.phoneNumber !== undefined) {
    allowedUpdates.phoneNumber = updates.phoneNumber;
  }

  if (updates.relationship !== undefined) {
    allowedUpdates.relationship = updates.relationship;
  }

  allowedUpdates.updatedAt = firestore.FieldValue.serverTimestamp() as any;

  try {
    await db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId)
      .update(allowedUpdates);
  } catch (error) {
    console.error("updateMember()", error);

    throw new Error("Unable to update member.");
  }
};

export const removeMember = async (
  familyId: string,
  userId: string,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  const familyRef = db.collection(FAMILIES_COLLECTION).doc(trimmedFamilyId);

  const memberRef = familyRef.collection("members").doc(trimmedUserId);

  try {
    await db.runTransaction(async (transaction) => {
      const familySnap = await transaction.get(familyRef);

      if (!familySnap.exists) {
        throw new Error("Family not found.");
      }

      const family = familySnap.data() as Family;

      const memberSnap = await transaction.get(memberRef);

      if (!memberSnap.exists) {
        throw new Error("Member not found.");
      }

      const member = memberSnap.data() as FamilyMember;

      if (member.isAdmin && family.adminCount <= 1) {
        throw new Error("Cannot remove the last admin.");
      }

      transaction.delete(memberRef);

      const familyUpdates: Record<string, unknown> = {
        memberCount: firestore.FieldValue.increment(-1),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (member.isAdmin) {
        familyUpdates.adminCount = firestore.FieldValue.increment(-1);
      }

      transaction.update(familyRef, familyUpdates);
    });
  } catch (error) {
    console.error("removeMember()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to remove member.");
  }
};

export const toggleAdminRole = async (
  familyId: string,
  userId: string,
  isAdmin: boolean,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  const familyRef = db.collection(FAMILIES_COLLECTION).doc(trimmedFamilyId);

  const memberRef = familyRef.collection("members").doc(trimmedUserId);

  try {
    await db.runTransaction(async (transaction) => {
      const familySnap = await transaction.get(familyRef);

      if (!familySnap.exists) {
        throw new Error("Family not found.");
      }

      const family = familySnap.data() as Family;

      const memberSnap = await transaction.get(memberRef);

      if (!memberSnap.exists) {
        throw new Error("Member not found.");
      }

      const member = memberSnap.data() as FamilyMember;

      // No change required
      if (member.isAdmin === isAdmin) {
        return;
      }

      // Prevent removing the last admin
      if (!isAdmin && family.adminCount <= 1) {
        throw new Error("Cannot remove the last admin.");
      }

      transaction.update(memberRef, {
        isAdmin,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      transaction.update(familyRef, {
        adminCount: firestore.FieldValue.increment(isAdmin ? 1 : -1),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    });
  } catch (error) {
    console.error("toggleAdminRole()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to update admin role.");
  }
};

// Health Operations
export const updateHealthInfo = async (
  familyId: string,
  userId: string,
  healthInfo: Partial<HealthInfo>,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  const familyRef = db.collection(FAMILIES_COLLECTION).doc(trimmedFamilyId);

  const memberRef = familyRef.collection("members").doc(trimmedUserId);

  const infoRef = memberRef.collection("health").doc("info");

  const allowedUpdates: Partial<HealthInfo> = {};

  if (healthInfo.bloodGroup !== undefined) {
    allowedUpdates.bloodGroup = healthInfo.bloodGroup.trim().toUpperCase();
  }

  if (healthInfo.height !== undefined) {
    allowedUpdates.height = healthInfo.height;
  }

  if (healthInfo.weight !== undefined) {
    allowedUpdates.weight = healthInfo.weight;
  }

  if (healthInfo.allergies !== undefined) {
    allowedUpdates.allergies = healthInfo.allergies;
  }

  if (healthInfo.chronicDiseases !== undefined) {
    allowedUpdates.chronicDiseases = healthInfo.chronicDiseases;
  }

  if (healthInfo.notes !== undefined) {
    allowedUpdates.notes = healthInfo.notes.trim();
  }

  allowedUpdates.updatedAt = firestore.FieldValue.serverTimestamp() as any;

  try {
    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    await infoRef.set(allowedUpdates, {
      merge: true,
    });
  } catch (error) {
    console.error("updateHealthInfo()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to update health information.");
  }
};

export const getHealthInfo = async (
  familyId: string,
  userId: string,
): Promise<HealthInfo | null> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const infoDoc = await memberRef.collection("health").doc("info").get();

    if (!infoDoc.exists) {
      return null;
    }

    return infoDoc.data() as HealthInfo;
  } catch (error) {
    console.error("getHealthInfo()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to fetch health information.");
  }
};

// Medicine Operations
export const addMedicine = async (
  familyId: string,
  userId: string,
  medicine: Omit<Medicine, "medicineId" | "updatedAt">,
): Promise<string> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  if (!medicine.medicineName.trim()) {
    throw new Error("Medicine name is required.");
  }

  if (!medicine.dosage.trim()) {
    throw new Error("Dosage is required.");
  }

  if (!medicine.frequency.trim()) {
    throw new Error("Frequency is required.");
  }

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const medicineRef = db
      .collection(
        `${FAMILIES_COLLECTION}/${trimmedFamilyId}/members/${trimmedUserId}/health/medicines`,
      )
      .doc();

    await medicineRef.set({
      medicineId: medicineRef.id,
      medicineName: medicine.medicineName.trim(),
      dosage: medicine.dosage.trim(),
      frequency: medicine.frequency.trim(),
      morning: medicine.morning,
      afternoon: medicine.afternoon,
      night: medicine.night,
      startDate: medicine.startDate,
      endDate: medicine.endDate,
      notes: medicine.notes.trim(),
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    return medicineRef.id;
  } catch (error) {
    console.error("addMedicine()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to add medicine.");
  }
};

export const getMedicines = async (
  familyId: string,
  userId: string,
): Promise<Medicine[]> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const medicinesCollection = memberRef
      .collection("health")
      .collection("medicines");

    const snapshot = await medicinesCollection.get();

    return snapshot.docs.map((doc) => ({
      medicineId: doc.id,
      ...(doc.data() as Omit<Medicine, "medicineId">),
    }));
  } catch (error) {
    console.error("getMedicines()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to fetch medicines.");
  }
};

export const updateMedicine = async (
  familyId: string,
  userId: string,
  medicineId: string,
  updates: Partial<Medicine>,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();
  const trimmedMedicineId = medicineId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  if (!trimmedMedicineId) {
    throw new Error("Medicine ID is required.");
  }

  const allowedUpdates: Partial<Medicine> = {};

  if (updates.medicineName !== undefined) {
    const name = updates.medicineName.trim();

    if (!name) {
      throw new Error("Medicine name cannot be empty.");
    }

    allowedUpdates.medicineName = name;
  }

  if (updates.dosage !== undefined) {
    allowedUpdates.dosage = updates.dosage.trim();
  }

  if (updates.frequency !== undefined) {
    allowedUpdates.frequency = updates.frequency.trim();
  }

  if (updates.morning !== undefined) {
    allowedUpdates.morning = updates.morning;
  }

  if (updates.afternoon !== undefined) {
    allowedUpdates.afternoon = updates.afternoon;
  }

  if (updates.night !== undefined) {
    allowedUpdates.night = updates.night;
  }

  if (updates.startDate !== undefined) {
    allowedUpdates.startDate = updates.startDate;
  }

  if (updates.endDate !== undefined) {
    allowedUpdates.endDate = updates.endDate;
  }

  if (updates.notes !== undefined) {
    allowedUpdates.notes = updates.notes.trim();
  }

  allowedUpdates.updatedAt = firestore.FieldValue.serverTimestamp() as any;

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const medicineRef = db.doc(
      `${FAMILIES_COLLECTION}/${trimmedFamilyId}/members/${trimmedUserId}/health/medicines/${trimmedMedicineId}`,
    );

    const medicineSnap = await medicineRef.get();

    if (!medicineSnap.exists) {
      throw new Error("Medicine not found.");
    }

    await medicineRef.update(allowedUpdates);
  } catch (error) {
    console.error("updateMedicine()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to update medicine.");
  }
};

export const deleteMedicine = async (
  familyId: string,
  userId: string,
  medicineId: string,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();
  const trimmedMedicineId = medicineId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  if (!trimmedMedicineId) {
    throw new Error("Medicine ID is required.");
  }

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const medicineRef = db.doc(
      `${FAMILIES_COLLECTION}/${trimmedFamilyId}/members/${trimmedUserId}/health/medicines/${trimmedMedicineId}`,
    );

    const medicineSnap = await medicineRef.get();

    if (!medicineSnap.exists) {
      throw new Error("Medicine not found.");
    }

    await medicineRef.delete();
  } catch (error) {
    console.error("deleteMedicine()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to delete medicine.");
  }
};

// Prescription Operations
export const addPrescription = async (
  familyId: string,
  userId: string,
  prescription: Omit<
    Prescription,
    "prescriptionId" | "createdAt" | "updatedAt"
  >,
): Promise<string> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  if (!prescription.doctor?.trim()) {
    throw new Error("Doctor name is required.");
  }

  if (!prescription.hospital?.trim()) {
    throw new Error("Hospital name is required.");
  }

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const prescriptionRef = db
      .collection(
        `${FAMILIES_COLLECTION}/${trimmedFamilyId}/members/${trimmedUserId}/health/prescriptions`,
      )
      .doc();

    await prescriptionRef.set({
      prescriptionId: prescriptionRef.id,

      ...prescription,

      doctor: prescription.doctor.trim(),
      hospital: prescription.hospital.trim(),

      createdAt: firestore.FieldValue.serverTimestamp(),

      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    return prescriptionRef.id;
  } catch (error) {
    console.error("addPrescription()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to add prescription.");
  }
};

export const updatePrescription = async (
  familyId: string,
  userId: string,
  prescriptionId: string,
  updates: Partial<Prescription>,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();
  const trimmedPrescriptionId = prescriptionId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  if (!trimmedPrescriptionId) {
    throw new Error("Prescription ID is required.");
  }

  const allowedUpdates: Partial<Prescription> = {};

  if (updates.doctor !== undefined) {
    const doctor = updates.doctor.trim();
    if (!doctor) {
      throw new Error("Doctor name cannot be empty.");
    }
    allowedUpdates.doctor = doctor;
  }

  if (updates.hospital !== undefined) {
    const hospital = updates.hospital.trim();
    if (!hospital) {
      throw new Error("Hospital name cannot be empty.");
    }
    allowedUpdates.hospital = hospital;
  }

  if (updates.documentId !== undefined) {
    allowedUpdates.documentId = updates.documentId;
  }

  if (updates.notes !== undefined) {
    allowedUpdates.notes = updates.notes.trim();
  }

  allowedUpdates.updatedAt = firestore.FieldValue.serverTimestamp() as any;

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const prescriptionRef = db.doc(
      `${FAMILIES_COLLECTION}/${trimmedFamilyId}/members/${trimmedUserId}/health/prescriptions/${trimmedPrescriptionId}`,
    );

    const prescriptionSnap = await prescriptionRef.get();

    if (!prescriptionSnap.exists) {
      throw new Error("Prescription not found.");
    }

    await prescriptionRef.update(allowedUpdates);
  } catch (error) {
    console.error("updatePrescription()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to update prescription.");
  }
};

export const getPrescriptions = async (
  familyId: string,
  userId: string,
): Promise<Prescription[]> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const prescriptionsCollection = memberRef
      .collection("health")
      .collection("prescriptions");

    // Get without orderBy first, in case the field doesn't exist!
    const snapshot = await prescriptionsCollection.get();

    return snapshot.docs.map((doc) => ({
      prescriptionId: doc.id,
      ...(doc.data() as Omit<Prescription, "prescriptionId">),
    }));
  } catch (error) {
    console.error("getPrescriptions()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to fetch prescriptions.");
  }
};

export const deletePrescription = async (
  familyId: string,
  userId: string,
  prescriptionId: string,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();
  const trimmedPrescriptionId = prescriptionId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  if (!trimmedPrescriptionId) {
    throw new Error("Prescription ID is required.");
  }

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const prescriptionRef = db.doc(
      `${FAMILIES_COLLECTION}/${trimmedFamilyId}/members/${trimmedUserId}/health/prescriptions/${trimmedPrescriptionId}`,
    );

    const prescriptionSnap = await prescriptionRef.get();

    if (!prescriptionSnap.exists) {
      throw new Error("Prescription not found.");
    }

    await prescriptionRef.delete();
  } catch (error) {
    console.error("deletePrescription()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to delete prescription.");
  }
};

// Doctor Visit Operations
export const addDoctorVisit = async (
  familyId: string,
  userId: string,
  visit: Omit<DoctorVisit, "visitId" | "updatedAt">,
): Promise<string> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  if (!visit.doctor.trim()) {
    throw new Error("Doctor name is required.");
  }

  if (!visit.hospital.trim()) {
    throw new Error("Hospital name is required.");
  }

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const visitRef = db
      .collection(
        `${FAMILIES_COLLECTION}/${trimmedFamilyId}/members/${trimmedUserId}/health/visits`,
      )
      .doc();

    await visitRef.set({
      visitId: visitRef.id,

      doctor: visit.doctor.trim(),

      hospital: visit.hospital.trim(),

      diagnosis: visit.diagnosis.trim(),

      nextVisit: visit.nextVisit,

      notes: visit.notes.trim(),

      visitDate: visit.visitDate,

      createdAt: firestore.FieldValue.serverTimestamp(),

      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    return visitRef.id;
  } catch (error) {
    console.error("addDoctorVisit()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to add doctor visit.");
  }
};
export const getDoctorVisits = async (
  familyId: string,
  userId: string,
): Promise<DoctorVisit[]> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const visitsCollection = memberRef
      .collection("health")
      .collection("visits");

    const snapshot = await visitsCollection.get();

    return snapshot.docs.map((doc) => ({
      visitId: doc.id,
      ...(doc.data() as Omit<DoctorVisit, "visitId">),
    }));
  } catch (error) {
    console.error("getDoctorVisits()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to fetch doctor visits.");
  }
};

export const updateDoctorVisit = async (
  familyId: string,
  userId: string,
  visitId: string,
  updates: Partial<DoctorVisit>,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();
  const trimmedVisitId = visitId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  if (!trimmedVisitId) {
    throw new Error("Visit ID is required.");
  }

  const allowedUpdates: Partial<DoctorVisit> = {};

  if (updates.doctor !== undefined) {
    const doctorName = updates.doctor.trim();

    if (!doctorName) {
      throw new Error("Doctor name cannot be empty.");
    }

    allowedUpdates.doctor = doctorName;
  }

  if (updates.hospital !== undefined) {
    allowedUpdates.hospital = updates.hospital.trim();
  }

  if (updates.diagnosis !== undefined) {
    allowedUpdates.diagnosis = updates.diagnosis.trim();
  }

  if (updates.notes !== undefined) {
    allowedUpdates.notes = updates.notes.trim();
  }

  if (updates.visitDate !== undefined) {
    allowedUpdates.visitDate = updates.visitDate;
  }

  allowedUpdates.updatedAt = firestore.FieldValue.serverTimestamp() as any;

  try {
    const visitRef = db.doc(
      `${FAMILIES_COLLECTION}/${trimmedFamilyId}/members/${trimmedUserId}/health/visits/${trimmedVisitId}`,
    );

    const visitSnap = await visitRef.get();

    if (!visitSnap.exists) {
      throw new Error("Doctor visit not found.");
    }

    await visitRef.update(allowedUpdates);
  } catch (error) {
    console.error("updateDoctorVisit()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to update doctor visit.");
  }
};

export const deleteDoctorVisit = async (
  familyId: string,
  userId: string,
  visitId: string,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();
  const trimmedVisitId = visitId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  if (!trimmedVisitId) {
    throw new Error("Visit ID is required.");
  }

  try {
    const visitRef = db.doc(
      `${FAMILIES_COLLECTION}/${trimmedFamilyId}/members/${trimmedUserId}/health/visits/${trimmedVisitId}`,
    );

    const visitSnap = await visitRef.get();

    if (!visitSnap.exists) {
      throw new Error("Doctor visit not found.");
    }

    await visitRef.delete();
  } catch (error) {
    console.error("deleteDoctorVisit()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to delete doctor visit.");
  }
};

// Medical Expense Operations
export const addMedicalExpense = async (
  familyId: string,
  userId: string,
  expense: Omit<MedicalExpense, "expenseId" | "createdAt" | "updatedAt">,
): Promise<string> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  if (expense.amount === undefined || expense.amount < 0) {
    throw new Error("Valid expense amount is required.");
  }

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const expenseRef = db
      .collection(
        `${FAMILIES_COLLECTION}/${trimmedFamilyId}/members/${trimmedUserId}/health/expenses`,
      )
      .doc();

    await expenseRef.set({
      expenseId: expenseRef.id,
      ...expense,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    return expenseRef.id;
  } catch (error) {
    console.error("addMedicalExpense()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to add medical expense.");
  }
};

export const getMedicalExpenses = async (
  familyId: string,
  userId: string,
): Promise<MedicalExpense[]> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const expensesCollection = memberRef
      .collection("health")
      .collection("expenses");

    const snapshot = await expensesCollection.get();

    return snapshot.docs.map((doc) => ({
      expenseId: doc.id,
      ...(doc.data() as Omit<MedicalExpense, "expenseId">),
    }));
  } catch (error) {
    console.error("getMedicalExpenses()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to fetch medical expenses.");
  }
};

export const updateMedicalExpense = async (
  familyId: string,
  userId: string,
  expenseId: string,
  updates: Partial<MedicalExpense>,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();
  const trimmedExpenseId = expenseId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  if (!trimmedExpenseId) {
    throw new Error("Expense ID is required.");
  }

  const allowedUpdates: Partial<MedicalExpense> = {};

  if (updates.amount !== undefined) {
    if (updates.amount < 0) {
      throw new Error("Expense amount cannot be negative.");
    }

    allowedUpdates.amount = updates.amount;
  }

  if (updates.billDocumentId !== undefined) {
    allowedUpdates.billDocumentId = updates.billDocumentId.trim();
  }

  if (updates.paidBy !== undefined) {
    const paidBy = updates.paidBy.trim();

    if (!paidBy) {
      throw new Error("Paid By cannot be empty.");
    }

    allowedUpdates.paidBy = paidBy;
  }

  if (updates.expenseDate !== undefined) {
    allowedUpdates.expenseDate = updates.expenseDate;
  }

  if (updates.notes !== undefined) {
    allowedUpdates.notes = updates.notes.trim();
  }

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const expenseRef = db.doc(
      `${FAMILIES_COLLECTION}/${trimmedFamilyId}/members/${trimmedUserId}/health/expenses/${trimmedExpenseId}`,
    );

    const expenseSnap = await expenseRef.get();

    if (!expenseSnap.exists) {
      throw new Error("Medical expense not found.");
    }

    await expenseRef.update({
      ...allowedUpdates,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("updateMedicalExpense()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to update medical expense.");
  }
};

export const deleteMedicalExpense = async (
  familyId: string,
  userId: string,
  expenseId: string,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();
  const trimmedExpenseId = expenseId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedUserId) {
    throw new Error("User ID is required.");
  }

  if (!trimmedExpenseId) {
    throw new Error("Expense ID is required.");
  }

  try {
    const memberRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("members")
      .doc(trimmedUserId);

    const memberSnap = await memberRef.get();

    if (!memberSnap.exists) {
      throw new Error("Member not found.");
    }

    const expenseRef = db.doc(
      `${FAMILIES_COLLECTION}/${trimmedFamilyId}/members/${trimmedUserId}/health/expenses/${trimmedExpenseId}`,
    );

    const expenseSnap = await expenseRef.get();

    if (!expenseSnap.exists) {
      throw new Error("Medical expense not found.");
    }

    await expenseRef.delete();
  } catch (error) {
    console.error("deleteMedicalExpense()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to delete medical expense.");
  }
};

// Announcement Operations
export const addAnnouncement = async (
  familyId: string,
  announcement: Omit<Announcement, "announcementId" | "createdAt">,
): Promise<string> => {
  const trimmedFamilyId = familyId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!announcement.title.trim()) {
    throw new Error("Announcement title is required.");
  }

  if (!announcement.message.trim()) {
    throw new Error("Announcement message is required.");
  }

  try {
    const familyRef = db.collection(FAMILIES_COLLECTION).doc(trimmedFamilyId);

    const familySnap = await familyRef.get();

    if (!familySnap.exists) {
      throw new Error("Family not found.");
    }

    const announcementRef = familyRef.collection("announcements").doc();

    await announcementRef.set({
      announcementId: announcementRef.id,

      title: announcement.title.trim(),

      message: announcement.message.trim(),

      priority: announcement.priority,

      createdBy: announcement.createdBy,

      expiresAt: announcement.expiresAt ?? null,

      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    return announcementRef.id;
  } catch (error) {
    console.error("addAnnouncement()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to add announcement.");
  }
};

export const getAnnouncements = async (
  familyId: string,
): Promise<Announcement[]> => {
  const trimmedFamilyId = familyId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  try {
    const familyRef = db.collection(FAMILIES_COLLECTION).doc(trimmedFamilyId);

    const familySnap = await familyRef.get();

    if (!familySnap.exists) {
      throw new Error("Family not found.");
    }

    const snapshot = await familyRef
      .collection("announcements")
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      announcementId: doc.id,
      ...(doc.data() as Omit<Announcement, "announcementId">),
    }));
  } catch (error) {
    console.error("getAnnouncements()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to fetch announcements.");
  }
};

export const updateAnnouncement = async (
  familyId: string,
  announcementId: string,
  updates: Partial<Omit<Announcement, "announcementId" | "createdAt">>,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedAnnouncementId = announcementId.trim();

  if (!trimmedFamilyId || !trimmedAnnouncementId) {
    throw new Error("Family ID and Announcement ID are required.");
  }

  const allowedUpdates: Record<string, any> = {};

  if (updates.title !== undefined) {
    if (!updates.title.trim()) throw new Error("Title cannot be empty.");
    allowedUpdates.title = updates.title.trim();
  }

  if (updates.message !== undefined) {
    if (!updates.message.trim()) throw new Error("Message cannot be empty.");
    allowedUpdates.message = updates.message.trim();
  }

  if (updates.priority !== undefined) {
    allowedUpdates.priority = updates.priority;
  }

  if (updates.expiresAt !== undefined) {
    allowedUpdates.expiresAt = updates.expiresAt;
  }

  allowedUpdates.updatedAt = firestore.FieldValue.serverTimestamp();

  try {
    await db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("announcements")
      .doc(trimmedAnnouncementId)
      .update(allowedUpdates);
  } catch (error) {
    console.error("updateAnnouncement()", error);
    throw new Error("Unable to update announcement.");
  }
};

export const deleteAnnouncement = async (
  familyId: string,
  announcementId: string,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedAnnouncementId = announcementId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedAnnouncementId) {
    throw new Error("Announcement ID is required.");
  }

  try {
    const announcementRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("announcements")
      .doc(trimmedAnnouncementId);

    const announcementSnap = await announcementRef.get();

    if (!announcementSnap.exists) {
      throw new Error("Announcement not found.");
    }

    await announcementRef.delete();
  } catch (error) {
    console.error("deleteAnnouncement()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to delete announcement.");
  }
};

// Emergency Contact Operations
export const addEmergencyContact = async (
  familyId: string,
  contact: Omit<EmergencyContact, "contactId">,
): Promise<string> => {
  const trimmedFamilyId = familyId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!contact.name.trim()) {
    throw new Error("Contact name is required.");
  }

  if (!contact.phone.trim()) {
    throw new Error("Phone number is required.");
  }

  try {
    const familyRef = db.collection(FAMILIES_COLLECTION).doc(trimmedFamilyId);

    const familySnap = await familyRef.get();

    if (!familySnap.exists) {
      throw new Error("Family not found.");
    }

    const contactRef = familyRef.collection("emergencyContacts").doc();

    await db.runTransaction(async (transaction) => {
      // Check if there are any existing contacts
      const existingContacts = await familyRef
        .collection("emergencyContacts")
        .get();
      
      // Auto-set isSOSPerson to true if it's the first contact OR explicitly set
      let shouldBeSOSPerson = contact.isSOSPerson;
      if (existingContacts.docs.length === 0) {
        shouldBeSOSPerson = true;
      }

      // If this contact is SOS person, unset other SOS persons
      if (shouldBeSOSPerson) {
        const otherSOSContacts = await familyRef
          .collection("emergencyContacts")
          .where("isSOSPerson", "==", true)
          .get();
        otherSOSContacts.docs.forEach((doc) => {
          transaction.update(doc.ref, { isSOSPerson: false });
        });
      }

      transaction.set(contactRef, {
        contactId: contactRef.id,
        category: contact.category,
        name: contact.name.trim(),
        phone: contact.phone.trim(),
        address: contact.address.trim(),
        notes: contact.notes.trim(),
        isSOSPerson: shouldBeSOSPerson,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    });

    return contactRef.id;
  } catch (error) {
    console.error("addEmergencyContact()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to add emergency contact.");
  }
};

export const getEmergencyContacts = async (
  familyId: string,
): Promise<EmergencyContact[]> => {
  const trimmedFamilyId = familyId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  try {
    const familyRef = db.collection(FAMILIES_COLLECTION).doc(trimmedFamilyId);

    const familySnap = await familyRef.get();

    if (!familySnap.exists) {
      throw new Error("Family not found.");
    }

    const snapshot = await familyRef
      .collection("emergencyContacts")
      .orderBy("name")
      .get();

    return snapshot.docs.map((doc) => ({
      contactId: doc.id,
      ...(doc.data() as Omit<EmergencyContact, "contactId">),
    }));
  } catch (error) {
    console.error("getEmergencyContacts()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to fetch emergency contacts.");
  }
};

export const updateEmergencyContact = async (
  familyId: string,
  contactId: string,
  updates: Partial<EmergencyContact>,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedContactId = contactId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedContactId) {
    throw new Error("Contact ID is required.");
  }

  const allowedUpdates: Partial<EmergencyContact> = {};

  if (updates.name !== undefined) {
    const name = updates.name.trim();

    if (!name) {
      throw new Error("Contact name cannot be empty.");
    }

    allowedUpdates.name = name;
  }

  if (updates.phone !== undefined) {
    allowedUpdates.phone = updates.phone.trim();
  }

  if (updates.address !== undefined) {
    allowedUpdates.address = updates.address.trim();
  }

  if (updates.notes !== undefined) {
    allowedUpdates.notes = updates.notes.trim();
  }

  if (updates.category !== undefined) {
    allowedUpdates.category = updates.category;
  }

  if (updates.isSOSPerson !== undefined) {
    allowedUpdates.isSOSPerson = updates.isSOSPerson;
  }

  try {
    const familyRef = db.collection(FAMILIES_COLLECTION).doc(trimmedFamilyId);
    const contactRef = familyRef
      .collection("emergencyContacts")
      .doc(trimmedContactId);

    const contactSnap = await contactRef.get();

    if (!contactSnap.exists) {
      throw new Error("Emergency contact not found.");
    }

    await db.runTransaction(async (transaction) => {
      // If setting this contact as SOS person, unset other SOS persons
      if (allowedUpdates.isSOSPerson) {
        const otherSOSContacts = await familyRef
          .collection("emergencyContacts")
          .where("isSOSPerson", "==", true)
          .get();
        otherSOSContacts.docs.forEach((doc) => {
          if (doc.id !== trimmedContactId) {
            transaction.update(doc.ref, { isSOSPerson: false });
          }
        });
      }

      transaction.update(contactRef, {
        ...allowedUpdates,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    });
  } catch (error) {
    console.error("updateEmergencyContact()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to update emergency contact.");
  }
};

export const deleteEmergencyContact = async (
  familyId: string,
  contactId: string,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedContactId = contactId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedContactId) {
    throw new Error("Contact ID is required.");
  }

  try {
    const contactRef = db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("emergencyContacts")
      .doc(trimmedContactId);

    const contactSnap = await contactRef.get();

    if (!contactSnap.exists) {
      throw new Error("Emergency contact not found.");
    }

    await contactRef.delete();
  } catch (error) {
    console.error("deleteEmergencyContact()", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to delete emergency contact.");
  }
};

// Join Request Operations
export const createJoinRequest = async (
  familyId: string,
  userId: string,
  requestedBy: string,
  inviteCode: string,
  isQRScan: boolean = false, // Added to handle FR-1.7 bypass notation
): Promise<string | null> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedUserId = userId.trim();
  const trimmedRequestedBy = requestedBy.trim();
  const trimmedInviteCode = inviteCode.trim().toUpperCase();

  try {
    const familyRef = db.collection(FAMILIES_COLLECTION).doc(trimmedFamilyId);
    const familySnap = await familyRef.get();

    if (!familySnap.exists) throw new Error("Family not found.");

    const family = familySnap.data() as Family;
    if (!family.isActive) throw new Error("Family is inactive.");
    if (family.inviteCode.toUpperCase() !== trimmedInviteCode)
      throw new Error("Invalid invite code.");

    // If it's a QR scan, bypass the pending request queue and join instantly
    if (isQRScan) {
      // Re-using our secure transactional approval engine logic directly
      await approveJoinRequest(
        trimmedFamilyId,
        "QR_AUTO_APPROVE_" + trimmedUserId,
        trimmedRequestedBy,
      );
      return null; // No pending request created
    }

    // Otherwise, fall back to standard manual approval flow (FR-1.9)
    const requestRef = familyRef.collection("joinRequests").doc();
    await requestRef.set({
      requestId: requestRef.id,
      userId: trimmedUserId,
      requestedBy: trimmedRequestedBy,
      inviteCode: trimmedInviteCode,
      status: "Pending",
      createdAt: firestore.FieldValue.serverTimestamp(),
      approvedAt: null,
      approvedBy: null,
    });

    return requestRef.id;
  } catch (error) {
    console.error("createJoinRequest()", error);
    if (error instanceof Error) throw error;
    throw new Error("Unable to handle join request.");
  }
};

export const getJoinRequests = async (
  familyId: string,
): Promise<JoinRequest[]> => {
  const trimmedFamilyId = familyId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  try {
    const snapshot = await db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("joinRequests")
      .where("status", "==", "Pending")
      // .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      requestId: doc.id,
      ...(doc.data() as Omit<JoinRequest, "requestId">),
    }));
  } catch (error) {
    console.error("getJoinRequests()", error);

    if (error instanceof Error) throw error;

    throw new Error("Unable to fetch join requests.");
  }
};

export const approveJoinRequest = async (
  familyId: string,
  requestId: string,
  approvedBy: string,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedRequestId = requestId.trim();
  const trimmedApprovedBy = approvedBy.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedRequestId) {
    throw new Error("Request ID is required.");
  }

  if (!trimmedApprovedBy) {
    throw new Error("Approved by is required.");
  }

  const familyRef = db.collection(FAMILIES_COLLECTION).doc(trimmedFamilyId);
  const requestRef = familyRef.collection("joinRequests").doc(trimmedRequestId);

  try {
    await db.runTransaction(async (transaction) => {
      const familySnap = await transaction.get(familyRef);
      if (!familySnap.exists) {
        throw new Error("Family not found.");
      }

      const requestSnap = await transaction.get(requestRef);
      if (!requestSnap.exists) {
        throw new Error("Join request not found.");
      }

      const request = requestSnap.data() as JoinRequest;
      if (request.status !== "Pending") {
        throw new Error("Join request has already been processed.");
      }

      const memberRef = familyRef.collection("members").doc(request.userId);
      const memberSnap = await transaction.get(memberRef);
      if (memberSnap.exists) {
        throw new Error("User is already a family member.");
      }

      const userRef = db.collection("users").doc(request.userId);
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists) {
        throw new Error("User profile not found.");
      }

      const user = userSnap.data() || {};

      // CRITICAL FIX: Sanitized all fields to map `undefined` properties to `null` or `""`
      // This stops Firestore from crashing with "Unsupported field value: undefined"
      transaction.set(memberRef, {
        userId: request.userId,
        displayName: user.displayName ?? "",
        name: user.name ?? user.displayName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        phoneNumber: user.phoneNumber ?? user.phone ?? "",
        relation: "",
        relationship: "",
        gender: user.gender ?? "",
        dob: user.dob ?? null,
        bloodGroup: user.bloodGroup ?? "",
        address: user.address ?? "",
        profileImage: user.profileImage ?? "",
        photoURL: user.photoURL ?? "",
        isAdmin: false,
        status: "active",
        joinedAt: firestore.FieldValue.serverTimestamp(),
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      transaction.update(familyRef, {
        memberCount: firestore.FieldValue.increment(1),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      transaction.update(requestRef, {
        status: "Approved",
        approvedBy: trimmedApprovedBy,
        approvedAt: firestore.FieldValue.serverTimestamp(),
      });
    });
  } catch (error) {
    console.error("approveJoinRequest()", error);
    if (error instanceof Error) throw error;
    throw new Error("Unable to approve join request.");
  }
};

export const rejectJoinRequest = async (
  familyId: string,
  requestId: string,
): Promise<void> => {
  const trimmedFamilyId = familyId.trim();
  const trimmedRequestId = requestId.trim();

  if (!trimmedFamilyId) {
    throw new Error("Family ID is required.");
  }

  if (!trimmedRequestId) {
    throw new Error("Request ID is required.");
  }

  try {
    await db
      .collection(FAMILIES_COLLECTION)
      .doc(trimmedFamilyId)
      .collection("joinRequests")
      .doc(trimmedRequestId)
      .update({
        status: "Rejected",
        approvedAt: firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error("rejectJoinRequest()", error);

    if (error instanceof Error) throw error;

    throw new Error("Unable to reject join request.");
  }
};

// Real-time Listeners
export const subscribeToMembers = (
  familyId: string,
  callback: (members: FamilyMember[]) => void,
): (() => void) => {
  const membersRef = db.collection(
    `${FAMILIES_COLLECTION}/${familyId}/members`,
  );

  const unsubscribe = membersRef.onSnapshot((snapshot: any) => {
    const members = snapshot.docs.map((doc: any) => doc.data() as FamilyMember);
    callback(members);
  });

  return unsubscribe;
};

export const subscribeToAnnouncements = (
  familyId: string,
  callback: (announcements: Announcement[]) => void,
): (() => void) => {
  const announcementsRef = db.collection(
    `${FAMILIES_COLLECTION}/${familyId}/announcements`,
  );

  const unsubscribe = announcementsRef
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot: any) => {
      const announcements = snapshot.docs.map(
        (doc: any) =>
          ({ announcementId: doc.id, ...doc.data() } as Announcement),
      );
      callback(announcements);
    });

  return unsubscribe;
};

export const subscribeToJoinRequests = (
  familyId: string,
  callback: (requests: JoinRequest[]) => void,
): (() => void) => {
  const joinRequestsRef = db.collection(
    `${FAMILIES_COLLECTION}/${familyId}/joinRequests`,
  );

  const unsubscribe = joinRequestsRef
    .where("status", "==", "Pending")
    .onSnapshot((snapshot: any) => {
      const requests = snapshot.docs.map(
        (doc: any) => ({ requestId: doc.id, ...doc.data() } as JoinRequest),
      );
      callback(requests);
    });

  return unsubscribe;
};

// Utility Functions
const generateInviteCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const generateUniqueInviteCode = async (): Promise<string> => {
  while (true) {
    const inviteCode = generateInviteCode();

    const snapshot = await db
      .collection(FAMILIES_COLLECTION)
      .where("inviteCode", "==", inviteCode)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return inviteCode;
    }
  }
};

export const validateInviteCode = async (
  inviteCode: string,
): Promise<string | null> => {
  const familiesRef = db.collection(FAMILIES_COLLECTION);
  const snapshot = await familiesRef
    .where("inviteCode", "==", inviteCode)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].id;
};
