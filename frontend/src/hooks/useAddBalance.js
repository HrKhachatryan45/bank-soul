import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";

const useAddBalance = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { setAuthUser } = useAuthContext();

    const addBalance = async (amount) => {
        if (isNaN(Number(amount))) {
            setError('Enter number');
            return;
        }
        try {
            setLoading(true);
            const response = await fetch('/bank/addBalance', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Number(amount) })
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
                localStorage.setItem('user', JSON.stringify(json));
                setAuthUser(json);
                setError(null);
                setSuccess(true);
            }

        } catch (error) {
            console.log(error);
            setError("Something went wrong");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return { addBalance, loading, error, success, setSuccess };
};

export default useAddBalance;
