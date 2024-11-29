import { useState } from "react"
import { Link } from "react-router-dom"

export default () => {
    const [isExpanded, setIsExpanded] = useState(false)

    return <div className="sidebar-area">
        <div className="sidebar-account-area">
            <div className="flex flex-row lg:flex-col items-center">
                <Link to="/">
                    <img className="sidebar-logo-img" src="/images/logo1.png"></img>
                </Link>
                <div>毛孩物坊後台管理系統</div>
            </div>
            <div className="hidden lg:flex flex-col">
                <div className="devider my-4"></div>
                <div>管理員1</div>
                <div>admin@example.com</div>
            </div>
            <img className="hambur-icon" src="/images/menu-burger.svg" onClick={() => {setIsExpanded(!isExpanded)}}></img>
        </div>
        <div className={isExpanded? "sidebar-linklist-area active" : "sidebar-linklist-area"}>
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
        </div>
    </div>
}