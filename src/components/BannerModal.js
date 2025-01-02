import axios from "axios"
import alertify from "alertifyjs"
import { useCallback, useState } from "react"
import { LoadingPageShow, LoadingPageHide } from "../components/LoadingPage.js";

export default ({ MicroModal, modalData, setModalData, isEdit, getDataList }) => {
    // 產品資料 編輯
    const updateModalData = useCallback((newValue, columnName) => {
        setModalData((pre) => {
            return { ...pre, [columnName]: newValue }
        })
    }, [modalData])

    // 圖片 新增/刪除/上傳
    const [newImage, setNewImage] = useState(null)
    const updateNewImage = (newImageFile) => {
        setNewImage({
            file: newImageFile,
            url: URL.createObjectURL(newImageFile)
        })
    }
    const uploadImage = useCallback(async () => {
        let uploadResult = null
        const postFormData = new FormData()
        postFormData.append('bannerImg', newImage.file)
        LoadingPageShow()
        await axios.post(`${process.env.REACT_APP_API_URL}/banner/bannerImg`, postFormData, {
            headers: {
                'X-CSRF-TOKEN': localStorage.getItem('csrfToken')
            }
        }
        )
            .then(res => {
                LoadingPageHide()
                uploadResult = res.data.fileName
            })
            .catch(err => {
                LoadingPageHide()
                console.log(err)
            })

        return uploadResult
    }, newImage)

    // 驗證
    const validate = useCallback(() => {
        const validateColumn = [
            { columnName: 'banner_sort', columnChName: "輪播圖片排序" }
        ]
        const inValidColumnList = validateColumn.reduce((accumulator, currentColumn) => {
            const currentValue = modalData[currentColumn.columnName]
            if (currentValue === "" || currentValue === null || currentValue === undefined) {
                accumulator.push(currentColumn.columnChName)
            }
            return accumulator
        }, [])

        // 新增圖片時檢查是否有上傳圖片
        const imgValidateColumn = !isEdit && (newImage === "" || newImage === null) ? ["輪播圖片檔案"] : []

        return [...inValidColumnList, ...imgValidateColumn]
    }, [modalData, newImage])

    // 存檔
    const doSave = useCallback(async () => {
        const inValidColumnList = validate()
        if (inValidColumnList.length > 0) {
            let isFistItem = true
            const inValidString = inValidColumnList.reduce((accumulator, currentInVliadColumn) => {
                accumulator = `${accumulator}${isFistItem ? "" : "、"}${currentInVliadColumn}`
                isFistItem = false
                return accumulator
            }, "")

            alertify.alert("", `${inValidString}為必填項目`)
        } else {
            let uploadResult = ""
            if (newImage !== null && newImage !== "") {
                uploadResult = await uploadImage()
            }

            LoadingPageShow()
            axios({
                method: isEdit ? 'put' : 'post',
                url: isEdit ? `${process.env.REACT_APP_API_URL}/banner/${modalData.banner_id}` : `${process.env.REACT_APP_API_URL}/banner`,
                data: { ...modalData, new_banner_img: uploadResult },
                headers: {
                    'X-CSRF-TOKEN': localStorage.getItem('csrfToken')
                }
            }).then(res => {
                LoadingPageHide()
                const responseMessage = res?.data?.message
                alertify.alert("", responseMessage? responseMessage : "儲存成功")
                MicroModal.close("banner-modal")
                setNewImage(null)
                getDataList()
            })
            .catch(err => {
                LoadingPageHide()
                const responseMessage = err.response?.data?.message
                alertify.alert("", responseMessage? responseMessage : "儲存失敗")
            })
        }
    }, [modalData, newImage])

    return <>
        <div className="modal micromodal-slide" id="banner-modal" aria-hidden="true">
            <div className="modal__overlay">
                <div className="modal__container" role="dialog" aria-modal="true" aria-labelledby="banner-modal-title">
                    <header className="modal__header">
                        <h2 className="modal__title" id="banner-modal-title">首頁輪播圖片設定</h2>
                        <button className="modal__close" aria-label="Close modal" data-micromodal-close></button>
                    </header>
                    <main className="modal__content" id="banner-modal-content">
                        <div className="flex flex-col">
                            <label className="form-label">
                                <span className="form-title required-column">輪播圖片排序</span>
                                <input type="number" className="form-input"
                                    value={modalData.banner_sort || ""}
                                    onChange={(e) => { updateModalData(e.target.value, 'banner_sort') }}></input>
                            </label>
                            <label className="form-label">
                                <span className="form-title">輪播圖片連結</span>
                                <input type="text" className="form-input"
                                    value={modalData.banner_link || ""}
                                    onChange={(e) => { updateModalData(e.target.value, 'banner_link') }}></input>
                            </label>
                        </div>
                        {/* 圖片 */}
                        <div className="flex">
                            <span className="me-2 required-column">輪播圖片檔案</span>
                            <label>
                                <span type="button" className="button-primary button-primary-lg px-4">上傳圖片</span>
                                <input type="file" className="hidden" onChange={(e) => { updateNewImage(e.target.files[0]) }}></input>
                            </label>
                        </div>
                        <div className="flex flex-wrap mt-4">
                            {
                                (newImage !== "" && newImage !== null) ?
                                    ((newImage !== "" && newImage !== null) && <img className="modal-sub-img-lg" src={newImage.url}></img>) :
                                    ((modalData.banner_img !== "" && modalData.banner_img !== null) && <img className="modal-sub-img-lg" src={`${process.env.REACT_APP_CLOUDEFLARE_PUBLIC_URL}/${modalData.banner_img}`}>
                                    </img>)
                            }
                        </div>
                    </main>
                    <footer className="modal__footer">
                        <button type="button" className="button-primary button-primary-lg px-4"
                            onClick={() => { doSave() }}>儲存</button>
                    </footer>
                </div>
            </div>
        </div>
    </>
}