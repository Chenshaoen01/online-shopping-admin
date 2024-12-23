import { useCallback, useEffect, useState } from "react";

import DataList from "../components/DataList.js";
import PageButtonGroup from "../components/PageButtonGroup.js";
import ParameterModal from "../components/ParameterModal.js";
import { LoadingPageShow, LoadingPageHide } from "../components/LoadingPage.js";
import paramIcon from "../images/param-icon.png"

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

    const mainIdColumnName = "param_id"
    const modalName = "parameter-modal"
    const [dataList, setDataList] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [modalData, setModalData] = useState({})
    const [columnList] = useState([
        { columnName: 'param_id', columnChName: "參數編號" },
    ])
    const [dataListActions] = useState(['edit', 'delete'])

    // 重置Modal內容
    const clearModalData = () => {
        setIsEdit(false)
        const emptyModalData = {
            param_id: "",
            param_content: "",
        }
        setModalData(emptyModalData)
    }

    // 取得資料列表
    useEffect(() => {
        getDataList()
    }, [currentPage])

    const getDataList = useCallback(() => {
        LoadingPageShow()
        axios.get(`${process.env.REACT_APP_API_URL}/param?page=${currentPage}`)
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
        if(dataId !== undefined) {
            LoadingPageShow()
            axios.get(`${process.env.REACT_APP_API_URL}/param/${dataId}`)
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
    const deleteCheckedItems = useCallback(() => {
        const deletedIdList = dataList.filter(data => data.isChecked).map(data => data.param_id)
        doDelete(deletedIdList)
    }, [dataList])
    const doDelete = useCallback((deletedIdList) => {
        if(deletedIdList.length > 0) {
            LoadingPageShow()
            axios.delete(`${process.env.REACT_APP_API_URL}/param`, {data:{param_ids: deletedIdList}})
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
                    <img className="sidebar-link-item-img" src={paramIcon}></img>
                    <span className="me-3">基本資料設定</span>
                </div>
                <button type="button" className="button-primary"
                    onClick={() =>  {
                        clearModalData(); 
                        MicroModal.show("parameter-modal")
                    }}>新增參數</button>
            </div>
            <div className="flex items-center">
                <button type="button" className="button-primary" onClick={() => {deleteCheckedItems()}}>刪除</button>
            </div>
        </div>
        <DataList MicroModal={MicroModal} modalName={modalName} columnList={columnList} mainIdColumnName={mainIdColumnName} dataList={dataList}  dataListActions={dataListActions} setDataList={setDataList}  getDetailData={getDetailData} doDelete={doDelete}/>
        <ParameterModal MicroModal={MicroModal} modalData={modalData} setModalData={setModalData} isEdit={isEdit} getDataList={getDataList}/>
        <PageButtonGroup lastPage={lastPage} pageButtonList={pageButtonList} currentPage={currentPage} setCurrentPage={setCurrentPage} getDataList={getDataList}/>
    </>
}