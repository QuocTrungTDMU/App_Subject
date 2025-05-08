export interface Note {
  id: string;
  text: string;
  title: string;
  createdAt: {seconds: number; nanoseconds: number} | any;
}

export type RootStackParamList = {
  Home: undefined;
  AddNote: {note?: Note} | undefined;
  Detail: {note: Note};
};
