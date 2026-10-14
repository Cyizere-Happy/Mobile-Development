import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { createElement, useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

const GENDERS = ['Male', 'Female', 'Other'] as const;
const COUNTRIES = ['Rwanda', 'Kenya', 'Uganda', 'Tanzania', 'Other'];
const INTERESTS = ['Sports', 'Music', 'Coding', 'Travel', 'Art'];
const SWATCHES = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#000000', '#ffffff'];

const isWeb = Platform.OS === 'web';

type Picked = { uri: string; name: string; size?: number; mimeType?: string };

export default function FormScreen() {
  const theme = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState<string>('');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [interests, setInterests] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [volume, setVolume] = useState(50);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [alarmTime, setAlarmTime] = useState<Date | null>(null);
  const [color, setColor] = useState('#1e88e5');
  const [files, setFiles] = useState<Picked[]>([]);
  const [photo, setPhoto] = useState<Picked | null>(null);
  const [cameraPhoto, setCameraPhoto] = useState<Picked | null>(null);

  const inputStyle = [styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }];
  const placeholderColor = theme.textSecondary;

  const toggleInterest = (item: string) =>
    setInterests((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));

  const pickDocuments = async () => {
    const result = await DocumentPicker.getDocumentAsync({ multiple: true });
    if (result.canceled) return;
    setFiles(
      result.assets.map((a) => ({ uri: a.uri, name: a.name, size: a.size, mimeType: a.mimeType })),
    );
  };

  const toPicked = (a: ImagePicker.ImagePickerAsset): Picked => ({
    uri: a.uri,
    name: a.fileName ?? a.uri.split('/').pop() ?? 'image',
    size: a.fileSize,
    mimeType: a.mimeType,
  });

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) setPhoto(toPicked(result.assets[0]));
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      console.log('Camera permission denied');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) setCameraPhoto(toPicked(result.assets[0]));
  };

  const openDateTime = (
    mode: 'date' | 'time',
    value: Date | null,
    onChange: (d: Date) => void,
  ) => {
    DateTimePickerAndroid.open({
      value: value ?? new Date(),
      mode,
      onChange: (_e, d) => d && onChange(d),
    });
  };

  const handleSubmit = () => {
    console.log({
      fullName,
      email,
      password,
      age,
      phone,
      website,
      bio,
      gender,
      country,
      interests,
      agreeTerms,
      subscribe,
      volume,
      quantity,
      rating,
      birthDate: birthDate?.toISOString() ?? null,
      alarmTime: alarmTime?.toISOString() ?? null,
      color,
      files,
      photo,
      cameraPhoto,
    });
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText type="subtitle">Form</ThemedText>

          <Field label="Full name (text)">
            <TextInput
              style={inputStyle}
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              placeholderTextColor={placeholderColor}
            />
          </Field>

          <Field label="Email">
            <TextInput
              style={inputStyle}
              value={email}
              onChangeText={setEmail}
              placeholder="john@example.com"
              placeholderTextColor={placeholderColor}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Field>

          <Field label="Password">
            <View style={styles.row}>
              <TextInput
                style={[inputStyle, styles.flex]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={placeholderColor}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Button label={showPassword ? 'Hide' : 'Show'} onPress={() => setShowPassword((s) => !s)} />
            </View>
          </Field>

          <Field label="Age (number)">
            <TextInput
              style={inputStyle}
              value={age}
              onChangeText={setAge}
              placeholder="21"
              placeholderTextColor={placeholderColor}
              keyboardType="number-pad"
            />
          </Field>

          <Field label="Phone">
            <TextInput
              style={inputStyle}
              value={phone}
              onChangeText={setPhone}
              placeholder="+250 700 000 000"
              placeholderTextColor={placeholderColor}
              keyboardType="phone-pad"
            />
          </Field>

          <Field label="Website (URL)">
            <TextInput
              style={inputStyle}
              value={website}
              onChangeText={setWebsite}
              placeholder="https://example.com"
              placeholderTextColor={placeholderColor}
              keyboardType="url"
              autoCapitalize="none"
            />
          </Field>

          <Field label="Bio (multiline)">
            <TextInput
              style={[inputStyle, styles.multiline]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              placeholderTextColor={placeholderColor}
              multiline
              textAlignVertical="top"
            />
          </Field>

          <Field label="Gender (radio buttons)">
            <View style={styles.wrap}>
              {GENDERS.map((g) => (
                <Pressable key={g} onPress={() => setGender(g)} style={styles.row}>
                  <View style={[styles.radio, { borderColor: theme.text }]}>
                    {gender === g && <View style={[styles.radioDot, { backgroundColor: theme.text }]} />}
                  </View>
                  <ThemedText>{g}</ThemedText>
                </Pressable>
              ))}
            </View>
          </Field>

          <Field label="Country (dropdown)">
            <View style={[styles.pickerBox, { backgroundColor: theme.backgroundElement }]}>
              <Picker
                selectedValue={country}
                onValueChange={(v) => setCountry(String(v))}
                style={{ color: theme.text }}
                dropdownIconColor={theme.text}>
                {COUNTRIES.map((c) => (
                  <Picker.Item key={c} label={c} value={c} />
                ))}
              </Picker>
            </View>
          </Field>

          <Field label="Interests (checkboxes)">
            <View style={styles.wrap}>
              {INTERESTS.map((item) => {
                const checked = interests.includes(item);
                return (
                  <Pressable key={item} onPress={() => toggleInterest(item)} style={styles.row}>
                    <View style={[styles.checkbox, { borderColor: theme.text }, checked && { backgroundColor: theme.text }]}>
                      {checked && <ThemedText style={{ color: theme.background, fontSize: 12 }}>✓</ThemedText>}
                    </View>
                    <ThemedText>{item}</ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="Volume (slider)">
            <View style={styles.row}>
              <Slider
                style={styles.flex}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={volume}
                onValueChange={setVolume}
              />
              <ThemedText>{Math.round(volume)}</ThemedText>
            </View>
          </Field>

          <Field label="Quantity (stepper)">
            <View style={styles.row}>
              <Button label="−" onPress={() => setQuantity((q) => Math.max(0, q - 1))} />
              <ThemedText style={styles.stepValue}>{quantity}</ThemedText>
              <Button label="+" onPress={() => setQuantity((q) => q + 1)} />
            </View>
          </Field>

          <Field label="Rating (stars)">
            <View style={styles.row}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable key={n} onPress={() => setRating(n === rating ? 0 : n)}>
                  <ThemedText style={styles.star}>{n <= rating ? '★' : '☆'}</ThemedText>
                </Pressable>
              ))}
            </View>
          </Field>

          <Field label="Date of birth (date picker)">
            {isWeb ? (
              <WebInput type="date" value={birthDate?.toISOString().slice(0, 10) ?? ''} onChange={(v) => setBirthDate(v ? new Date(v) : null)} theme={theme} />
            ) : Platform.OS === 'ios' ? (
              <View style={styles.alignStart}>
                <DateTimePicker mode="date" value={birthDate ?? new Date()} onChange={(_e, d) => d && setBirthDate(d)} />
              </View>
            ) : (
              <Button label={birthDate?.toDateString() ?? 'Pick a date'} onPress={() => openDateTime('date', birthDate, setBirthDate)} />
            )}
          </Field>

          <Field label="Alarm (time picker)">
            {isWeb ? (
              <WebInput type="time" value={alarmTime ? alarmTime.toTimeString().slice(0, 5) : ''} onChange={(v) => {
                if (!v) return setAlarmTime(null);
                const [h, m] = v.split(':').map(Number);
                const d = new Date();
                d.setHours(h, m, 0, 0);
                setAlarmTime(d);
              }} theme={theme} />
            ) : Platform.OS === 'ios' ? (
              <View style={styles.alignStart}>
                <DateTimePicker mode="time" value={alarmTime ?? new Date()} onChange={(_e, d) => d && setAlarmTime(d)} />
              </View>
            ) : (
              <Button label={alarmTime?.toLocaleTimeString() ?? 'Pick a time'} onPress={() => openDateTime('time', alarmTime, setAlarmTime)} />
            )}
          </Field>

          <Field label="Favorite color (color picker)">
            {isWeb && <WebInput type="color" value={color} onChange={setColor} theme={theme} />}
            <View style={styles.wrap}>
              {SWATCHES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setColor(c)}
                  style={[styles.swatch, { backgroundColor: c, borderColor: color === c ? theme.text : theme.textSecondary, borderWidth: color === c ? 3 : 1 }]}
                />
              ))}
            </View>
            <View style={styles.row}>
              <View style={[styles.swatch, { backgroundColor: color, borderColor: theme.textSecondary }]} />
              <TextInput
                style={[inputStyle, styles.flex]}
                value={color}
                onChangeText={setColor}
                placeholder="#RRGGBB"
                placeholderTextColor={placeholderColor}
                autoCapitalize="none"
              />
            </View>
          </Field>

          <Field label="Upload files (file picker)">
            <Button label="Choose files" onPress={pickDocuments} />
            {files.map((f) => (
              <ThemedText key={f.uri} type="small">
                {f.name}
                {f.size != null ? ` (${Math.round(f.size / 1024)} KB)` : ''}
              </ThemedText>
            ))}
          </Field>

          <Field label="Profile photo (image from gallery)">
            <Button label="Choose from gallery" onPress={pickPhoto} />
            {photo && <Image source={{ uri: photo.uri }} style={styles.preview} contentFit="cover" />}
          </Field>

          <Field label="Take a picture (camera)">
            <Button label="Open camera" onPress={takePhoto} />
            {cameraPhoto && <Image source={{ uri: cameraPhoto.uri }} style={styles.preview} contentFit="cover" />}
          </Field>

          <View style={[styles.row, styles.between]}>
            <ThemedText>Subscribe to newsletter (switch)</ThemedText>
            <Switch value={subscribe} onValueChange={setSubscribe} />
          </View>

          <Pressable onPress={() => setAgreeTerms((a) => !a)} style={styles.row}>
            <View style={[styles.checkbox, { borderColor: theme.text }, agreeTerms && { backgroundColor: theme.text }]}>
              {agreeTerms && <ThemedText style={{ color: theme.background, fontSize: 12 }}>✓</ThemedText>}
            </View>
            <ThemedText>I agree to the terms</ThemedText>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [styles.submit, { backgroundColor: theme.text, opacity: pressed ? 0.7 : 1 }]}>
            <ThemedText style={{ color: theme.background, fontWeight: '600' }}>Submit</ThemedText>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <ThemedText type="small">{label}</ThemedText>
      {children}
    </View>
  );
}

