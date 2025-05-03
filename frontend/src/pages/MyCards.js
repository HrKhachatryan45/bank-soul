import React, {useEffect, useState} from 'react';
import Navbar from "../components/Navbar";
import LeftNavbar from "../components/leftNavbar";
import {useAuthContext} from "../context/useAuthContext";
import useAddCard from "../hooks/useAddCard";
import Carousel from "react-bootstrap/Carousel";
import useAddToCard from "../hooks/useAddToCard";
import useAddMoneyToCard from "../hooks/useAddMoneyToCard";
import useAddToAccount from "../hooks/useAddToAccount";
import {FaEye} from "react-icons/fa";
import {FaEyeSlash} from "react-icons/fa6";


function MyCards(props) {
    const [show, setShow] = useState(true);
    const [password,setPassword] = useState('');
    const {authUser} = useAuthContext();
    const [selectedColor, setSelectedColor] = useState("red");
    const [phoneNumber,setPhoneNumber] = useState("");

    const {addCard,error} = useAddCard();

    const handleSubmit =async (ev) => {
        ev.preventDefault();
        await addCard(selectedColor,password,phoneNumber,5,'Classic');
        setSelectedColor("red");
        setPassword("");
        setPhoneNumber("")
    }

    const [amount,setAmount] = useState(0);
    const [amountT,setAmountT] = useState(0);
    const {addBalance,loading,errorX,successX,setSuccessX} = useAddMoneyToCard();
    const addMoneyToCard =async (ev) => {
        ev.preventDefault()
        await  addBalance(amount,digits16);
        setAmount(0)
    }

    const [amountK,setAmountK] = useState(0);
    const [digits16,setDigits16] = useState('');
    const [digits16A,setDigits16A] = useState('');

    useEffect(() => {
        if (authUser.bankData.balance.cards.length > 0) {
            setDigits16SenderCard(authUser.bankData.balance.cards[0].digits16);
        }
    }, [authUser]);
    useEffect(() => {
        if (authUser.bankData.balance.cards.length > 0) {
            setDigits16A(authUser.bankData.balance.cards[0].digits16);
        }
    }, [authUser]);

    useEffect(() => {
        if (authUser.bankData.balance.cards.length > 0) {
            setDigits16(authUser.bankData.balance.cards[0].digits16);
        }
    }, [authUser]);

    const {addToCard,loadingM,errorM,successM,setSuccessM} = useAddToCard();

    const [digits16Card,setDigits16Card] = useState('');
    const [digits16SenderCard,setDigits16SenderCard] = useState('');

    const  addToOtherCard =async (ev) => {
        ev.preventDefault();
        await addToCard(amountT,digits16Card,digits16SenderCard)
    }

    const {addToAccount,loadingA,errorA,successA,setSuccessA} = useAddToAccount();
    const handleAddToAccount = async (ev) => {
        ev.preventDefault()
        await addToAccount(amountK,digits16A)
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
            setSuccessX(false);
        }, 3000);

        return () => clearTimeout(timeoutX);
    }, [successX]);

    return (
        <div>
            <Navbar/>
            <div className={'cont'}>
                <LeftNavbar/>
                <div className={'right-bar'}>
                    <h1>My Cards</h1>
                    <div className={'top-bar tp-l '}>
                        {authUser.bankData.balance.cards.length > 0 ?
                            <Carousel className={'cardK cardL'} autoplay={0}>
                                {authUser.bankData.balance.cards.map((card, index) => (
                                    <Carousel.Item interval={null} key={index}>
                                        <section id={card.color.includes('.')?'lst':""} style={{background:card.color.includes('.')?`url(${card.color})`: card.color}} className={'cardX lst'}>
                                            <h4>My Balance</h4>
                                            <h2>${card.balance}</h2>
                                            <div className={'rg kh'}>

                                                <p>{show?`**** **** **** ${card.digits16.slice(-4)}`:(card.digits16).match(/.{1,4}/g).join(" ")}</p>
                                                {!show ? <FaEye className={'on'} onClick={() => setShow(true)}/> :
                                                    <FaEyeSlash className={'on'} onClick={() => setShow(false)}/>}
                                            </div>
                                            <div className={'st'}>
                                                <h2>{card.fullName}</h2>
                                                <h3>{card.expDate}</h3>
                                            </div>
                                            <h3 className={'fet'} >{card.title || 'classic '}</h3>
                                        </section>
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                            : <section className={'fd cardK'}>
                                <p>No Cards Yet</p>
                            </section>
                        }

                        {authUser.bankData.balance.cards.length === 0?<section className={'cardK add addUp'}>
                            <h3>Add New Card </h3>

                            <form onSubmit={handleSubmit}>
                                <div className={'tr'}>
                                    <h4>Choose card color:</h4>

                                </div>
                                <div className={'cardStyles'}>
                                    <section onClick={() => setSelectedColor('red')} style={{
                                        background: "red",
                                        border: selectedColor === "red" ? "2px solid #fff" : ""
                                    }}></section>
                                    <section onClick={() => setSelectedColor('yellow')} style={{
                                        background: "yellow",
                                        border: selectedColor === "yellow" ? "2px solid #fff" : ""
                                    }}></section>
                                    <section onClick={() => setSelectedColor('black')} style={{
                                        background: "black",
                                        border: selectedColor === "black" ? "2px solid #fff" : ""
                                    }}></section>
                                    <section onClick={() => setSelectedColor('blue')} style={{
                                        background: "blue",
                                        border: selectedColor === "blue" ? "2px solid #fff" : ""
                                    }}></section>
                                    <section onClick={() => setSelectedColor('green')} style={{
                                        background: "green",
                                        border: selectedColor === "green" ? "2px solid #fff" : ""
                                    }}></section>
                                    <section onClick={() => setSelectedColor('violet')} style={{
                                        background: "violet",
                                        border: selectedColor === "violet" ? "2px solid #fff" : ""
                                    }}></section>
                                </div>
                                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                                    <input style={{width: "48%"}} value={password}
                                           onChange={(ev) => setPassword(ev.target.value)}
                                           type={'password'} placeholder={'Confirm Your Password'}/>
                                    <input style={{width: "48%"}} value={phoneNumber}
                                           onChange={(ev) => setPhoneNumber(ev.target.value)}
                                           type={'text'} placeholder={'Phone Number (+374 55 XX-XX-XX)'}/>
                                </div>
                                {error && <section className={'err'}>
                                    <p>{error}</p>
                                </section>}

                                <button type={'submit'}>Confirm</button>
                            </form>
                        </section>:
                        <section className={'cardK addUp'}>
                            <div className={'tpd'}>
                                <section className={'mij'}>
                                    <h3>Add to card</h3>
                                    <form onSubmit={addMoneyToCard}>
                                        <select value={digits16} onChange={(e) => setDigits16(e.target.value)}>
                                            {authUser.bankData.balance.cards.map((card, index) => (
                                                <option key={index} value={card.digits16}>
                                                    {`**** **** **** ${card.digits16.slice(-4)}`}
                                                </option>
                                            ))}
                                        </select>

                                        <input value={amount} onChange={(ev) => setAmount(ev.target.value)}
                                               type={'text'}
                                               placeholder={'write amount'}/>
                                        {errorX && <section className={'err'}>
                                            <p>{errorX}</p>


                                        </section>}
                                        {  successX && <section className={'scc'}>
                                            <p>Successfully Completed</p>
                                        </section>}
                                        <button>Add</button>
                                    </form>
                                </section>
                                <section className={'mij'}>
                                    <h3>Transfer</h3>
                                    <form style={{alignItems:'start'}} onSubmit={addToOtherCard}>
                                        <div style={{width:'100%', display: 'flex', justifyContent: 'start',alignItems:'center'}}>
                                            <h4 className={'jk'}>Choose card: </h4>
                                            <select value={digits16SenderCard} onChange={(e) => setDigits16SenderCard(e.target.value)}>
                                                {authUser.bankData.balance.cards.map((card, index) => (
                                                    <option key={index} value={card.digits16}>
                                                        {`**** **** **** ${card.digits16.slice(-4)}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <input value={digits16Card} onChange={(ev) => setDigits16Card(ev.target.value)}
                                               type={'text'}
                                               placeholder={'Receiver Card No Spaces '}/>
                                        <input value={amountT} onChange={(ev) => setAmountT(ev.target.value)}
                                               type={'text'}
                                               placeholder={'write amount'}/>
                                        {errorM && <section className={'err'}>
                                        <p>{errorM}</p>
                                        </section>}
                                        {  successM && <section className={'scc'}>
                                            <p>Successfully Completed</p>
                                        </section>}
                                        <button>Add</button>
                                    </form>
                                </section>
                            </div>
                            {authUser.bankData.balance.cards.length > 0 ? <div className={'bet'}>
                                <h3>Send to my account</h3>
                                <form onSubmit={handleAddToAccount}>

                                    <select value={digits16A} onChange={(e) => setDigits16A(e.target.value)}>
                                        {authUser.bankData.balance.cards.map((card, index) => (
                                            <option key={index} value={card.digits16}>
                                                {`**** **** **** ${card.digits16.slice(-4)}`}
                                            </option>
                                        ))}
                                    </select>
                                    <input value={amountK} onChange={(ev) => setAmountK(ev.target.value)}
                                           type={'text'}
                                           placeholder={'write amount'}/>
                                    {errorA && <section className={'err'}>
                                        <p>{errorA}</p>
                                    </section>}
                                    {  successA && <section className={'scc'}>
                                        <p>Successfully Completed</p>
                                    </section>}
                                    <button>Add</button>
                                </form>
                            </div> : null}
                        </section>}


                    </div>

                </div>
            </div>
        </div>
    );
}

export default MyCards;