import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import { Models } from 'react-native-appwrite';
import { getCurrentUser } from '@/lib/appwrite'; // Importez la fonction getCurrentUser

// Définition des types pour le contexte global
type GlobalContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: Models.Document | null;
  setUser: (user: Models.Document | null) => void;
  isLoading: boolean;
};

// Création du contexte avec une valeur par défaut vide
const GlobalContext = createContext<GlobalContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
  isLoading: true,
});

// Composant fournisseur du contexte global
const GlobalProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<Models.Document | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();

        if (res) {
          setIsLoggedIn(true);

          setUser(res as Models.Document);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Hook personnalisé pour consommer le contexte
export const useGlobalContext = (): GlobalContextType =>
  useContext(GlobalContext);

export { GlobalProvider, GlobalContext };
