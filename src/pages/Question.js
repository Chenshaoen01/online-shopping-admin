import { useCallback, useEffect, useState } from "react";

import DataList from "../components/DataList.js";
import PageButtonGroup from "../components/PageButtonGroup.js";
import QuestionModal from "../components/QuestionModal.js";
import { LoadingPageShow, LoadingPageHide } from "../components/LoadingPage.js";
import conversationIcon from "../images/conversation-icon.png"

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

    const mainIdColumnName = "question_id"
    const modalName = "question-modal"
    const [dataList, setDataList] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [modalData, setModalData] = useState({})
    const [columnList] = useState([
        { columnName: 'question_sort', columnChName: "排序" },
        { columnName: 'question_title', columnChName: "問題" },
    ])
    const [dataListActions] = useState(['edit', 'delete'])

    // 重置Modal內容
    const clearModalData = () => {
        setIsEdit(false)
        const emptyModalData = {
            question_id: "",
            question_title: "",
            question_description: "",
            question_sort: 1,
        }
        setModalData(emptyModalData)
    }

    // 取得資料列表
    useEffect(() => {
        getDataList()
    }, [currentPage])

    const getDataList = useCallback(() => {
        LoadingPageShow()
        axios.get(`${process.env.REACT_APP_API_URL}/question?page=${currentPage}`)
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
        LoadingPageShow()
        setIsEdit(true)
        if(dataId !== undefined) {
            LoadingPageHide()
            axios.get(`${process.env.REACT_APP_API_URL}/question/${dataId}`)
            .then((res) => {
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
        const deletedIdList = dataList.filter(data => data.isChecked).map(data => data.question_id)
        doDelete(deletedIdList)
    }
    const doDelete = useCallback((deletedIdList) => {
        if(deletedIdList.length > 0) {
            LoadingPageShow()
            axios.delete(`${process.env.REACT_APP_API_URL}/question`, {data:{question_ids: deletedIdList}})
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

    return <>
        <div className="main-conteant-header">
            <div className="flex items-center mb-3">
                <div className="flex items-center">
                    <img className="sidebar-link-item-img" src={conversationIcon}></img>
                    <span className="me-3">常見問答設定</span>
                </div>
                <button type="button" className="button-primary"
                    onClick={() =>  {
                        clearModalData(); 
                        MicroModal.show("question-modal")
                    }}>新增問答</button>
            </div>
            <div className="flex items-center">
                <button type="button" className="button-primary" onClick={() => {deleteCheckedItems()}}>刪除</button>
            </div>
        </div>
        <DataList MicroModal={MicroModal} modalName={modalName} columnList={columnList} mainIdColumnName={mainIdColumnName} dataList={dataList}  dataListActions={dataListActions} setDataList={setDataList}  getDetailData={getDetailData} doDelete={doDelete}/>
        <QuestionModal MicroModal={MicroModal} modalData={modalData} setModalData={setModalData} isEdit={isEdit} getDataList={getDataList}/>
        <PageButtonGroup lastPage={lastPage} pageButtonList={pageButtonList} currentPage={currentPage} setCurrentPage={setCurrentPage} getDataList={getDataList}/>
    </>
}