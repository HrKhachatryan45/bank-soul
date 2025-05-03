import {useState} from "react";
import {useAuthContext} from "../context/useAuthContext";

const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {setAuthUser} = useAuthContext();
    const register = async ({fname,lname,username,password,confirmPassword}) => {
        const validationError = checkErrors(fname, lname, username, password, confirmPassword);
        if (validationError) {
            setError(validationError);
            return;
        } else {
            setError(null);
        }
        try {
            setLoading(true);

            const response = await fetch(`/auth/register`,{
                method: "POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({fname,lname,username,password,confirmPassword})
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
    return {register,loading,error};
}

const checkErrors = (fname,lname,username,password,confirmPassword) => {
    if (!fname || !lname || !username || !password || !confirmPassword) {
        return "All fields must be filled!"
    }
}

export default useRegister;