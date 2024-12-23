import { Link } from "react-router-dom"

import paramIcon from "../images/param-icon.png"
import cartIcon from "../images/cart-icon.png"
import paperBoxIcon from "../images/paperbox-icon.png"
import conversationIcon from "../images/conversation-icon.png"
import imageIcon from "../images/image-icon.png"
export default () => {
    return <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6 p-4 lg:p-6">
            <Link to="/admin/param" className="homepage-link-card">
                <img src={paramIcon}  className="homepage-link-card-icon"></img>
                <div className="homepage-link-card-title">基本資料設定</div>
            </Link>
            <Link to="/admin/order" className="homepage-link-card">
                <img src={cartIcon}  className="homepage-link-card-icon"></img>
                <div className="homepage-link-card-title">訂單管理系統</div>
            </Link>
            <Link to="/admin/productCategory" className="homepage-link-card">
                <img src={paperBoxIcon}  className="homepage-link-card-icon"></img>
                <div className="homepage-link-card-title">商品類別設定</div>
            </Link>
            <Link to="/admin/product" className="homepage-link-card">
                <img src={paperBoxIcon}  className="homepage-link-card-icon"></img>
                <div className="homepage-link-card-title">商品管理系統</div>
            </Link>
            <Link to="/admin/question" className="homepage-link-card">
                <img src={conversationIcon}  className="homepage-link-card-icon"></img>
                <div className="homepage-link-card-title">常見問題設定</div>
            </Link>
            <Link to="/admin/banner" className="homepage-link-card">
                <img src={imageIcon}  className="homepage-link-card-icon"></img>
                <div className="homepage-link-card-title">首頁輪播設定</div>
            </Link>
        </div>
    </>
}