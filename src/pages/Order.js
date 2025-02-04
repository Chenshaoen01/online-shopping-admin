import { useCallback, useEffect, useState } from "react";

import DataList from "../components/DataList.js";
import PageButtonGroup from "../components/PageButtonGroup.js";
import OrderModal from "../components/OrderModal.js";
import { LoadingPageShow, LoadingPageHide } from "../components/LoadingPage.js";
import cartIcon from "../images/cart-icon.png"
import { dateStringTransfer } from "../helpers/timeFunction"

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

    const [isFinishedShown, setIsFinishedShown] = useState('0')

    const mainIdColumnName = "order_id"
    const modalName = "order-modal"
    const [dataList, setDataList] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [modalData, setModalData] = useState({})
    const [columnList] = useState([
        { columnName: 'order_id', columnChName: "訂單編號" },
        { columnName: 'created_at', columnChName: "訂單建立日期" },
        { columnName: 'user_name', columnChName: "買家帳號" },
        { columnName: 'total_price', columnChName: "訂單金額" },
        { columnName: 'order_status', columnChName: "訂單狀態" },
    ])
    const [dataListActions] = useState(['detail'])

    // 取得資料列表
    useEffect(() => {
        getDataList()
    }, [currentPage])

    const getDataList = useCallback(() => {
        LoadingPageShow()
        axios.get(`${process.env.REACT_APP_API_URL}/order?page=${currentPage}&isFinishedShown=${isFinishedShown}`,
            {
                headers: {
                    'X-CSRF-TOKEN': localStorage.getItem('csrfToken')
                }
            })
            .then((res) => {
                LoadingPageHide()
                if (Array.isArray(res.data.dataList)) {
                    res.data.dataList.forEach(data => {
                        data.isChecked = false
                        data.created_at = dateStringTransfer(data.created_at)
                    })
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
                LoadingPageHide()
            })
    }, [currentPage, isFinishedShown])

    useEffect(() => {
        getDataList()
    }, [isFinishedShown])

    // 取得單一資料詳細資料
    const getDetailData = useCallback((dataId) => {
        LoadingPageShow()
        setIsEdit(true)
        if (dataId !== undefined) {
            axios.get(`${process.env.REACT_APP_API_URL}/order/${dataId}`)
                .then((res) => {
                    LoadingPageHide()
                    if (res.data) {
                        setModalData(res.data)
                    }
                })
                .catch((err) => {
                    LoadingPageHide()
                })
        }
    }, [])

    // 改變訂單狀態
    const changeOrderStatus = useCallback((action) => {
        const selectedIdList = dataList.filter(data => data.isChecked).map(data => data.order_id)
        if (selectedIdList.length > 0) {
            LoadingPageShow()
            axios.put(`${process.env.REACT_APP_API_URL}/order/orderStatus`,
                { order_ids: selectedIdList, order_status: action },
                {
                    headers: {
                        'X-CSRF-TOKEN': localStorage.getItem('csrfToken')
                    }
                })
                .then((res) => {
                    LoadingPageHide()
                    const responseMessage = res?.data?.message
                    alertify.alert("", responseMessage ? responseMessage : "訂單狀態調整成功")
                    getDataList()
                })
                .catch((err) => {
                    LoadingPageHide()
                    const responseMessage = err.response?.data?.message
                    alertify.alert("", responseMessage ? responseMessage : "訂單狀態調整失敗")
                })
        }
    }, [dataList])

    return <>
        <div className="main-conteant-header">
            <div className="flex items-center mb-3">
                <div className="flex items-center">
                    <img className="sidebar-link-item-img" src={cartIcon}></img>
                    <span className="me-3">訂單管理系統</span>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
                <div className="flex items-center">
                    <button type="button" className="button-primary me-3" onClick={() => { changeOrderStatus("已付款") }}>已付款</button>
                    <button type="button" className="button-primary me-3" onClick={() => { changeOrderStatus("已出貨") }}>已出貨</button>
                    <button type="button" className="button-primary me-3" onClick={() => { changeOrderStatus("已完成") }}>已完成</button>
                </div>
                <label class="flex mt-2 md:mt-0 cursor-pointer">
                   <input type="checkbox" checked={isFinishedShown === '1'}
                          value="" className="sr-only peer"
                          onChange={(e) => { 
                            setIsFinishedShown(e.target.checked? '1' : '0')
                        }}></input>
                   <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full
                                   peer dark:bg-gray-700 peer-checked:after:translate-x-full 
                                   rtl:peer-checked:after:-translate-x-full
                                 peer-checked:after:border-white after:content-[''] 
                                   after:absolute after:top-[2px]  after:start-[2px] after:bg-white after:border-gray-300
                                   after:border after:rounded-full after:h-5 after:w-5  after:transition-all dark:border-gray-600
                                 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                   <span className="form-title ms-2">是否顯示已完成訂單</span>
                 </label>
            </div>
        </div>
        <DataList MicroModal={MicroModal} modalName={modalName} columnList={columnList} mainIdColumnName={mainIdColumnName} dataList={dataList} dataListActions={dataListActions} setDataList={setDataList} getDetailData={getDetailData} />
        <OrderModal MicroModal={MicroModal} modalData={modalData} setModalData={setModalData} isEdit={isEdit} getDataList={getDataList} />
        <PageButtonGroup lastPage={lastPage} pageButtonList={pageButtonList} currentPage={currentPage} setCurrentPage={setCurrentPage} getDataList={getDataList} />
    </>
}