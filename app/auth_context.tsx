import { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
    userData: any;
    setUserData: (user: any) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState<any>(null);

    return (
        <AuthContext.Provider value={{ userData, setUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
