export interface Note {
  id: string;
  text: string;
  title: string;
  createdAt: {seconds: number; nanoseconds: number} | any;
}

export type RootStackParamList = {
  AddNote: {note?: Note} | undefined;
  Detail: {note: Note};
  Login: undefined;
  Cart: undefined;
  ForgotPassword: undefined;
  CreateNewAccount: undefined;
  Homepage: undefined;
  FoodList: {category: string};
  FoodDetail: {foodId: string};
};

export interface Task {
  id: string;
  title: string;
  text: string;
  createdAt: any;
  updatedAt?: any;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: any;
}
