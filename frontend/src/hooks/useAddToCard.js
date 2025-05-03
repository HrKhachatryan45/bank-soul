import {useState} from "react";
import {useAuthContext} from "../context/useAuthContext";

const useAddToCard = () => {

    const [loadingM, setLoadingM] = useState(false);
    const [errorM, setErrorM] = useState(null);
    const [successM, setSuccessM] = useState(false);
    const {setAuthUser} = useAuthContext();

    const addToCard = async (amount,digits16,cardSenderDigits16) => {
        if (isNaN(Number(amount))){
            setErrorM('Enter number');
            return ;
        }
        try {
            console.log(cardSenderDigits16)
            setLoadingM(true);
            const response = await fetch('/bank/addToCardBalance',{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({amount:Number(amount),digits16,cardSenderDigits16})
            });

            const json = await response.json();

            if (!response.ok){
                if (json.error == 'expired' || json.error == 'No token provided'){
                    setAuthUser(null);
                    localStorage.removeItem('user');
                }else {
                    setErrorM(json.error);
                    setSuccessM(false)
                }
            }else {
                localStorage.setItem('user',JSON.stringify(json));
                setAuthUser(json);
                setErrorM(null)
                setSuccessM(true)
            }


        }catch(error){
            console.log(error)
            setErrorM(error)
            setSuccessM(false)
        }finally {
            setLoadingM(false);
        }
    }
    return {addToCard,loadingM,errorM,successM,setSuccessM};
}
export default useAddToCard;