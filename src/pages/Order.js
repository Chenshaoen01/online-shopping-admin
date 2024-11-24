import { useEffect, useState } from "react";
import DataList from "../components/DataList.js";
import PageButtonGroup from "../components/PageButtonGroup.js";
import OrderModal from "../components/OrderModal.js";

import axios from "axios";
import alertify from "alertifyjs"
import MicroModal from "micromodal"
export default () => {
    useEffect(() => {
        MicroModal.init()
    }, [])

    const [lastPage, setLastPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageButtonList, setPageButtonList] = useState([])

    const mainIdColumnName = "order_id"
    const modalName = "order-modal"
    const [dataList, setDataList] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [modalData, setModalData] = useState({})
    const [columnList] = useState([
        { columnName: 'order_id', columnChName: "訂單編號" },
        { columnName: 'created_at', columnChName: "訂單建立時間" },
        { columnName: 'user_name', columnChName: "買家帳號" },
        { columnName: 'total_price', columnChName: "訂單金額" },
        { columnName: 'order_id', columnChName: "付款方式" },
        { columnName: 'order_status', columnChName: "訂單狀態" },
    ])
    const [dataListActions] = useState(['detail','delete'])

    // 取得資料列表
    useEffect(() => {
        getDataList()
    }, [currentPage])

    const getDataList = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/order?page=${currentPage}`)
            .then((res) => {
                if (Array.isArray(res.data.dataList)) {
                    res.data.dataList.forEach(data => data.isChecked = false)
                    setDataList(res.data.dataList)
                }
                if (res.data.lastPage) {
                    setLastPage(res.data.lastPage)
                }
                if (res.data.pageList) {
                    setPageButtonList(res.data.pageList)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // 取得單一資料詳細資料
    const getDetailData = (dataId) => {
        setIsEdit(true)
        if (dataId !== undefined) {
            axios.get(`${process.env.REACT_APP_API_URL}/order/${dataId}`)
                .then((res) => {
                    if (res.data) {
                        setModalData(res.data)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    // 改變訂單狀態
    const changeOrderStatus = (action) => {
        const selectedIdList = dataList.filter(data => data.isChecked).map(data => data.order_id)
        if (selectedIdList.length > 0) {
            axios.put(`${process.env.REACT_APP_API_URL}/order/orderStatus`, { order_ids: selectedIdList, order_status: action })
                .then((res) => {
                    alertify.alert("", "訂單狀態調整成功")
                    getDataList()
                })
                .catch((err) => {
                    alertify.alert("", "訂單狀態調整失敗")
                    console.log(err)
                })
        }
    }
    // 刪除
    const deleteCheckedItems = () => {
        const deletedIdList = dataList.filter(data => data.isChecked).map(data => data.order_id)
        doDelete(deletedIdList)
    }
    const doDelete = (deletedIdList) => {
        if (deletedIdList.length > 0) {
            axios.delete(`${process.env.REACT_APP_API_URL}/order`, { data: { order_ids: deletedIdList } })
                .then((res) => {
                    alertify.alert("", "刪除成功")
                    getDataList()
                })
                .catch((err) => {
                    alertify.alert("", "刪除失敗")
                    console.log(err)
                })
        }
    }

    return <>
        <div className="main-conteant-header">
            <div className="flex items-center mb-3">
                <div className="flex items-center">
                    <img className="sidebar-link-item-img" src="/images/cart-icon.png"></img>
                    <span className="me-3">訂單管理系統</span>
                </div>
            </div>
            <div className="flex items-center">
            <button type="button" className="button-primary me-3" onClick={() => { changeOrderStatus("已付款") }}>已付款</button>
                <button type="button" className="button-primary me-3" onClick={() => { changeOrderStatus("已出貨") }}>已出貨</button>
                <button type="button" className="button-primary" onClick={() => { deleteCheckedItems() }}>刪除</button>
            </div>
        </div>
        <DataList MicroModal={MicroModal} modalName={modalName} columnList={columnList} mainIdColumnName={mainIdColumnName} dataList={dataList} dataListActions={dataListActions} setDataList={setDataList} getDetailData={getDetailData} doDelete={doDelete} />
        <OrderModal MicroModal={MicroModal} modalData={modalData} setModalData={setModalData} isEdit={isEdit} getDataList={getDataList} />
        <PageButtonGroup lastPage={lastPage} pageButtonList={pageButtonList} currentPage={currentPage} setCurrentPage={setCurrentPage} getDataList={getDataList} />
    </>
}