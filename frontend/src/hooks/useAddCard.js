import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";

const useAddCard = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { setAuthUser } = useAuthContext();

    const addCard = async (color, password, phoneNumber,validYear,title) => {
        try {
            setLoading(true);
            const response = await fetch('/bank/addCard', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({color, password, phoneNumber ,validYear,title})
            });

            const json = await response.json();

            if (!response.ok) {
                if (json.error == 'expired' || json.error == 'No token provided'){
                    setAuthUser(null);
                    localStorage.removeItem('user');
                }else{
                    setError(json.error);
                    setSuccess(false);
                }

            } else {
                setError(null);
                setSuccess(true);
                localStorage.setItem('user', JSON.stringify(json));
                setAuthUser(json);
            }
        } catch (err) {
            console.log(err);
            setError("Something went wrong");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return { addCard, error, loading, success, setSuccess };
};

export default useAddCard;
