import { TextInput, View, type KeyboardTypeOptions, type TextInputProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string | null;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  maxLength?: number;
  multiline?: boolean;
  editable?: boolean;
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  error,
  keyboardType,
  autoCapitalize = 'sentences',
  autoComplete,
  maxLength,
  multiline = false,
  editable = true,
}: FieldProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.space(2) }}>
      <Text variant="small" tone="muted">
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.color.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        maxLength={maxLength}
        multiline={multiline}
        editable={editable}
        style={{
          backgroundColor: editable ? theme.color.surfaceAlt : theme.color.background,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: error ? theme.color.danger : 'transparent',
          paddingHorizontal: theme.space(4),
          paddingVertical: theme.space(3.5),
          minHeight: multiline ? 110 : undefined,
          textAlignVertical: multiline ? 'top' : 'center',
          fontSize: theme.font.h3,
          color: editable ? theme.color.text : theme.color.textMuted,
        }}
      />

      {error ? (
        <Text variant="small" tone="danger">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="small" tone="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
