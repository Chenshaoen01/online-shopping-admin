import { useCallback, useEffect, useState } from "react";

import DataList from "../components/DataList.js";
import PageButtonGroup from "../components/PageButtonGroup.js";
import ProductCategoryModal from "../components/ProductCategoryModal.js";
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

    const mainIdColumnName = "category_id"
    const modalName = "category-modal"
    const [dataList, setDataList] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [modalData, setModalData] = useState({})
    const [columnList] = useState([
        { columnName: 'category_id', columnChName: "類別編號" },
        { columnName: 'category_name', columnChName: "類別名稱" },
    ])
    const [dataListActions] = useState(['edit', 'delete'])

    // 重置Modal內容
    const clearModalData = () => {
        setIsEdit(false)
        const emptyModalData = {
            category_id: "",
            category_name: "",
        }
        setModalData(emptyModalData)
    }

    // 取得資料列表
    useEffect(() => {
        getDataList()
    }, [currentPage])

    const getDataList = useCallback(() => {
        LoadingPageShow()
        axios.get(`${process.env.REACT_APP_API_URL}/productCategory?page=${currentPage}`)
        .then((res) => {
            LoadingPageHide()
            if(Array.isArray(res.data.dataList)) {
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
    const getDetailData = useCallback((dataId) => {
        setIsEdit(true)
        LoadingPageShow()
        if(dataId !== undefined) {
            axios.get(`${process.env.REACT_APP_API_URL}/productCategory/${dataId}`)
            .then((res) => {
                LoadingPageHide()
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
        const deletedIdList = dataList.filter(data => data.isChecked).map(data => data.category_id)
        doDelete(deletedIdList)
    }
    const doDelete = useCallback((deletedIdList) => {
        if(deletedIdList.length > 0) {
            LoadingPageShow()
            axios.delete(`${process.env.REACT_APP_API_URL}/productCategory`, {
                data:{category_ids: deletedIdList},
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
                console.log(err)
            })
        }
    }, [])

    return <>
        <div className="main-conteant-header">
            <div className="flex items-center mb-3">
                <div className="flex items-center">
                    <img className="sidebar-link-item-img" src={paperBoxIcon}></img>
                    <span className="me-3">商品類別設定</span>
                </div>
                <button type="button" className="button-primary"
                    onClick={() =>  {
                        clearModalData(); 
                        MicroModal.show("category-modal")
                    }}>新增類別</button>
            </div>
            <div className="flex items-center">
                <button type="button" className="button-primary" onClick={() => {deleteCheckedItems()}}>刪除</button>
            </div>
        </div>
        <DataList MicroModal={MicroModal} modalName={modalName} columnList={columnList} mainIdColumnName={mainIdColumnName} dataList={dataList}  dataListActions={dataListActions} setDataList={setDataList}  getDetailData={getDetailData} doDelete={doDelete}/>
        <ProductCategoryModal MicroModal={MicroModal} modalData={modalData} setModalData={setModalData} isEdit={isEdit} getDataList={getDataList}/>
        <PageButtonGroup lastPage={lastPage} pageButtonList={pageButtonList} currentPage={currentPage} setCurrentPage={setCurrentPage} getDataList={getDataList}/>
    </>
}