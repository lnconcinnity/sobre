import { createContext, useContext } from "react";
import { 
    User as FirebaseUser 
} from "firebase/auth";
import { UserProfile } from "../types/userSchema";

export interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    firebaseUser: FirebaseUser | null;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    firebaseUser: null,
});

export const useAuth = () => useContext(AuthContext);
