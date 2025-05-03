import React, {useState} from 'react';
import Navbar from "../components/Navbar";
import cards from "../data/cards.json"
import useAddCard from "../hooks/useAddCard";
import Footer from "../components/Footer";
import {useAuthContext} from "../context/useAuthContext";
import {useNavigate} from "react-router-dom";

function Cards(props) {
    const navigate = useNavigate();
    const {authUser} = useAuthContext()
    const [activeIndexC, setActiveIndexC] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [password,setPassword] = useState('');
    const [phoneNumber,setPhoneNumber] = useState("");
    const {addCard,error} = useAddCard();
    const [newError,setNewError] = useState(null)
    const handleAddCard = async (ev,index) => {
        ev.preventDefault()
        await addCard(cards[index].color,password,phoneNumber,cards[index].validYear,cards[index].title);
        setPassword("");
        setPhoneNumber("")
    }


    return (
        <div>
            <Navbar/>
            <div className={'cards-container'}>
                <section className={'efr'}>
                    <h1>Cards</h1>
                    <div className={'mid-cards'}>
                        {cards.map((card, index) => (
                            <section className={'w'} key={index}>
                                <img src={'/' + card.color}/>
                                <div className={card.isBig?'pad':''}>
                                    <section className={'inf'}>
                                        <h2>{card.title}</h2>
                                        <h3>Card is valid for {card.validYear} years</h3>
                                        <h3>Card's currency: $</h3>
                                    </section>
                                    <section className={'dew'}>
                                        {activeIndex === index ? (
                                            <form onSubmit={(ev) => handleAddCard(ev, index)}>
                                                <input
                                                    value={password}
                                                    onChange={(ev) => setPassword(ev.target.value)}
                                                    type="password"
                                                    placeholder="Confirm Your Password"
                                                />
                                                <input
                                                    value={phoneNumber}
                                                    onChange={(ev) => setPhoneNumber(ev.target.value)}
                                                    type="text"
                                                    placeholder="Phone Number (+374 55 XX-XX-XX)"
                                                />
                                                {error && (
                                                    <section className="err">
                                                        <p>{error}</p>
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

export default Cards;