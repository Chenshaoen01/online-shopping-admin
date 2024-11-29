import { Link } from "react-router-dom"
export default () => {
    return <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
            <Link to="/admin/param" class="homepage-link-card">
                <img src="/images/param-icon.png"  class="homepage-link-card-icon"></img>
                <div class="homepage-link-card-title">基本資料設定</div>
            </Link>
            <Link to="/admin/order" class="homepage-link-card">
                <img src="/images/cart-icon.png"  class="homepage-link-card-icon"></img>
                <div class="homepage-link-card-title">訂單管理系統</div>
            </Link>
            <Link to="/admin/productCategory" class="homepage-link-card">
                <img src="/images/paperbox-icon.png"  class="homepage-link-card-icon"></img>
                <div class="homepage-link-card-title">商品類別設定</div>
            </Link>
            <Link to="/admin/product" class="homepage-link-card">
                <img src="/images/paperbox-icon.png"  class="homepage-link-card-icon"></img>
                <div class="homepage-link-card-title">商品管理系統</div>
            </Link>
            <Link to="/admin/question" class="homepage-link-card">
                <img src="/images/conversation-icon.png"  class="homepage-link-card-icon"></img>
                <div class="homepage-link-card-title">常見問題設定</div>
            </Link>
            <Link to="/admin/banner" class="homepage-link-card">
                <img src="/images/image-icon.png"  class="homepage-link-card-icon"></img>
                <div class="homepage-link-card-title">首頁輪播設定</div>
            </Link>
        </div>
    </>
}