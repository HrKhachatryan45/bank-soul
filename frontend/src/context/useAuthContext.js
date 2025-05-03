import {useState} from "react";

const {useContext, createContext} = require("react");

export const AuthContext = createContext();

export  const useAuthContext = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState( JSON.parse(localStorage.getItem('user')) || null);
    return <AuthContext.Provider value={{authUser,setAuthUser}}>{children}</AuthContext.Provider>;
}
