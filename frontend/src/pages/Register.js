import React, {useState} from 'react';
import Navbar from "../components/Navbar";
import {Link} from "react-router-dom";
import useRegister from "../hooks/useRegister";

function Register(props) {
    const [regData, setRegData] = useState({
        fname:"",
        lname:"",
        username:"",
        password:"",
        confirmPassword:"",
    });


    const {register,loading,error} = useRegister()
    const  handleSubmit =async (ev) => {
        ev.preventDefault();
            await register(regData);
    }


    return (
        <div>
            <Navbar/>
            <div className={"container-body"}>
                <form onSubmit={handleSubmit}>
                    <h1>REGISTER</h1>
                    <h3>Our Bank is with you</h3>
                    <section id={'hell'}>
                        <input value={regData.fname}
                               onChange={(ev) => setRegData((prev) => ({...prev, fname: ev.target.value}))}
                               type={'text'} placeholder={'First Name'}/>
                        <input value={regData.lname}
                               onChange={(ev) => setRegData((prev) => ({...prev, lname: ev.target.value}))}
                               type={'text'} placeholder={'Last Name'}/>
                    </section>
                    <input value={regData.username}
                           onChange={(ev) => setRegData((prev) => ({...prev, username: ev.target.value}))} type={'text'}
                           placeholder={'Username'}/>
                    <section id={'hell'}>
                        <input value={regData.password}
                               onChange={(ev) => setRegData((prev) => ({...prev, password: ev.target.value}))}
                               type={'password'} placeholder={'Password'}/>
                        <input value={regData.confirmPassword}
                               onChange={(ev) => setRegData((prev) => ({...prev, confirmPassword: ev.target.value}))}
                               type={'password'} placeholder={'Confirm Password'}/>
                    </section>
                    <p>Have an account already? <Link to={'/login'}>Login</Link></p>
                    {error && <section className={'err'}>
                            <p>{error}</p>
                    </section>}

                    <button>Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;