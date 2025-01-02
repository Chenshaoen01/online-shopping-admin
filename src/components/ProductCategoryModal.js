import axios from "axios"
import alertify from "alertifyjs"
import { useCallback } from "react"
import { LoadingPageShow, LoadingPageHide } from "../components/LoadingPage.js";

export default ({ MicroModal, modalData, setModalData, isEdit, getDataList }) => {
    // 產品資料 編輯
    const setCategory = useCallback((newValue, columnName) => {
        setModalData((pre) => {
            return { ...pre, [columnName]: newValue }
        })
    }, [modalData])

    // 驗證
    const validate = () => {
        const validateColumn = [
            { columnName: 'category_id', columnChName: "類別編號" },
            { columnName: 'category_name', columnChName: "類別名稱" }
        ]
        const inValidColumnList = validateColumn.reduce((accumulator, currentColumn) => {
            const currentValue = modalData[currentColumn.columnName]
            if (currentValue === "" || currentValue === null || currentValue === undefined) {
                accumulator.push(currentColumn.columnChName)
            }
            return accumulator
        }, [])

        return inValidColumnList
    }

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
            LoadingPageShow()
            const postModalData = { ...modalData }
            axios({
                method: isEdit ? 'put' : 'post',
                url: isEdit ? `${process.env.REACT_APP_API_URL}/productCategory/${modalData.category_id}` : `${process.env.REACT_APP_API_URL}/productCategory`,
                data: postModalData,
                headers: {
                    'X-CSRF-TOKEN': localStorage.getItem('csrfToken')
                }
            }).then(res => {
                LoadingPageHide()
                const responseMessage = res?.data?.message
                alertify.alert("", responseMessage? responseMessage : "儲存成功")
                MicroModal.close("category-modal")
                getDataList()
            })
            .catch(err => {
                LoadingPageHide()
                const responseMessage = err.response?.data?.message
                alertify.alert("", responseMessage? responseMessage : "儲存失敗")
                console.log(err)
            })
        }
    }, [modalData])

    return <>
        <div className="modal micromodal-slide" id="category-modal" aria-hidden="true">
            <div className="modal__overlay">
                <div className="modal__container" role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
                    <header className="modal__header">
                        <h2 className="modal__title" id="category-modal-title">
                            產品類別設定
                        </h2>
                        <button className="modal__close" aria-label="Close modal" data-micromodal-close></button>
                    </header>
                    <main className="modal__content" id="category-modal-content">
                        <div className="flex flex-col">
                            {/* 類別編號 */}
                            <label className="form-label">
                                <span className="form-title required-column">類別編號</span>
                                {
                                    isEdit ? <span>{modalData.category_id}</span> : (
                                        <input type="text" className="form-input"
                                            value={modalData.category_id || ""}
                                            onChange={(e) => { setCategory(e.target.value, 'category_id') }}></input>
                                    )
                                }
                            </label>
                            {/* 類別名稱 */}
                            <label className="form-label">
                                <span className="form-title required-column">類別名稱</span>
                                <input type="text" className="form-input"
                                    value={modalData.category_name || ""}
                                    onChange={(e) => { setCategory(e.target.value, 'category_name') }}></input>
                            </label>
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