export interface Note {
  id: string;
  text: string;
}

export type RootStackParamList = {
  Home: undefined;
  Profile: {userId: string};
  Details: undefined;
};
