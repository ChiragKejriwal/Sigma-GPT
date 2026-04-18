import React,{useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../auth.form.css';

const Register = () => {

    const navigate = useNavigate()
    const {loading,user,handleRegister} = useAuth()
    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [error, setError] = useState('')

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user, navigate])


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await handleRegister({username,email,password})
            navigate("/")
        } catch (err) {
            setError(err.message || 'Registration failed')
        }
    }

    if(loading) {
        return (
           <main className='auth-page'>
                <h1>Loading...</h1>
           </main>
        )
    }

    return (
        <main className='auth-page'>
            <div className="form-container">
                <h1>Register</h1>
                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                        onChange={(e) => { setUsername(e.target.value) }}
                        type="text" id="username" name='username' placeholder='Enter username' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' />
                    </div>

                    <button className='button primary-button' >Register</button>

                </form>

                <p>Already have an account? <Link to={"/login"} >Login</Link> </p>
            </div>
        </main>
    )
}

export default Register