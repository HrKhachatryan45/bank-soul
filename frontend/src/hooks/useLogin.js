import {useState} from "react";
import {useAuthContext} from "../context/useAuthContext";

const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {setAuthUser} = useAuthContext()
    const login = async (username,password) => {
        const validationError = checkErrors(username, password);
        if (validationError) {
            setError(validationError);
            return;
        } else {
            setError(null);
        }
        try {
            setLoading(true);

            const response = await fetch(`/auth/login`,{
                method: "POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({username,password})
            })
            const json = await response.json();

            if (!response.ok){
                console.log(json,'ks0')
                setError(json.error)
            }else{
                setAuthUser(json)
                localStorage.setItem('user',JSON.stringify(json));
            }
        }catch (err) {
            console.log(err)
            setError(err)
        }finally {
            setLoading(false);
        }
    }
    return {login,loading,error};
}

const checkErrors = (username,password) => {
    if (!username || !password ) {
        return "All fields must be filled!"
    }
}

export default useRegister;