function Button({ label, onPress }: { label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: theme.backgroundSelected, opacity: pressed ? 0.7 : 1 }]}>
      <ThemedText>{label}</ThemedText>
    </Pressable>
  );
}

/** Native HTML input (web only): gives real date, time and color pickers in the browser. */
function WebInput({
  type,
  value,
  onChange,
  theme,
}: {
  type: 'date' | 'time' | 'color';
  value: string;
  onChange: (value: string) => void;
  theme: ReturnType<typeof useTheme>;
}) {
  return createElement('input', {
    type,
    value,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    style: {
      padding: 10,
      borderRadius: 12,
      border: 'none',
      fontSize: 16,
      backgroundColor: theme.backgroundElement,
      color: theme.text,
      alignSelf: 'flex-start',
    },
  });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 48, paddingBottom: 64, gap: 20 },
  field: { gap: 8 },
  flex: { flex: 1 },
  input: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  multiline: { minHeight: 100 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  between: { justifyContent: 'space-between' },
  alignStart: { alignItems: 'flex-start' },
  button: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, alignSelf: 'flex-start' },
  pickerBox: { borderRadius: 12, overflow: 'hidden' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  stepValue: { minWidth: 32, textAlign: 'center' },
  star: { fontSize: 32, lineHeight: 38 },
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 1 },
  preview: { width: 140, height: 140, borderRadius: 12 },
  submit: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
});
