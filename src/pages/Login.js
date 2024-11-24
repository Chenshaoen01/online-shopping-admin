import axios from "axios"
import { useRef } from "react"

export default () => {
    const accout = useRef()
    const password = useRef()

    const login = () => {
        const loginData = {
            user_email: accout.current.value,
            user_password: password.current.value
        }
        axios.post(`${window.location.origin}/users/login`, loginData)
    }

    return <div>
        <label htmlFor="account">
            <span>帳號</span>
            <input type="text" ref={accout}></input>
        </label>
        <label htmlFor="password">
            <span>密碼</span>
            <input type="password" ref={password}></input>
        </label>
        <button type="button" onClick={login}>登入</button>
    </div>
}