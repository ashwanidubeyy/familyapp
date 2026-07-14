import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";

import { ModuleStackParamList } from "@/types";
import { FamilyQRCode } from "./FamilyQRCode";
import { useAuth } from "@/features/auth";

type RouteProps = RouteProp<ModuleStackParamList, "FamilyQRCode">;

export const FamilyQRCodeScreen = () => {
  const { familyName, size } = useRoute<RouteProps>().params;
  const { user } = useAuth();
  console.log("user", user);

  return (
    <FamilyQRCode
      familyName={familyName}
      inviteCode={String(user?.inviteCode)}
      size={size}
    />
  );
};
