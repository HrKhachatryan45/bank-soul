import {useState} from "react";
import {useAuthContext} from "../context/useAuthContext";

const useGetALoan = () => {

    const [errorM, setErrorM] = useState(null);
    const {setAuthUser} = useAuthContext();

    const getLoan = async (amount,loan) => {
        const money = loan.data.amount.split('-');

        if (isNaN(Number(amount)) || amount <= 0) {

            setErrorM('Enter number');
            return;
        }
        else if(amount < money[0] || amount > money[1]){
            setErrorM("Amount isn't compatible with the loan");
        }
        try {
            const response = await fetch('/bank/getLoan',{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    money:Number(amount),
                    percentage:loan.data.interestRate,
                    deadline:loan.data.deadline.split(' ')[0],
                    loanType:loan.title
                })
            });

            const json = await response.json();

            if (!response.ok){
                if (json.error == 'expired' || json.error == 'No token provided'){
                    setAuthUser(null);
                    localStorage.removeItem('user');
                }else {
                    setErrorM(json.error);
                }
            }else {
                localStorage.setItem('user',JSON.stringify(json));
                setAuthUser(json);
                setErrorM(null)
            }


        }catch(error){
            console.log(error)
            setErrorM(error)
        }
    }
    return {getLoan,errorM};
}
export default useGetALoan;