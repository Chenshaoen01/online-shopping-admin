import { useCallback, useEffect, useState } from "react";

import DataList from "../components/DataList.js";
import PageButtonGroup from "../components/PageButtonGroup.js";
import ProductModal from "../components/ProductModal.js";
import { LoadingPageShow, LoadingPageHide } from "../components/LoadingPage.js";
import paperBoxIcon from "../images/paperbox-icon.png"

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

    const mainIdColumnName = "product_id"
    const modalName = "product-modal"
    const [dataList, setDataList] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [modalData, setModalData] = useState({})
    const [columnList] = useState([
        { columnName: 'product_id', columnChName: "商品編號" },
        { columnName: 'product_name', columnChName: "商品名稱" },
        { columnName: 'category_name', columnChName: "商品類別" },
        { columnName: 'product_price', columnChName: "商品售價" },
        { columnName: 'is_active', columnChName: "是否上架" },
    ])
    const [dataListActions] = useState(['edit', 'delete'])

    // 重置Modal內容
    const clearModalData = () => {
        setIsEdit(false)
        const emptyModalData = {
            product_id: "",
            product_name: "",
            product_info: "",
            category_id: "",
            is_active: 1,
            is_recommended: 0,
            models: [],
            images: []
        }
        setModalData(emptyModalData)
    }

    // 取得資料列表
    useEffect(() => {
        getDataList()
    }, [currentPage])

    const getDataList = useCallback(() => {
        LoadingPageShow()
        axios.get(`${process.env.REACT_APP_API_URL}/product?page=${currentPage}`)
        .then((res) => {
            LoadingPageHide()
            if(Array.isArray(res.data.dataList)) {
                res.data.dataList.forEach(data => data.isChecked = false)
                setDataList(res.data.dataList)
            }
            if(res.data.lastPage) {
                setLastPage(res.data.lastPage)
            }
            if(res.data.pageList) {
                setPageButtonList(res.data.pageList)
            }
        })
        .catch((err) => {
            LoadingPageHide()
        })
    }, [currentPage])

    // 取得單一資料詳細資料
    const getDetailData = useCallback((productId) => {
        if(productId !== undefined) {
            clearModalData()
            LoadingPageShow()
            axios.get(`${process.env.REACT_APP_API_URL}/product/${productId}`)
            .then((res) => {
                LoadingPageHide()
                setIsEdit(true)
                if(res.data) {
                    setModalData(res.data)
                }
            })
            .catch((err) => {
                LoadingPageHide()
            })
        }
    }, [])

    // 刪除
    const deleteCheckedItems = () => {
        const deletedIdList = dataList.filter(data => data.isChecked).map(data => data.product_id)
        doDelete(deletedIdList)
    }
    const doDelete = useCallback((deletedIdList) => {
        if(deletedIdList.length > 0) {
            LoadingPageShow()
            axios.delete(`${process.env.REACT_APP_API_URL}/product`, {
                data:{product_ids: deletedIdList},
                headers: {
                    'X-CSRF-TOKEN': localStorage.getItem('csrfToken')
                }
            })
            .then((res) => {
                LoadingPageHide()
                const responseMessage = res?.data?.message
                alertify.alert("", responseMessage? responseMessage : "刪除成功")
                getDataList()
            })
            .catch((err) => {
                LoadingPageHide()
                const responseMessage = err.response?.data?.message
                alertify.alert("", responseMessage? responseMessage : "刪除失敗")
            })
        }
    }, [])

    // 上架/下架
    const doActiveEdit = useCallback((isActive) => {
        const editedIdList = dataList.filter(data => data.isChecked).map(data => data.product_id)
        if(editedIdList.length > 0) {
            LoadingPageShow()
            axios.post(`${process.env.REACT_APP_API_URL}/product/update-active-status`,
             {product_ids: editedIdList, isActive: isActive},
             {
                headers: {
                    'X-CSRF-TOKEN': localStorage.getItem('csrfToken')
                }
             })
            .then((res) => {
                LoadingPageHide()
                const responseMessage = res?.data?.message
                alertify.alert("", responseMessage? responseMessage : `${isActive? "上架":"下架"}成功`)
                getDataList()
            })
            .catch((err) => {
                LoadingPageHide()
                const responseMessage = err.response?.data?.message
                alertify.alert("", responseMessage? responseMessage : `${isActive? "上架":"下架"}失敗`)
            })
        }
    }, [dataList])

    return <>
        <div className="main-conteant-header">
            <div className="flex items-center mb-3">
                <div className="flex items-center">
                    <img className="sidebar-link-item-img" src={paperBoxIcon}></img>
                    <span className="me-3">商品管理系統</span>
                </div>
                <button type="button" className="button-primary"
                    onClick={() =>  {
                        clearModalData(); 
                        MicroModal.show("product-modal")
                    }}>新增商品</button>
            </div>
            <div className="flex items-center">
                <button type="button" className="button-primary me-3" onClick={() => {doActiveEdit(1)}}>上架</button>
                <button type="button" className="button-primary me-3" onClick={() => {doActiveEdit(0)}}>下架</button>
                <button type="button" className="button-primary" onClick={() => {deleteCheckedItems()}}>刪除</button>
            </div>
        </div>
        <DataList MicroModal={MicroModal} modalName={modalName} columnList={columnList} mainIdColumnName={mainIdColumnName} dataList={dataList} dataListActions={dataListActions} setDataList={setDataList}  getDetailData={getDetailData} doDelete={doDelete}/>
        <ProductModal MicroModal={MicroModal} modalData={modalData} setModalData={setModalData} isEdit={isEdit} getDataList={getDataList}/>
        <PageButtonGroup lastPage={lastPage} pageButtonList={pageButtonList} currentPage={currentPage} setCurrentPage={setCurrentPage} getDataList={getDataList}/>
    </>
}