import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Library: undefined;
  NovelDetails: { novelId: string };
  AddContent: undefined;
  Reader: { novelId: string; chapterNumber: number };
  Settings: undefined;
  EditNovel: { novelId: string };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 