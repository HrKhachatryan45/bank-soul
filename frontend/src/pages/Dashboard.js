import React, {useState} from 'react';
import Navbar from "../components/Navbar";
import {useAuthContext} from "../context/useAuthContext";
import {FaEye, FaRegUser} from "react-icons/fa";
import {IoIosAddCircle} from "react-icons/io";
import {FaEyeSlash} from "react-icons/fa6";
import LeftNavbar from "../components/leftNavbar";
import {GoArrowDownLeft, GoArrowUpRight} from "react-icons/go";
import {LuCircleUserRound} from "react-icons/lu";

function Dashboard(props) {
    const {authUser} = useAuthContext();

    const [show,setShow] = useState(false);
    const card = authUser.bankData.balance.cards[0];
    return (
        <div>
            <Navbar/>
            <div className={'cont lm'}>
               <LeftNavbar/>
                <div className={'right-bar'}>
                    <h1>Dashboard</h1>
                    <div className={'top-bar'}>
                        <section className={'balanceBar'}>
                            <h3>My Balance</h3>
                            <h4>${authUser.bankData.balance.bankAccount.balance}</h4>
                            <h5>Bank account ID: {!show? Array.from(authUser.bankData.balance.bankAccount.accountID).fill('*',0,9):
                                authUser.bankData.balance.bankAccount.accountID
                            }
                                {!show?<FaEye className={'on'} onClick={() => setShow(true)} />:<FaEyeSlash className={'on'} onClick={() => setShow(false)} />}
                            </h5>
                        </section>
                        {authUser.bankData.balance.cards.length > 0 ?
                            <section className={'cardK'} >
                                <section id={card.color.includes('.')?'lst':""} style={{background:card.color.includes('.')?`url(${card.color})`: card.color}} className={'cardX'}>
                                    <h4>My Balance</h4>
                                    <h2>${card.balance}</h2>
                                    <div className={'rg'}>
                                        <p>{`**** **** **** ${card.digits16.slice(-4)}`}</p>
                                    </div>
                                    <div className={'st'}>
                                        <h2>{card.fullName}</h2>
                                        <h3>{card.expDate}</h3>
                                    </div>
                                </section>
                            </section>
                            : <section className={'cardK'}>
                                <a href={'/myCards'}>ADD CARDS <IoIosAddCircle/></a>
                            </section>
                        }
                        {authUser.bankData.loans.length > 0 ?
                            <section className={'cardK ef '} style={{flexDirection:"row",justifyContent:"space-between"}}>
                                    <div className={'circle'}>
                                        <div className={'progressBar'} style={{
                                            background:`conic-gradient(#4caf50 ${Math.round(authUser.bankData.loans[0].returnedMoney * 100 /authUser.bankData.loans[0].money) }%, #ccc 0)`
                                        }}></div>
                                        <div className={'inner'}>
                                            {Math.round(authUser.bankData.loans[0].returnedMoney * 100 /authUser.bankData.loans[0].money) }%
                                        </div>
                                    </div>
                                    <div className={'fet'}>
                                        <h2>{Math.round(authUser.bankData.loans[0].returnedMoney)}/{authUser.bankData.loans[0].money}</h2>
                                    </div>
                            </section>
                            : <section className={'cardK'}>
                                <a href={'/myLoans'}>ADD Loans <IoIosAddCircle/></a>
                            </section>
                        }

                    </div>
                    <div className={'bottom-bar b2'}>
                        <h3>Transaction history</h3>
                        {authUser.bankData.transactions.length === 0  ? <h2>No Transactions yet</h2>:
                            <div className={'transactions'}>
                                {authUser.bankData.transactions.slice(0,3).map((transaction, index) => (
                                <section className={'transaction'} key={index}>
                                    {!transaction.isAdded?<section className={'minusT'}>
                                        <GoArrowDownLeft />
                                    </section>:<section className={'plusT'}>
                                        <GoArrowUpRight />
                                    </section>
                                    }
                                    <div className={'sender'}>
                                        <FaRegUser  className={'us'}/>
                                        <div style={{display:'flex',flexDirection:'column',alignItems:'start',justifyContent:'center'}}>
                                            <h2>{transaction.sender.fname + " " + transaction.sender.lname}</h2>
                                            <h4>{transaction.sender.username}</h4>
                                        </div>
                                    </div>
                                    <div className={'sender'}>
                                        <p>{transaction.date}</p>
                                    </div>
                                    <div className={'sender'}>
                                        <h2 id={'amount'}>$ {transaction.amount}</h2>
                                    </div>
                                    <div className={`sender ${transaction.status === 'completed' ? 'comp':'failed'}`}>
                                        <h5>{transaction.status}</h5>
                                    </div>

                                    {/*<div className={'sender'}>*/}
                                    {/*    <h2>{transaction.receiver.fname + " " + transaction.receiver.lname}</h2>*/}
                                    {/*    <h4>{transaction.receiver.username}</h4>*/}
                                    {/*</div>*/}

                                </section>
                                ))
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;