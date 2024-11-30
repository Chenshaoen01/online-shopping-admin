import axios from "axios"
import alertify from "alertifyjs"

export default ({ MicroModal, modalData, setModalData, isEdit, getDataList }) => {
    // 產品資料 編輯
    const setParameter = (newValue, columnName) => {
        const newModalData = { ...modalData }
        newModalData[columnName] = columnName === 'is_active' ? parseInt(newValue) : newValue
        setModalData(newModalData)
    }

    // 驗證
    const validate = () => {
        const validateColumn = [
            { columnName: 'param_id', columnChName: "參數編號" },
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
    const doSave = async () => {
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
            const postModalData = { ...modalData }

            axios({
                method: isEdit ? 'put' : 'post',
                url: isEdit ? `${process.env.REACT_APP_API_URL}/param/${modalData.param_id}` : `${process.env.REACT_APP_API_URL}/param`,
                data: postModalData
            }).then(res => {
                alertify.alert("", "儲存成功")
                MicroModal.close("parameter-modal")
                getDataList()
            })
                .catch(err => {
                    alertify.alert("", "儲存失敗")
                    console.log(err)
                })
        }
    }

    return <>
        <div className="modal micromodal-slide" id="parameter-modal" aria-hidden="true">
            <div className="modal__overlay" data-micromodal-close>
                <div className="modal__container" role="dialog" aria-modal="true" aria-labelledby="parameter-modal-title">
                    <header className="modal__header">
                        <h2 className="modal__title" id="parameter-modal-title">
                            產品類別設定
                        </h2>
                        <button className="modal__close" aria-label="Close modal" data-micromodal-close></button>
                    </header>
                    <main className="modal__content" id="parameter-modal-content">
                        <div className="flex flex-col">
                            {/* 參數編號 */}
                            <label className="form-label">
                                <span className="form-title required-column">參數編號</span>
                                {
                                    isEdit ? <span>{modalData.param_id}</span> : (
                                        <input type="text" className="form-input"
                                            value={modalData.param_id || ""}
                                            onChange={(e) => { setParameter(e.target.value, 'param_id') }}></input>
                                    )
                                }
                            </label>
                            {/* 類別名稱 */}
                            <div className="flex flex-col">
                                <span class="mb-2">參數內容</span>
                                <textarea className="form-textarea" value={modalData.param_content || ""}
                                    onChange={(e) => { setParameter(e.target.value, 'param_content') }}></textarea>
                            </div>
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