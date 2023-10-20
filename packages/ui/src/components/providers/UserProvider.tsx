import { Auth, Hub } from 'aws-amplify';
import React, { createContext, useState, ReactNode, useEffect } from 'react';

export const UserContext = createContext({
    getUserIDToken: () => { },
    getUserAccessToken: () => { },
    setLoggedUser: (user: any) => { },
    user: undefined,
});

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [currentUser, setCurrentUser] = useState<any>(undefined);

    useEffect(() => {
        const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
            switch (event) {
                case "signIn":
                    setCurrentUser(data);
                    break;
                case "signOut":
                    setCurrentUser(null);
                    break;
                // case "customOAuthState":
                //   setCustomState(data);
            }
        });

        getUser();

        return unsubscribe;
    }, []);

    const getUser = async (): Promise<void> => {
        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            setLoggedUser(currentUser);
        } catch (error) {
            console.error(error);
            console.log("Not signed in");
        }
    };

    function getUserIDToken() {
        return currentUser?.signInUserSession.idToken.jwtToken;
    }

    function getUserAccessToken() {
        return currentUser?.signInUserSession.accessToken.jwtToken;
    }

    function setLoggedUser(newUser: any) {
        setCurrentUser(newUser);
    }

    return (
        <UserContext.Provider value={{ getUserIDToken, getUserAccessToken, setLoggedUser, user: currentUser }}>
            {children}
        </UserContext.Provider>
    );
};