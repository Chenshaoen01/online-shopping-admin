export default () => {
    return <>
        <div className="main-conteant-header">
            <div className="flex items-center mb-3">
                <div className="flex items-center">
                    <img className="sidebar-link-item-img" src="/images/paperbox-icon.png"></img>
                    <span className="me-3">商品管理系統</span>
                </div>
                <button type="button" className="button-primary">新增商品</button>
            </div>
            <div className="flex items-center">
                <button type="button" className="button-primary me-3">上架</button>
                <button type="button" className="button-primary me-3">下架</button>
                <button type="button" className="button-primary">刪除</button>
            </div>
        </div>
        <table className="data-list-table w-full">
            <thead>
                <th></th>
                <th>商品編號</th>
                <th>商品名稱</th>
                <th>商品類別</th>
                <th>商品售價</th>
                <th>是否上架</th>
                <th>庫存量</th>
                <th>操作</th>
            </thead>
            <tbody>
                <td>
                    <input type="checkbox"></input>
                </td>
                <td>商品編號</td>
                <td>商品名稱</td>
                <td>商品類別</td>
                <td>商品售價</td>
                <td>是否上架</td>
                <td>庫存量</td>
                <td>
                    <button type="button" className="button-transparent me-3">下架</button>
                    <button type="button" className="button-transparent">刪除</button>
                </td>
            </tbody>
        </table>
        <div className="main-conteant-footer">
            <div className="flex items-center">
                <button type="button" className="page-button page-button-pre"></button>
                <button type="button" className="page-button-dots"></button>
                <button type="button" className="page-button active">1</button>
                <button type="button" className="page-button">2</button>
                <button type="button" className="page-button">3</button>
                <button type="button" className="page-button">4</button>
                <button type="button" className="page-button">5</button>
                <button type="button" className="page-button-dots"></button>
                <button type="button" className="page-button page-button-next"></button>
            </div>
        </div>
    </>
}