import { Link } from "react-router-dom"
export default () => {
    return <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6 p-4 lg:p-6">
            <Link to="/admin/param" className="homepage-link-card">
                <img src="/images/param-icon.png"  className="homepage-link-card-icon"></img>
                <div className="homepage-link-card-title">基本資料設定</div>
            </Link>
            <Link to="/admin/order" className="homepage-link-card">
                <img src="/images/cart-icon.png"  className="homepage-link-card-icon"></img>
                <div className="homepage-link-card-title">訂單管理系統</div>
            </Link>
            <Link to="/admin/productCategory" className="homepage-link-card">
                <img src="/images/paperbox-icon.png"  className="homepage-link-card-icon"></img>
                <div className="homepage-link-card-title">商品類別設定</div>
            </Link>
            <Link to="/admin/product" className="homepage-link-card">
                <img src="/images/paperbox-icon.png"  className="homepage-link-card-icon"></img>
                <div className="homepage-link-card-title">商品管理系統</div>
            </Link>
            <Link to="/admin/question" className="homepage-link-card">
                <img src="/images/conversation-icon.png"  className="homepage-link-card-icon"></img>
                <div className="homepage-link-card-title">常見問題設定</div>
            </Link>
            <Link to="/admin/banner" className="homepage-link-card">
                <img src="/images/image-icon.png"  className="homepage-link-card-icon"></img>
                <div className="homepage-link-card-title">首頁輪播設定</div>
            </Link>
        </div>
    </>
}