import { dateStringTransfer } from "../helpers/timeFunction"
export default ({ modalData }) => {
    return <>
        <div className="modal micromodal-slide" id="order-modal" aria-hidden="true">
            <div className="modal__overlay" data-micromodal-close>
                <div className="modal__container" role="dialog" aria-modal="true" aria-labelledby="order-modal-title">
                    <header className="modal__header">
                        <h2 className="modal__title" id="order-modal-title">
                            常見問題設定
                        </h2>
                        <button className="modal__close" aria-label="Close modal" data-micromodal-close></button>
                    </header>
                    <main className="modal__content" id="order-modal-content">
                        {/* 訂單編號 / 訂單建立時間 / 付款方式 / 訂單狀態 / 出貨地址 / 訂單備註 */}
                        <div className="flex flex-col">
                            <div className="flex flex-col">
                                <label className="form-label">
                                    <span className="form-title">訂單編號</span>
                                    <span>{modalData.order?.order_id}</span>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <label className="form-label">
                                    <span className="form-title">訂單建立日期</span>
                                    <span>{dateStringTransfer(modalData.order?.created_at)}</span>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <label className="form-label">
                                    <span className="form-title">訂單金額</span>
                                    <span>{modalData.order?.total_price}</span>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <label>
                                    <span className="form-title">訂單狀態</span>
                                    <span>{modalData.order?.order_status}</span>
                                </label>
                            </div>
                        </div>
                        <div className="devider my-4"></div>
                        {/* 買家名稱 / 買家Email / 買家連絡電話 */}
                        <div className="flex flex-col">
                            <div className="flex flex-col">
                                <label className="form-label">
                                    <span className="form-title">買家名稱</span>
                                    <span>{modalData.user?.user_name}</span>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <label className="form-label">
                                    <span className="form-title">買家Email</span>
                                    <span>{modalData.user?.user_email}</span>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <label>
                                    <span className="form-title">買家連絡電話</span>
                                    <span>{modalData.user?.user_tel}</span>
                                </label>
                            </div>  
                        </div>
                        <div className="devider my-4"></div>
                        {/* 出貨超商種類 / 出貨門市名稱 / 出貨門市編號 */}
                        <div className="flex flex-col">
                            <div className="flex flex-col">
                                <label className="form-label">
                                    <span className="form-title">出貨超商種類</span>
                                    <span>{modalData.order?.csv_type}</span>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <label className="form-label">
                                    <span className="form-title">出貨門市名稱</span>
                                    <span>{modalData.order?.store_name}</span>
                                </label>
                            </div>
                            <div className="flex flex-col">
                                <label>
                                    <span className="form-title">出貨門市編號</span>
                                    <span>{modalData.order?.store_id}</span>
                                </label>
                            </div>  
                        </div>
                        {/* 訂單明細 */}
                        {
                            modalData.items?.length > 0 && <>
                                <div className="devider my-4"></div>
                                <div className="flex flex-col">
                                    {modalData.items?.map((item, itemIndex) => (
                                        <div className="subdata-card mb-4" key={item.order_item_id}>
                                            <div className="flex flex-col">
                                                <div className="flex flex-col">
                                                    <label className="form-label">
                                                        <span className="form-title">商品名稱</span>
                                                        <span>{item.product_name}</span>
                                                    </label>
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="form-label">
                                                        <span className="form-title">商品規格</span>
                                                        <span>{item.model_name}</span>
                                                    </label>
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="form-label">
                                                        <span className="form-title">數量</span>
                                                        <span>{item.quantity}</span>
                                                    </label>
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="form-label">
                                                        <span className="form-title">單價</span>
                                                        <span>{item.model_price}</span>
                                                    </label>
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="form-label">
                                                        <span className="form-title">小記</span>
                                                        <span>{parseFloat(item.model_price) * parseFloat(item.quantity)}</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>))}
                                </div>
                            </>
                        }
                    </main>
                </div>
            </div>
        </div>
    </>
}