import React from 'react';
import {useEffect, useState} from "react";
import "../auth.form.css";
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const {loading, user, handleLogin} = useAuth();

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState("");

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await handleLogin({email,password});
            navigate("/");
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    }

    if(loading){
        return (<main className='auth-page'><h1>Loading.......</h1></main>)
    }

    return (
        <main className='auth-page'>
            <div className="form-container">
                <h1>Login</h1>
                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                        onChange={(e)=>{setEmail(e.target.value)}}
                        type="email" id="email" name="email" placeholder='Enter Email address'/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                        onChange={(e)=>{setPassword(e.target.value)}}
                        type="password" id="password" name="password" placeholder='Enter Password'/>
                    </div>

                    <button className='button primary-button'>Login</button>
                </form>

                <p>Don't have an account? <Link to={"/register"} >Register</Link> </p>
            </div>
        </main>
    );
}

export default Login;