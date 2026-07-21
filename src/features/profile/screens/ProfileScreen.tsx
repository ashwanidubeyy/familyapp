import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { ModuleStackParamList } from "@/types";
import { ModuleScaffold } from "@/components";

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ModuleStackParamList>>();

  return (
    <ModuleScaffold
      title="Profile"
      summary="Account, family QR code, members, notification preferences, and security settings."
      actions={[
        {
          title: "Account",
          summary: "Edit your account details.",
        },
        {
          title: "Family QR Code",
          summary: "View and share your family's QR code.",
          onPress: () =>
            navigation.navigate("FamilyQRCode", {
              familyName: "",
              inviteCode: "",
              size: 220,
            }),
        },
        {
          title: "Security",
          summary: "Manage biometric authentication and logout.",
        },
      ]}
    />
  );
};
