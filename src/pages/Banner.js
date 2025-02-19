import { useCallback, useEffect, useState } from "react";

import ImageCardList from "../components/ImageCardList.js";
import PageButtonGroup from "../components/PageButtonGroup.js";
import BannerModal from "../components/BannerModal.js";
import { LoadingPageShow, LoadingPageHide } from "../components/LoadingPage.js";
import imageIcon from "../images/image-icon.png"

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

    const mainIdColumnName = "banner_id"
    const modalName = "banner-modal"
    const [dataList, setDataList] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [modalData, setModalData] = useState({})
    const [columnList] = useState([
        { columnName: 'banner_sort', columnChName: "輪播圖片排序" },
        { columnName: 'banner_img', columnChName: "輪播圖片" },
    ])
    const [dataListActions] = useState(['edit', 'delete'])

    // 重置Modal內容
    const clearModalData = () => {
        setIsEdit(false)
        const emptyModalData = {
            banner_id: "",
            banner_sort: "",
            banner_link: "",
            banner_img: "",
            new_banner_img: "",
            mobile_banner_img: "",
            new_mobile_banner_img: "",
        }
        setModalData(emptyModalData)
    }

    // 取得資料列表
    useEffect(() => {
        getDataList()
    }, [currentPage])

    const getDataList = useCallback(() => {
        LoadingPageShow()
        axios.get(`${process.env.REACT_APP_API_URL}/banner?page=${currentPage}`)
            .then((res) => {
                LoadingPageHide()
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
                LoadingPageHide()
            })
    }, [currentPage])

    // 取得單一資料詳細資料
    const getDetailData = useCallback((dataId) => {
        LoadingPageShow()
        setIsEdit(true)
        if (dataId !== undefined) {
            axios.get(`${process.env.REACT_APP_API_URL}/banner/${dataId}`)
                .then((res) => {
                    LoadingPageHide()
                    if (res.data) {
                        setModalData(res.data)
                    }
                })
                .catch((err) => {
                    LoadingPageHide()
                    console.log(err)
                })
        }
    }, [])

    // 刪除
    const doDelete = useCallback((deletedIdList) => {
        if (deletedIdList.length > 0) {
            LoadingPageShow()
            axios.delete(`${process.env.REACT_APP_API_URL}/banner`, { 
                data: { banner_ids: deletedIdList },
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

    return <>
        <div className="main-conteant-header">
            <div className="flex items-center mb-3">
                <div className="flex items-center">
                    <img className="sidebar-link-item-img" src={imageIcon}></img>
                    <span className="me-3">首頁輪播設定</span>
                </div>
                <button type="button" className="button-primary"
                    onClick={() => {
                        clearModalData();
                        MicroModal.show(modalName)
                    }}>新增輪播圖片</button>
            </div>
        </div>
        <ImageCardList MicroModal={MicroModal} modalName={modalName} columnList={columnList} mainIdColumnName={mainIdColumnName} imgColumnName="banner_img" mobileImgColumnName="mobile_banner_img" dataList={dataList} dataListActions={dataListActions} setDataList={setDataList} getDetailData={getDetailData} doDelete={doDelete} />
        <BannerModal MicroModal={MicroModal} modalData={modalData} setModalData={setModalData} isEdit={isEdit} getDataList={getDataList} />
        <PageButtonGroup lastPage={lastPage} pageButtonList={pageButtonList} currentPage={currentPage} setCurrentPage={setCurrentPage} getDataList={getDataList} />
    </>
}