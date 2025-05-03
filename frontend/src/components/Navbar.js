import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {FaRegUser} from "react-icons/fa";
import {IoLocationOutline} from "react-icons/io5";
import {FiPhone} from "react-icons/fi";
import {useAuthContext} from "../context/useAuthContext";
import {TbLogout} from "react-icons/tb";
import useLogin from "../hooks/useLogin";
import useLogout from "../hooks/useLogout";




function Navbar(props) {
    const [pos,setPos] = useState(false);
    useEffect(() => {
        handleScroll()
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pos]);


    const handleScroll = () => {
        if (window.scrollY > 100) {
            setPos(true);
        }else {
            setPos(false);
        }
    }

    const {logout} = useLogout()

    const handleLogOut = async  () => {
        await logout()
    }


    const {authUser} = useAuthContext();
    return (
        <div>
            <div className={'addressBar'}>
                <section>
                    <h2>
                        <IoLocationOutline />Branches</h2>
                    <h2>
                        <FiPhone />
                        +374 55 88-77-41</h2>
                </section>
            </div>
            <div className={!pos?'navB':'navB magic'} >
                <section className={'logoBar'}>
                    <Link to={'/'}>
                        <img src={'images/logo.png'}/>
                        <h2>SOUL</h2>
                    </Link>
                </section>

                <ul>
                    <li><Link to={'/cards'}>Cards</Link></li>
                    <li><Link to={'/loans'}>Loans</Link></li>

                </ul>
                <section className={'userBox'}>
                    <Link to={!authUser?'/login':'/dashboard'}>
                        <FaRegUser/>
                        {authUser ? <h2>{authUser.fname + " " + authUser.lname}</h2>: <button id={'btn'}>Login</button>}
                    </Link>
                    {authUser && <TbLogout onClick={handleLogOut} />}
                </section>
            </div>
        </div>
    );
}

export default Navbar;