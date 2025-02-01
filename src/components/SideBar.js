import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import axios from "axios"

import logo from "../images/logo1.png"
import hamburIcon from "../images/menu-burger.svg"
import paramIcon from "../images/param-icon.png"
import cartIcon from "../images/cart-icon.png"
import paperBoxIcon from "../images/paperbox-icon.png"
import imageIcon from "../images/image-icon.png"
import conversationIcon from "../images/conversation-icon.png"

export default () => {
    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        updateUserInfo()
    }, [])

    const updateUserInfo = useCallback( () => {
        axios.get(`${process.env.REACT_APP_API_URL}/users/getAdminUserInfo`)
            .then(res => {
                setUserEmail(res.data.user_email)
                setUserName(res.data.user_name)

                setTimeout(updateUserInfo, 2000)
            })
            .catch(err => {
                navigate("/login")
            })
    }, [])

    const logOut = useCallback(() => {
        axios.post(`${process.env.REACT_APP_API_URL}/users/logout`)
            .then(res => {
                localStorage.removeItem("csrfToken")
                navigate("/login")
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    return <div className="sidebar-area">
        <div className="sidebar-account-area">
            <div className="system-title-area">
                <Link to="/">
                    <img className="sidebar-logo-img" src={logo}></img>
                </Link>
                <div>毛孩物坊後台管理系統</div>
            </div>
            <div className="pc-user-info">
                <div className="devider my-4"></div>
                <div>{userName}</div>
                <div>{userEmail}</div>
            </div>
            <button type="button" className="log-out-button" onClick={() => { logOut() }}>登出</button>
            <img className="hambur-icon" src={hamburIcon} onClick={() => { setIsExpanded(!isExpanded) }}></img>
        </div>
        <div className={isExpanded ? "sidebar-linklist-area active" : "sidebar-linklist-area"}>
            <Link to="/admin/param" className="sidebar-link-item" onClick={() => {setIsExpanded(false)}}>
                <img className="sidebar-link-item-img" src={paramIcon}></img>
                <span>基本資料設定</span>
            </Link>
            <Link to="/admin/order" className="sidebar-link-item" onClick={() => {setIsExpanded(false)}}>
                <img className="sidebar-link-item-img" src={cartIcon}></img>
                <span>訂單管理系統</span>
            </Link>
            <Link to="/admin/productCategory" className="sidebar-link-item" onClick={() => {setIsExpanded(false)}}>
                <img className="sidebar-link-item-img" src={paperBoxIcon}></img>
                <span>商品類別設定</span>
            </Link>
            <Link to="/admin/product" className="sidebar-link-item" onClick={() => {setIsExpanded(false)}}>
                <img className="sidebar-link-item-img" src={paperBoxIcon}></img>
                <span>商品管理系統</span>
            </Link>
            <Link to="/admin/question" className="sidebar-link-item" onClick={() => {setIsExpanded(false)}}>
                <img className="sidebar-link-item-img" src={conversationIcon}></img>
                <span>常見問答設定</span>
            </Link>
            <Link to="/admin/banner" className="sidebar-link-item" onClick={() => {setIsExpanded(false)}}>
                <img className="sidebar-link-item-img" src={imageIcon}></img>
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