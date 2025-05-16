import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  ReactNode,
} from 'react';

interface UserLogin {
  uid: string;
  email: string;
  name: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface AppState {
  userLogin: UserLogin | null;
  cartItems: CartItem[];
  foodCategories: string[];
}

const initialState: AppState = {
  userLogin: null,
  cartItems: [],
  foodCategories: ['Chinese', 'South Indian', 'North Indian', 'Beverages'],
};


type Action =
  | {type: 'LOGIN'; payload: {uid: string; email: string}}
  | {type: 'LOGOUT'}
  | {type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'>}
  | {type: 'UPDATE_QUANTITY'; payload: {id: string; quantity: number}}
  | {type: 'REMOVE_FROM_CART'; payload: {id: string}}
  | {type: 'CLEAR_CART'};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN':
      const name = action.payload.email.split('@')[0];
      return {
        ...state,
        userLogin: {uid: action.payload.uid, email: action.payload.email, name},
      };
    case 'LOGOUT':
      return {
        ...state,
        userLogin: null,
      };
    case 'ADD_TO_CART':
      const existingItemIndex = state.cartItems.findIndex(
        item => item.id === action.payload.id,
      );
      if (existingItemIndex >= 0) {
        const updatedCartItems = state.cartItems.map((item, index) =>
          index === existingItemIndex
            ? {...item, quantity: item.quantity + 1}
            : item,
        );
        return {...state, cartItems: updatedCartItems};
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, {...action.payload, quantity: 1}],
        };
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id
            ? {...item, quantity: action.payload.quantity}
            : item,
        ),
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(
          item => item.id !== action.payload.id,
        ),
      };
    case 'CLEAR_CART':
      return {...state, cartItems: []};
    default:
      return state;
  }
};

interface MyContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const MyContext = createContext<MyContextValue | undefined>(undefined);

MyContext.displayName = 'My Store';

interface MyProviderProps {
  children: ReactNode;
}

const MyProvider: React.FC<MyProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(() => {
    return {state, dispatch};
  }, [state, dispatch]);

  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  );
};

const useMyContext = (): MyContextValue => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};

export {MyProvider, useMyContext};
