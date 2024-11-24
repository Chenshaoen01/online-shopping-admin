import axios from "axios"
import alertify from "alertifyjs"

export default ({ MicroModal, modalData, setModalData, isEdit, getDataList }) => {
    // 產品資料 編輯
    const setQuestion = (newValue, columnName) => {
        const newModalData = { ...modalData }
        newModalData[columnName] = columnName === 'is_active' ? parseInt(newValue) : newValue
        setModalData(newModalData)
    }

    // 驗證
    const validate = () => {
        // 商品資訊驗證
        const validateColumn = [
            { columnName: 'question_sort', columnChName: "排序" },
            { columnName: 'question_title', columnChName: "問題" },
            { columnName: 'question_description', columnChName: "回答" },
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
                accumulator = `${accumulator}${isFistItem? "" : "、"}${currentInVliadColumn}`
                isFistItem = false
                return accumulator
            }, "")
            alertify.alert("", `${inValidString}為必填項目`)
        } else {
            const postModalData = { ...modalData }

            axios({
                method: isEdit ? 'put' : 'post',
                url: isEdit ? `${process.env.REACT_APP_API_URL}/question/${modalData.question_id}` : `${process.env.REACT_APP_API_URL}/question`,
                data: postModalData
            }).then(res => {
                alertify.alert("", "儲存成功")
                
                MicroModal.close("question-modal")
                getDataList()
            })
            .catch(err => {
                alertify.alert("", "儲存失敗")
                console.log(err)
            })
        }
    }

    return <>
        <div className="modal micromodal-slide" id="question-modal" aria-hidden="true">
            <div className="modal__overlay" data-micromodal-close>
                <div className="modal__container" role="dialog" aria-modal="true" aria-labelledby="question-modal-title">
                    <header className="modal__header">
                        <h2 className="modal__title" id="question-modal-title">
                            常見問題設定
                        </h2>
                        <button className="modal__close" aria-label="Close modal" data-micromodal-close></button>
                    </header>
                    <main className="modal__content" id="question-modal-content">
                        {/* 排序 */}
                        <div className="flex flex-col">
                            <label className="form-label">
                                <span className="form-title required-column">排序</span>
                                <input type="number" className="form-input"
                                    value={modalData.question_sort || ""}
                                    onChange={(e) => { setQuestion(e.target.value, 'question_sort') }}></input>
                            </label>
                        </div>
                        {/* 題目 */}
                        <div className="flex flex-col">
                            <label className="form-label">
                                <span className="form-title required-column">題目</span>
                                <input type="text" className="form-input"
                                    value={modalData.question_title || ""}
                                    onChange={(e) => { setQuestion(e.target.value, 'question_title') }}></input>
                            </label>
                        </div>
                        {/* 回答 */}
                        <div className="flex flex-col">
                            <span class="required-column">回答</span>
                            <textarea className="form-textarea" value={modalData.question_description || ""}
                                onChange={(e) => { setQuestion(e.target.value, 'question_description') }}></textarea>
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