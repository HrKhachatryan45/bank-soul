import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";

const useAddToAccount = () => {
    const [loadingA, setLoadingA] = useState(false);
    const [errorA, setErrorA] = useState(null);
    const [successA, setSuccessA] = useState(false);
    const { setAuthUser } = useAuthContext();

    const addToAccount = async (amount, digits16, accountID) => {
        if (isNaN(Number(amount))) {
            setErrorA("Enter number");
            setSuccessA(false);
            return;
        }

        try {
            setLoadingA(true);
            const response = await fetch('/bank/addToAccount', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Number(amount), digits16, accountID })
            });

            const json = await response.json();

            if (!response.ok) {

                if (json.error == 'expired' || json.error == 'No token provided'){
                    setAuthUser(null);
                    localStorage.removeItem('user');
                }else {
                    setErrorA(json.error);
                    setSuccessA(false);
                }
            } else {
                localStorage.setItem('user', JSON.stringify(json));
                setAuthUser(json);
                setErrorA(null);
                setSuccessA(true);
            }
        } catch (error) {
            console.log(error);
            setErrorA("Something went wrong");
            setSuccessA(false);
        } finally {
            setLoadingA(false);
        }
    };

    return { addToAccount, loadingA, errorA, successA, setSuccessA };
};

export default useAddToAccount;
