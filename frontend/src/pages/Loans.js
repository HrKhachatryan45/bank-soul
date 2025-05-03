import React, {useState} from 'react';
import Navbar from "../components/Navbar";
import Loanns from "../data/loans.json"
import useAddCard from "../hooks/useAddCard";
import Footer from "../components/Footer";
import {useAuthContext} from "../context/useAuthContext";
import {useNavigate} from "react-router-dom";
import useGetALoan from "../hooks/useGetALoan";

function Loans(props) {
    const navigate = useNavigate();
    const {getLoan,errorM} = useGetALoan()
    const {authUser} = useAuthContext()
    const [activeIndexC, setActiveIndexC] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [newError,setNewError] = useState(null)
    const [amount,setAmount] = useState(0);
    const handleAddLoan = async (ev,index) => {
        ev.preventDefault()
        await getLoan(amount,Loanns[index]);
        setAmount(0)
    }


    return (
        <div>
            <Navbar/>
            <div className={'cards-container'}>
                <section className={'efr'}>
                    <h1>Loans</h1>
                    <div className={'mid-cards'}>
                        {Loanns.map((loan, index) => (
                            <section className={'w w1'} key={index}>
                                <div >
                                    <img src={loan.imagePath}/>
                                    <section className={'inf'}>
                                        <div>
                                            <div className={'ck'}>
                                                <h3>{loan.data.interestRate}</h3>
                                                <h2>Interest Rate</h2>
                                            </div>
                                            <div className={'ck'}>
                                                <h3>{loan.data.deadline}</h3>
                                                <h2>Deadline</h2>
                                            </div>
                                            <div className={'ck'}>
                                                <h3>${loan.data.amount}</h3>
                                                <h2>Amount</h2>
                                            </div>
                                        </div>

                                    </section>
                                    <section className={'dew'}>
                                        {activeIndex === index ? (
                                            <form onSubmit={(ev) => handleAddLoan(ev, index)}>
                                                <input
                                                    value={amount}
                                                    onChange={(ev) => setAmount(ev.target.value)}
                                                    type="text"
                                                    placeholder="Amount"
                                                />
                                                {errorM && (
                                                    <section className="err">
                                                        <p>{errorM}</p>
                                                    </section>
                                                )}
                                                <button type="submit">Order</button>
                                            </form>
                                        ) : (
                                            <div>
                                                {newError && activeIndexC === index  && <section className={'err'}>
                                                    <p>{newError}</p>
                                                </section>}
                                                <button onClick={() =>{
                                                    if (authUser){
                                                        setActiveIndex(index)
                                                    }else{
                                                        setNewError('Not Logged In')
                                                        setTimeout(() => {
                                                            navigate('/login')
                                                        },3000)
                                                        setActiveIndexC(index)
                                                    }
                                                }}>Order</button>
                                            </div>
                                        )}
                                    </section>
                                </div>
                            </section>
                        ))}
                    </div>
                </section>
            </div>
            <Footer/>
        </div>
    );
}

export default Loans;