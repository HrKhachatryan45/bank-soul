import React, {useEffect, useState} from 'react';
import {useAuthContext} from "../context/useAuthContext";
import Navbar from "../components/Navbar";
import LeftNavbar from "../components/leftNavbar";
import {FaEye} from "react-icons/fa";
import {FaEyeSlash} from "react-icons/fa6";
import useAddBalance from "../hooks/useAddBalance";
import useAddToCard from "../hooks/useAddToCard";
import useAddToAccount from "../hooks/useAddToAccount";

function Balance(props) {
    const {authUser} = useAuthContext();
    const [receiver,setReceiver] = useState('in');
    const [show,setShow] = useState(false);
    const [amount,setAmount] = useState(0);
    const [amountT,setAmountT] = useState(0);
    const [amountK,setAmountK] = useState(0);
    const [digits16,setDigits16] = useState('');
    const {addBalance,loading,error,success,setSuccess} = useAddBalance();
    const addToBalance =async (ev) => {
        ev.preventDefault()
        await  addBalance(amount);
        setAmount(0)
    }
    useEffect(() => {
        if (authUser.bankData.balance.cards.length > 0) {
            setDigits16(authUser.bankData.balance.cards[0].digits16);
        }
    }, [authUser]);

    const {addToCard,loadingM,errorM,successM,setSuccessM} = useAddToCard();

    const handleAddToMyCard = async (ev) => {
        ev.preventDefault();
        await  addToCard(amountK,digits16);
    }
    const {addToAccount,loadingA,errorA,successA,setSuccessA} = useAddToAccount();
    const addToAcc = async (ev) => {
        ev.preventDefault();
        await addToAccount(amountT,undefined,receiver);
    }


    useEffect(() => {
        const timeoutM = setTimeout(() => {
            setSuccessM(false);
        }, 3000);

        return () => clearTimeout(timeoutM);
    }, [successM]);

    useEffect(() => {
        const timeoutA = setTimeout(() => {
            setSuccessA(false);
        }, 3000);

        return () => clearTimeout(timeoutA);
    }, [successA]);

    useEffect(() => {
        const timeoutX = setTimeout(() => {
            setSuccess(false);
        }, 3000);

        return () => clearTimeout(timeoutX);
    }, [success]);



    return (
        <div>
            <Navbar/>
            <div className={'cont'}>
                <LeftNavbar/>
                <div className={'right-bar'}>
                    <h1>Balance</h1>
                    <div className={'top-bar l-bar'}>
                        <section className={'balanceBar'}>
                            <h3>My Balance</h3>
                            <h4>${Math.ceil(authUser.bankData.balance.bankAccount.balance * 100) / 100}</h4>
                            <h5>Bank account
                                ID: {!show ? Array.from(authUser.bankData.balance.bankAccount.accountID).fill('*', 0, 9) :
                                    authUser.bankData.balance.bankAccount.accountID
                                }
                                {!show ? <FaEye className={'on'} onClick={() => setShow(true)}/> :
                                    <FaEyeSlash className={'on'} onClick={() => setShow(false)}/>}
                            </h5>
                        </section>
                        <section className={'cardK addUp'}>
                            <div className={'tpd'}>
                                <section className={'mij'}>
                                    <h3>Add to balance</h3>
                                    <form onSubmit={addToBalance}>
                                        <input value={amount} onChange={(ev) => setAmount(ev.target.value)}
                                               type={'text'}
                                               placeholder={'write amount'}/>
                                        {error && <section className={'err'}>
                                            <p>{error}</p>
                                        </section>}
                                        {  success && <section className={'scc'}>
                                            <p>Successfully Completed</p>
                                        </section>}
                                        <button>Add</button>
                                    </form>
                                </section>
                                <section className={'mij'}>
                                    <h3>Transfer</h3>
                                    <form onSubmit={addToAcc}>
                                        <input onChange={(ev) => setReceiver(ev.target.value)}
                                               type={'text'}
                                               placeholder={'Receiver Account ID'}/>
                                        <input value={amountT} onChange={(ev) => setAmountT(ev.target.value)}
                                               type={'text'}
                                               placeholder={'write amount'}/>
                                        {errorA && <section className={'err'}>
                                            <p>{errorA}</p>
                                            {  successA && <section className={'scc'}>
                                                <p>Successfully Completed</p>
                                            </section>}
                                        </section>}

                                        <button>Add</button>
                                    </form>
                                </section>
                            </div>
                            {authUser.bankData.balance.cards.length > 0 ? <div className={'bet'}>
                                <h3>Send to my cards</h3>
                                <form onSubmit={handleAddToMyCard}>

                                    <select value={digits16} onChange={(e) => setDigits16(e.target.value)}>
                                        {authUser.bankData.balance.cards.map((card, index) => (
                                            <option key={index} value={card.digits16}>
                                                {`**** **** **** ${card.digits16.slice(-4)}`}
                                            </option>
                                        ))}
                                    </select>


                                    <input value={amountK} onChange={(ev) => setAmountK(ev.target.value)}
                                           type={'text'}
                                           placeholder={'write amount'}/>
                                    {errorM && <section className={'err'}>
                                        <p>{errorM}</p>
                                    </section>}
                                    {  successM && <section className={'scc'}>
                                        <p>Successfully Completed</p>
                                    </section>}
                                    <button className={'bg-red-500'}>Add</button>
                                </form>
                            </div> : null}
                        </section>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Balance;