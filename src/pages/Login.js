import { useState, useRef } from 'react';

export default function Login() {
    const [error, setError] = useState(null);
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleLogin = async () => {
        const user_email = emailRef.current.value;
        const user_password = passwordRef.current.value;
    };

    return (
        <>
            <div className="grid grid-cols-12">
                    <div className="col-span-7 hidden md:flex">
                        <div className="userpage-form-background-area"></div>
                    </div>
                    <div className="col-span-12 md:col-span-5">
                        <div className="userpage-form-area-container">
                            <div className="userpage-form-area">
                                <img className="userpage-logo me-2 mb-4" src="/images/logo1.png"></img>
                                <div className="userpage-form-title-area mb-4">
                                    <p className="text-center font-bold text-3xl mb-2">毛孩物坊</p>
                                    <p className="text-center font-bold text-xl">後臺管理系統</p>
                                </div>
                                <label className="w-full flex flex-col mb-2">
                                    <span className="me-4 mb-2">帳號</span>
                                    <input ref={emailRef} type="text" className="userpage-form-input" />
                                </label>
                                <label className="w-full flex flex-col mb-4">
                                    <span className="me-4 mb-2">密碼</span>
                                    <input ref={passwordRef} type="password" className="userpage-form-input" />
                                </label>
                                {error && <p className="text-red-500 mt-4">{error}</p>}
                                {<button type="button" onClick={handleLogin} className="userpage-form-button mb-2">登入</button>}
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}