import {useState} from "react";
import {useAuthContext} from "../context/useAuthContext";

const usePayLoan = () => {

    const {setAuthUser} = useAuthContext();
    const [error, setError] = useState(null);
    const payLoan = async (loanId) => {
        try {
            const response = await fetch(`/bank/payLoan?loanId=${loanId}`,{
                method: "POST",
                headers: {"Content-Type": "application/json"}
            });

            const json = await response.json();

            if (!response.ok){
                console.log(json)
                if (json.error == 'expired' || json.error == 'No token provided'){
                    setAuthUser(null);
                    localStorage.removeItem('user');
                }else {
                    setError(json.error)
                }
            }else {
                localStorage.setItem('user',JSON.stringify(json));
                setAuthUser(json);
                setError(null);
            }


        }catch(error){
            console.log(error)
            setError(error)
        }
    }
    return {payLoan,error};
}
export default usePayLoan;