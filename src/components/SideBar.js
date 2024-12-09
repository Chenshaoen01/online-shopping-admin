import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import axios from "axios"

export default () => {
    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        updateUserInfo()
    }, [])

    const updateUserInfo = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/users/getAdminUserInfo`)
            .then(res => {
                setUserEmail(res.data.user_email)
                setUserName(res.data.user_name)

                setTimeout(updateUserInfo, 2000)
            })
            .catch(err => {
                navigate("/login")
            })
    }

    const logOut = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/users/logout`)
            .then(res => {
                document.cookie = 'csrfToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                navigate("/login")
            })
            .catch(err => {
                console.log(err)
            })
    };

    return <div className="sidebar-area">
        <div className="sidebar-account-area">
            <div className="system-title-area">
                <Link to="/">
                    <img className="sidebar-logo-img" src="/images/logo1.png"></img>
                </Link>
                <div>毛孩物坊後台管理系統</div>
            </div>
            <div className="pc-user-info">
                <div className="devider my-4"></div>
                <div>{userName}</div>
                <div>{userEmail}</div>
            </div>
            <button type="button" className="log-out-button" onClick={() => { logOut() }}>登出</button>
            <img className="hambur-icon" src="/images/menu-burger.svg" onClick={() => { setIsExpanded(!isExpanded) }}></img>
        </div>
        <div className={isExpanded ? "sidebar-linklist-area active" : "sidebar-linklist-area"}>
            <Link to="/admin/param" className="sidebar-link-item">
                <img className="sidebar-link-item-img" src="/images/param-icon.png"></img>
                <span>基本資料設定</span>
            </Link>
            <Link to="/admin/order" className="sidebar-link-item">
                <img className="sidebar-link-item-img" src="/images/cart-icon.png"></img>
                <span>訂單管理系統</span>
            </Link>
            <Link to="/admin/productCategory" className="sidebar-link-item">
                <img className="sidebar-link-item-img" src="/images/paperbox-icon.png"></img>
                <span>商品類別設定</span>
            </Link>
            <Link to="/admin/product" className="sidebar-link-item">
                <img className="sidebar-link-item-img" src="/images/paperbox-icon.png"></img>
                <span>商品管理系統</span>
            </Link>
            <Link to="/admin/question" className="sidebar-link-item">
                <img className="sidebar-link-item-img" src="/images/conversation-icon.png"></img>
                <span>常見問題設定</span>
            </Link>
            <Link to="/admin/banner" className="sidebar-link-item">
                <img className="sidebar-link-item-img" src="/images/image-icon.png"></img>
                <span>首頁輪播設定</span>
            </Link>
            <div className="mobile-user-info">
                <div className="flex flex-col">
                    <div>{userName}</div>
                    <div>{userEmail}</div>
                </div>
                <button type="button" className="button-primary" onClick={() => { logOut() }}>登出</button>
            </div>
        </div>
    </div>
}