import React, {useState} from 'react';
import {Link} from "react-router-dom";
import Navbar from "../components/Navbar";
import useRegister from "../hooks/useRegister";
import useLogin from "../hooks/useLogin";

function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {login,loading,error} = useLogin();
    const  handleSubmit =async (ev) => {
        ev.preventDefault();
        await login(username,password);
    }

    return (
        <div>
            <Navbar/>
        <div className={"container-body"}>
            <form onSubmit={handleSubmit}>
                <h1>LOGIN</h1>


                <h3>Our Bank is with you</h3>
                <input type={'text'} placeholder={'Username'} onChange={(ev) => setUsername(ev.target.value)}
                       value={username}/>
                <input type={'password'} placeholder={'Password'} onChange={(ev) => setPassword(ev.target.value)}
                       value={password}/>
                <p>Don't have an account yet? <Link to={'/register'}>Register</Link></p>
                {error && <section className={'err'}>
                    <p>{error}</p>
                </section>}

                <button>Log In</button>
            </form>
        </div>
        </div>
    );
}

export default Login;