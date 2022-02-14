import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import signinImage from '../assets/HomeBanner.jpg';

const cookies = new Cookies();

const initialState = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    avatarURL: '',
}

const Auth = () => {
    const [form, setForm] = useState(initialState);
    const [isSignup, setisSignup] = useState(true);
    const [ServerErrorMessage, setServerErrorMessage] = useState(null);


    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const DemoSubmit = async (e) => {
        e.preventDefault();
        
        const URL = 'https://cryptgaurd.herokuapp.com/auth'
        try{
            const { data: { token, userId, hashedPassword, fullName, username, phoneNumber, avatarURL} } = await axios.post(`${URL}/login`, {
                DemoUser: "DemoUser"
            });
            cookies.set('token', token);
            cookies.set('username', username);
            cookies.set('fullName', fullName);
            cookies.set('userId', userId);
            cookies.set('phoneNumber', phoneNumber);
            cookies.set('avatarURL', avatarURL);
            cookies.set('hashedPassword', hashedPassword);
            window.location.reload();
        } catch(err){setServerErrorMessage("Sorry All Demo Users are Currently in Use, Please Try Again in 5 Minutes")}
        
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, password, phoneNumber, avatarURL} = form;

        const URL = 'https://cryptgaurd.herokuapp.com/auth';

        const { data: { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
            username, password, fullName: form.fullName, phoneNumber, avatarURL,
        });


        cookies.set('token', token);
        cookies.set('username', username);
        cookies.set('fullName', fullName);
        cookies.set('userId', userId);

        if (isSignup) {
            cookies.set('phoneNumber', phoneNumber);
            cookies.set('avatarURL', avatarURL);
            cookies.set('hashedPassword', hashedPassword);
        }
        window.location.reload();
    }
    const switchMode = () => {
        setisSignup((prevIsSignup) => !prevIsSignup);
    }
    return (
        <div className="auth__form-container">
            {ServerErrorMessage && <div className="serverMessage"><p>{ServerErrorMessage}</p> <button onClick={()=> setServerErrorMessage(null)}>Home</button></div>}
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="fullName"> Full Name</label>
                                <input 
                                    name="fullName" 
                                    type="text"
                                    placeholder="Full Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="username"> Username</label>
                            <input 
                                name="username" 
                                type="text"
                                placeholder="Username"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                            <label htmlFor="phoneNumber"> Phone Number</label>
                                <input 
                                    name="phoneNumber" 
                                    type="text"
                                    placeholder="Phone Number"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="avatarURL"> Avatar URL</label>
                                    <input 
                                        name="avatarURL" 
                                        type="text"
                                        placeholder="Avatar URL"
                                        onChange={handleChange}
                                        required
                                    />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="password"> Password</label>
                                <input 
                                    name="password" 
                                    type="text"
                                    placeholder="Password"
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                            <label htmlFor="confirmPassword"> Confirm Password</label>
                                <input 
                                    name="confirmPassword" 
                                    type="text"
                                    placeholder="Confirm Password"
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                        )}
                        <div className="auth__form-container_fields-content_button">
                            <button>{isSignup ? "Sign Up": "Sign In"}</button>
                            <button onClick={(e)=> DemoSubmit(e)} style={{marginLeft: "15px"}}>Demo User</button>
                        </div>
                    </form>
                    <div className="auth__form-container_fields-account">
                        <p>
                            {isSignup 
                            ? "Already Have An account?"
                            : "Don't Have an Account?"
                            }
                            <span onClick={switchMode}>
                                {isSignup ? 'Sign In' : 'Sign Up'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="auth__form-container_image">
                <img src={signinImage} alt="sign In" />
                <div className="auth__form-container_image-Banner">
                    <h1>Welcome To CryptGaurd</h1>
                    <h3> The Only True Crytoraphically Secured Chat Messaging System Designed To Keep Your Security Team Communications Secure.</h3>
                </div>
            </div>
        </div>
    )
}

export default Auth
