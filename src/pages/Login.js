import { useState, useEffect } from 'react';
import alertify from 'alertifyjs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingPage, LoadingPageShow, LoadingPageHide } from "../components/LoadingPage.js";

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isRemember, setIsRemember] = useState(false)

    useEffect(() => {
        const isRemember = localStorage.getItem("isPetshoppingAdminRemember")
        const userEmail = localStorage.getItem("petshoppingAdminUserEmail")

        if (isRemember === "true") {
            setIsRemember(true)
            setEmail(userEmail)
        }
    }, [])

    // 驗證
    const RequiredColvalidate = () => {
        const validateColumn = [
            { columnState: email, columnChName: "電子信箱" },
            { columnState: password, columnChName: "密碼" }
        ]

        const inValidColumnList = validateColumn.reduce((accumulator, currentColumn) => {
            const currentValue = currentColumn.columnState
            if (currentValue === "" || currentValue === null || currentValue === undefined) {
                accumulator.push(currentColumn.columnChName)
            }
            return accumulator
        }, [])

        return inValidColumnList
    }

    // 登入
    const handleLogin = async () => {
        const inValidColumnList = RequiredColvalidate();
        if (inValidColumnList.length > 0) {
            const inValidString = inValidColumnList.join("、")
            alertify.alert("", `${inValidString}為必填項目`)
        } else {
            try {
                LoadingPageShow()
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/users/login`,
                    { user_email: email, user_password: password },
                    { withCredentials: true }
                ).then(res => {
                    LoadingPageHide()
                    document.cookie = `csrfToken=${res.data.csrfToken}; path=/`
                    handleLocalStorageData()
                    alertify.alert("", "登入成功")
                    setTimeout(() => {
                        navigate("/")
                    }, 2000)
                }).catch(err => {
                    LoadingPageHide()
                    alertify.alert("", "帳號或密碼錯誤");
                    return;
                })    
            } catch (error) {
                LoadingPageHide()
            }
        }
    };

    // 登入後儲存/移除 LocalStorage 的使用者登入資料
    function handleLocalStorageData() {
        if (isRemember) {
            localStorage.setItem("isPetshoppingAdminRemember", true)
            localStorage.setItem("petshoppingAdminUserEmail", email)
        } else {
            localStorage.setItem("isPetshoppingAdminRemember", false)
            localStorage.setItem("petshoppingAdminUserEmail", "")
        }
    }

    return (
        <>
            <LoadingPage></LoadingPage>
            <div className="userpage-main-content-area">
                <div className="grid grid-cols-12">
                    <div className="col-span-7 hidden md:flex">
                        <div className="userpage-form-background-area"></div>
                    </div>
                    <div className="col-span-12 md:col-span-5">
                        <div className="userpage-form-area-container">
                            <div className="userpage-form-area">
                                <img className="userpage-logo me-2 mb-4" src="images/logo1.png" alt="Logo"></img>
                                <div className="userpage-form-title-area mb-4">
                                    <p className="text-center font-bold text-3xl mb-2">毛孩物坊</p>
                                    <p className="text-center font-bold text-3xl mb-6">後臺管理系統</p>
                                    <p className="text-center font-bold text-xl mb-2">管理帳號登入</p>
                                </div>
                                <label className="w-full flex flex-col mb-2">
                                    <span className="me-4 mb-2">電子信箱</span>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="userpage-form-input"
                                    />
                                </label>
                                <label className="w-full flex flex-col mb-4">
                                    <span className="me-4 mb-2">密碼</span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="userpage-form-input"
                                    />
                                </label>
                                <label className="w-full flex mb-4">
                                    <input type="checkbox" checked={isRemember} onChange={(e) => setIsRemember(e.target.checked)} className="me-2"
                                    />
                                    <span>記住電子信箱</span>
                                </label>
                                <button type="button" onClick={handleLogin} className="userpage-form-button mb-2">登入</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
