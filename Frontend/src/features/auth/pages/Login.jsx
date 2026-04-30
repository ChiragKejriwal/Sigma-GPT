import React from 'react';
import {useEffect, useState} from "react";
import "../auth.form.css";
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const {loading, user, handleLogin, authError, setAuthError} = useAuth();

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
        setError('');
        setAuthError('');
        const result = await handleLogin({email,password});
        if (result?.success) {
            navigate("/");
        } else {
            setError(result?.message || authError || 'Login failed');
        }
    }

    return (
        <main className='auth-page'>
            <div className="form-container">
                <h1>Login</h1>
                {(error || authError) && (
                    <p className="auth-error" role="alert" aria-live="polite">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        <span>{error || authError}</span>
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                        onChange={(e)=>{setEmail(e.target.value); setError(''); setAuthError('');}}
                        type="email" id="email" name="email" placeholder='Enter Email address'/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                        onChange={(e)=>{setPassword(e.target.value); setError(''); setAuthError('');}}
                        type="password" id="password" name="password" placeholder='Enter Password'/>
                    </div>

                    <button className='button primary-button' disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p>Don't have an account? <Link to={"/register"} >Register</Link> </p>
            </div>
        </main>
    );
}

export default Login;