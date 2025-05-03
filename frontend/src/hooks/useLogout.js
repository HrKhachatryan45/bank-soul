import {useState} from "react";
import {useAuthContext} from "../context/useAuthContext";

const useLogout = () => {
    const {setAuthUser} = useAuthContext();
    const logout = async () => {
        try {
            const response = await fetch(`/auth/logout`,{
                method: "POST",
                headers:{'Content-Type': 'application/json'},
            })

            const json = await response.json();

                if (response.ok){
                    setAuthUser(null)
                    localStorage.removeItem('user')
                }
        }catch (err) {
            console.log(err)
        }
    }
    return {logout};
}


export default useLogout;