import {useAuthContext} from "../context/useAuthContext";

const useDeleteTransactions = () => {
    const {setAuthUser} = useAuthContext();

    const deleteTransactions = async (transactionIds) => {
        try{
         const response = await fetch('/bank/deleteTransactions',{
             method: 'POST',
             headers:{"Content-Type":"application/json"},
             body:JSON.stringify(transactionIds),
         })
            const json = await response.json();
            console.log(json,'json')
         if (!response.ok){
             console.log(json.error)
             if (json.error == 'expired' || json.error == 'No token provided'){
                 setAuthUser(null);
                 localStorage.removeItem('user');
             }
         }else {
             localStorage.setItem('user',JSON.stringify(json));
             setAuthUser(json);
         }
        }catch(err){
            console.error(err);
        }
    }
    return {deleteTransactions}
}
export default useDeleteTransactions;