
import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { GradientPageView } from "@/components";
import { useTheme } from "@/hooks";
import { useAuth } from "@/features/auth";
import { HealthRecords } from "../components/HealthRecords";
import { FamilyMember } from "../types/familyTypes";
import { getMember, getAllMembers } from "../services/familyService";
import { createFamilyMainStyles } from "./styles";

export const HealthScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = createFamilyMainStyles(theme);
  const [currentMember, setCurrentMember] = useState<FamilyMember | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMember = async () => {
      if (!user || !user.familyId) {
        setLoading(false);
        return;
      }
      try {
        // First try to get current user member data
        const member = await getMember(user.familyId, user.uid);
        if (member) {
          setCurrentMember(member);
        } else {
          // If not found, get first member
          const members = await getAllMembers(user.familyId);
          if (members.length > 0) {
            setCurrentMember(members[0]);
          }
        }
      } catch (error) {
        console.error("Error loading member data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [user]);

  if (!user || !user.familyId || !currentMember) {
    return null;
  }

  return (
    <GradientPageView scroll showsVerticalScrollIndicator={false}>
      <View style={[styles.section, { paddingTop: 20 }]}>
        <HealthRecords familyId={user.familyId} member={currentMember} />
      </View>
      <View style={styles.bottomSpacer} />
    </GradientPageView>
  );
};
