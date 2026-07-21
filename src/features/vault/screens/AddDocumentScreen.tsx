import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  type RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { pick, types } from "@react-native-documents/picker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { Camera, FileText, FileUp, ImagePlus } from "lucide-react-native";

import { AppHeader, GradientPageView } from "@/components";
import { useAuth } from "@/features/auth";
import { useTheme } from "@/hooks";
import type { Theme, VaultStackParamList } from "@/types";
import type { VaultVisibility } from "@/domain";

import { useVaultModule } from "../hooks";
import { uploadFileToImageKit } from "../services/uploadservice";
import { vaultFirestoreService } from "../services/firestoreService";

interface UploadedFile {
  url: string;
  fileId?: string;
  fileType?: string;
  size?: number;
  name?: string;
}

export const AddDocumentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<VaultStackParamList, "AddDocument">>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { masterData } = useVaultModule();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const initialCategory =
    route.params?.categoryName ?? masterData.documentCategories[0]?.name ?? "";
  const [name, setName] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [assetId, setAssetId] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [reminder, setReminder] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [vaultType, setVaultType] = useState<VaultVisibility>("private");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [saving, setSaving] = useState(false);

  const uploadImageFromLibrary = async () => {
    const response = await launchImageLibrary({ mediaType: "photo" });
    const asset = response.assets?.[0];

    if (!asset?.uri) {
      return;
    }

    const result = (await uploadFileToImageKit({
      uri: asset.uri,
      type: asset.type,
      fileName: asset.fileName,
      size: asset.fileSize,
    })) as UploadedFile;
    setUploadedFile({
      url: result.url,
      fileId: result.fileId,
      fileType: asset.type ?? result.fileType,
      size: asset.fileSize ?? result.size,
      name: asset.fileName ?? result.name,
    });
  };

  const captureImage = async () => {
    const response = await launchCamera({ mediaType: "photo" });
    const asset = response.assets?.[0];

    if (!asset?.uri) {
      return;
    }

    const result = (await uploadFileToImageKit({
      uri: asset.uri,
      type: asset.type,
      fileName: asset.fileName,
      size: asset.fileSize,
    })) as UploadedFile;
    setUploadedFile({
      url: result.url,
      fileId: result.fileId,
      fileType: asset.type ?? result.fileType,
      size: asset.fileSize ?? result.size,
      name: asset.fileName ?? result.name,
    });
  };

  const uploadPdf = async () => {
    const file: any = await pick({
      type: [types.pdf],
    });
    const result = (await uploadFileToImageKit({
      uri: file.uri,
      type: file.type,
      fileName: file.name,
      size: file.size,
    })) as UploadedFile;
    setUploadedFile({
      url: result.url,
      fileId: result.fileId,
      fileType: file.type ?? result.fileType,
      size: file.size ?? result.size,
      name: file.name ?? result.name,
    });
  };

  const save = async () => {
    if (!name.trim() || !category.trim()) {
      Alert.alert(
        "Missing details",
        "Document name and category are required.",
      );
      return;
    }

    if (!uploadedFile?.url) {
      Alert.alert("Upload required", "Upload or capture a file before saving.");
      return;
    }

    setSaving(true);
    try {
      await vaultFirestoreService.saveDocument({
        name,
        category,
        categoryName: category,
        url: uploadedFile.url,
        fileId: uploadedFile.fileId,
        fileType: uploadedFile.fileType,
        size: uploadedFile.size,
        vaultType,
        familyId: user?.familyId,
        expiryDate,
        reminder,
        description,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        assetId: category.toLowerCase() === "maintenance" ? assetId : null,
      });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <GradientPageView scroll>
      <View style={styles.content}>
        <AppHeader title="Add Document" leftIcon={FileText} />
        <Field label="Document Name *" value={name} onChangeText={setName} />
        <Field label="Category *" value={category} onChangeText={setCategory} />
        {category.toLowerCase() === "maintenance" ? (
          <Field
            label="Asset / Appliance"
            value={assetId}
            onChangeText={setAssetId}
          />
        ) : null}
        <Field
          label="Expiry Date"
          value={expiryDate}
          onChangeText={setExpiryDate}
        />
        <Field label="Reminder" value={reminder} onChangeText={setReminder} />
        <Field
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Field label="Tags" value={tags} onChangeText={setTags} />
        <View style={styles.segment}>
          <Pressable
            style={[
              styles.segmentButton,
              vaultType === "private" && styles.segmentButtonActive,
            ]}
            onPress={() => setVaultType("private")}
          >
            <Text style={styles.segmentText}>Private</Text>
          </Pressable>
          <Pressable
            style={[
              styles.segmentButton,
              vaultType === "public" && styles.segmentButtonActive,
            ]}
            onPress={() => setVaultType("public")}
          >
            <Text style={styles.segmentText}>Public</Text>
          </Pressable>
        </View>
        <View style={styles.uploadGrid}>
          <UploadButton
            title="Upload Image"
            icon={ImagePlus}
            onPress={uploadImageFromLibrary}
          />
          <UploadButton
            title="Capture Image"
            icon={Camera}
            onPress={captureImage}
          />
          <UploadButton title="Upload PDF" icon={FileUp} onPress={uploadPdf} />
        </View>
        {uploadedFile ? (
          <Text style={styles.uploadedText}>
            {uploadedFile.name ?? "File uploaded"}
          </Text>
        ) : null}
        <Pressable style={styles.saveButton} onPress={save} disabled={saving}>
          <Text style={styles.saveText}>{saving ? "Saving..." : "Save"}</Text>
        </Pressable>
      </View>
    </GradientPageView>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
}> = (props) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        multiline={props.multiline}
        style={props.multiline ? styles.inputMultiline : styles.input}
        placeholderTextColor={theme.colors.placeholder}
      />
    </View>
  );
};

const UploadButton: React.FC<{
  title: string;
  icon: React.ComponentType<{
    size: number;
    color: string;
    strokeWidth: number;
  }>;
  onPress: () => void;
}> = ({ title, icon: Icon, onPress }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <Pressable
      accessibilityRole="button"
      style={styles.uploadButton}
      onPress={onPress}
    >
      <Icon size={20} color={theme.colors.primary} strokeWidth={2.4} />
      <Text style={styles.uploadText}>{title}</Text>
    </Pressable>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      gap: theme.spacing.md,
    },
    field: {
      gap: theme.spacing.xs,
    },
    label: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
    },
    input: {
      minHeight: 52,
      borderRadius: 16,
      paddingHorizontal: theme.spacing.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    inputMultiline: {
      minHeight: 96,
      borderRadius: 16,
      padding: theme.spacing.md,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      textAlignVertical: "top",
    },
    segment: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    segmentButton: {
      flex: 1,
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
      backgroundColor: theme.colors.card,
    },
    segmentButtonActive: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    segmentText: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
    },
    uploadGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    uploadButton: {
      width: "48%",
      minHeight: 58,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
      borderRadius: 16,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    uploadText: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xs,
    },
    uploadedText: {
      color: theme.colors.success,
      fontFamily: theme.typography.fontFamily.bold,
    },
    saveButton: {
      minHeight: 54,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 18,
      backgroundColor: theme.colors.primary,
    },
    saveText: {
      color: theme.colors.textInverse,
      fontFamily: theme.typography.fontFamily.bold,
    },
  });
