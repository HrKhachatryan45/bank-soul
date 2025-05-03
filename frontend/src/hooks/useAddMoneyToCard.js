import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";

const useAddMoneyToCard = () => {
    const [loading, setLoading] = useState(false);
    const [errorX, setErrorX] = useState(null);
    const [successX, setSuccessX] = useState(false);
    const { setAuthUser } = useAuthContext();

    const addBalance = async (amount, digits16) => {
        if (isNaN(Number(amount))) {
            setErrorX('Enter number');
            setSuccessX(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/bank/addMoneyToCard', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Number(amount), digits16 })
            });

            const json = await response.json();

            if (!response.ok) {

                if (json.error == 'expired' || json.error == 'No token provided'){
                    setAuthUser(null);
                    localStorage.removeItem('user');
                }else {
                    setErrorX(json.error);
                    setSuccessX(false);
                }
            } else {
                localStorage.setItem('user', JSON.stringify(json));
                setAuthUser(json);
                setErrorX(null);
                setSuccessX(true);
            }
        } catch (error) {
            console.log(error);
            setErrorX("Something went wrong");
            setSuccessX(false);
        } finally {
            setLoading(false);
        }
    };

    return { addBalance, loading, errorX, successX, setSuccessX };
};

export default useAddMoneyToCard;
