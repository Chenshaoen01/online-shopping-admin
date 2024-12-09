import { useEffect, useState } from "react"
import axios from "axios"
import alertify from "alertifyjs"

export default ({ MicroModal, modalData, setModalData, isEdit, getDataList }) => {
    const [categoryList, setCategoryList] = useState([])
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/productCategory/getAll`)
        .then((res) => {
            const categoryList = [{category_id: "", category_name: "請選擇商品種類", disabled: true}]
            res.data.forEach(category => {
                categoryList.push({...category, disabled: false })
            })

            setCategoryList(categoryList)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])

    // 產品資料 編輯
    const setProductData = (newValue, columnName) => {
        const newModalData = { ...modalData }
        newModalData[columnName] = columnName === 'is_active' || columnName === 'is_recommended' ? parseInt(newValue) : newValue
        setModalData(newModalData)
    }

    // 規格資料 編輯/新增/刪除
    const setModelData = (newValue, modelIndex, columnName) => {
        const newModelList = [...modalData.models]
        newModelList[modelIndex][columnName] = newValue
        setModalData({ ...modalData, models: newModelList })
    }
    const addModel = () => {
        setModalData({
            ...modalData,
            models: [
                ...modalData.models,
                {
                    model_id: "",
                    model_name: "",
                    model_price: 0,
                    product_id: "",
                }
            ]
        })
    }
    const deleteModel = (deletedModelIndex) => {
        setModalData({
            ...modalData,
            models: modalData.models.filter((model, modelIndex) => deletedModelIndex !== modelIndex)
        })
    }

    // 圖片 新增/刪除/上傳
    const [newImages, setNewImages] = useState([])
    const addImage = (newImageFile) => {
        setNewImages([...newImages, {
            file: newImageFile,
            url: URL.createObjectURL(newImageFile)
        }])
    }
    const deleteNewImage = (deletedNewImageIndex) => {
        setNewImages(newImages.filter((image, imageIndex) => deletedNewImageIndex !== imageIndex))
    }
    const deleteImage = (deletedImageIndex) => {
        const modifiedImages = [...modalData.images]
        modifiedImages[deletedImageIndex].state = "Deleted"
        setModalData({ ...modalData, images: modifiedImages })
    }
    const uploadImage = async (imageFile) => {
        const uploadResult = []
        const UploadRequest = newImages.map((image) => {
            const postFormData = new FormData()
            postFormData.append('productImg', image.file)
            return axios.post(`${process.env.REACT_APP_API_URL}/product/productImg`, postFormData)
                .then(res => {
                    uploadResult.push(res.data.productFileName)
                })
                .catch(err => {
                    console.log(err)
                })
        })
        await Promise.all(UploadRequest)
        return uploadResult
    }

    // 驗證
    const validate = () => {
        // 商品資訊驗證
        const validateColumn = [
            { columnName: 'product_name', columnChName: "商品名稱" },
            { columnName: 'category_id', columnChName: "商品類別" },
            { columnName: 'is_active', columnChName: "是否上架" },
            { columnName: 'is_recommended', columnChName: "是否推薦" },
            { columnName: 'product_info', columnChName: "商品描述" },
        ]
        const inValidColumnList = validateColumn.reduce((accumulator, currentColumn) => {
            const currentValue = modalData[currentColumn.columnName]
            if (currentValue === "" || currentValue === null || currentValue === undefined) {
                accumulator.push(currentColumn.columnChName)
            }
            return accumulator
        }, [])

        // 規格資訊驗證
        const modelValidateColumn = [
            { columnName: 'model_name', columnChName: "規格名稱" },
            { columnName: 'model_price', columnChName: "規格售價" },
        ]
        const modelInValidColumnList = modelValidateColumn.reduce((accumulator, currentColumn) => {
            const isInValid = modalData.models.some(model => {
                const currentValue = model[currentColumn.columnName]
                return currentValue === "" || currentValue === null || currentValue === undefined
            })
            if(isInValid) {
                accumulator.push(currentColumn.columnChName)
            }
            return accumulator 
        }, [])

        return [...inValidColumnList, ...modelInValidColumnList]
    }

    // 存檔
    const doSave = async () => {
        const hasModel = modalData.models.length > 0
        const inValidColumnList = validate()
        if (inValidColumnList.length > 0 || !hasModel) {
            const inValidModelString = hasModel? "" : "商品需包含至少一種規格"

            let inValidString = ""
            if(inValidColumnList.length > 0) {
                let isFistItem = true
                inValidString += inValidColumnList.reduce((accumulator, currentInVliadColumn) => {
                    accumulator = `${accumulator}${isFistItem? "" : "、"}${currentInVliadColumn}`
                    isFistItem = false
                    return accumulator
                }, "")
                inValidString += "為必填項目"
            }

            alertify.alert("", `${inValidModelString}${inValidModelString !== "" && inValidString !== ""? "，": ""}${inValidString}`)
        } else {
            const uploadResult = await uploadImage()

            const postModalData = { ...modalData }
            uploadResult.forEach(uploadImgName => {
                postModalData.images.push({
                    product_id: "",
                    product_img: uploadImgName,
                    product_img_id: "",
                    state: "Added"
                })

            })

            axios({
                method: isEdit ? 'put' : 'post',
                url: isEdit ? `${process.env.REACT_APP_API_URL}/product/${modalData.product_id}` : `${process.env.REACT_APP_API_URL}/product`,
                data: postModalData
            }).then(res => {
                alertify.alert("", "儲存成功")
                
                MicroModal.close("product-modal")
                setNewImages([])
                getDataList()
            })
            .catch(err => {
                alertify.alert("", "儲存失敗")
                console.log(err)
            })
        }
    }

    return <>
        <div className="modal micromodal-slide" id="product-modal" aria-hidden="true">
            <div className="modal__overlay" data-micromodal-close>
                <div className="modal__container" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
                    <header className="modal__header">
                        <h2 className="modal__title" id="product-modal-title">
                            商品編輯
                        </h2>
                        <button className="modal__close" aria-label="Close modal" data-micromodal-close></button>
                    </header>
                    <main className="modal__content" id="product-modal-content">
                        {/* 商品ID/名稱/是否上架 */}
                        <div className="flex flex-col">
                            {
                                isEdit && <label className="form-label">
                                    <span className="form-title">商品編號</span>
                                    <span>{modalData.product_id}</span>
                                </label>
                            }
                            <label className="form-label">
                                <span className="form-title required-column">商品名稱</span>
                                <input type="text" className="form-input"
                                    value={modalData.product_name || ""}
                                    onChange={(e) => { setProductData(e.target.value, 'product_name') }}></input>
                            </label>
                            <label className="form-label">
                                <span className="form-title required-column">商品類別</span>
                                <select className="form-input" value={modalData.category_id || ""}
                                        onChange={(e) => { setProductData(e.target.value, 'category_id') }}>
                                    {
                                        categoryList.map(category => (
                                            <option key={category.category_id} value={category.category_id}
                                                    disabled={category.disabled}>
                                                {category.category_name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </label>
                            <div className="form-label">
                                <span className="form-title required-column">是否上架</span>
                                <label className="mr-4">
                                    <input name="is_active" type="radio" value="1"
                                        checked={modalData.is_active === 1}
                                        onChange={(e) => { setProductData(e.target.value, 'is_active') }}></input>
                                    <span className="ms-2">是</span>
                                </label>
                                <label>
                                    <input name="is_active" type="radio" value="0"
                                        checked={modalData.is_active === 0}
                                        onChange={(e) => { setProductData(e.target.value, 'is_active') }}></input>
                                    <span className="ms-2">否</span>
                                </label>
                            </div>
                            <div className="form-label">
                                <span className="form-title required-column">是否推薦</span>
                                <label className="mr-4">
                                    <input name="is_recommended" type="radio" value="1"
                                        checked={modalData.is_recommended === 1}
                                        onChange={(e) => { setProductData(e.target.value, 'is_recommended') }}></input>
                                    <span className="ms-2">是</span>
                                </label>
                                <label>
                                    <input name="is_recommended" type="radio" value="0"
                                        checked={modalData.is_recommended === 0}
                                        onChange={(e) => { setProductData(e.target.value, 'is_recommended') }}></input>
                                    <span className="ms-2">否</span>
                                </label>
                            </div>
                        </div>
                        <div className="devider my-4"></div>
                        {/* 圖片 */}
                        <div className="flex justify-between">
                            <span className="">商品圖片</span>
                            <label>
                                <span type="button" className="button-primary button-primary-lg px-4">新增圖片</span>
                                <input type="file" className="hidden" onChange={(e) => { addImage(e.target.files[0]) }}></input>
                            </label>
                        </div>
                        <div className="flex flex-wrap mt-8">
                            {
                                modalData.images?.map((image, imageIndex) => image.state !== "Deleted" && <div className="modal-sub-img relative" key={imageIndex + image.product_img} style={{ backgroundImage: `url('${process.env.REACT_APP_API_URL}/images/product/${image.product_img}')` }}>
                                    <div className="delete-button absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" onClick={() => { deleteImage(imageIndex) }}></div>
                                </div>)
                            }
                            {
                                newImages.map((image, imageIndex) => <div className="modal-sub-img relative" key={imageIndex} style={{ backgroundImage: `url('${image.url}')` }}>
                                    <div className="delete-button absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" onClick={() => { deleteNewImage(imageIndex) }}></div>
                                </div>)
                            }
                        </div>
                        <div className="devider my-4"></div>
                        {/* 規格 */}
                        <div className="flex justify-between mb-4">
                            <span className="">商品規格</span>
                            <button type="button" className="button-primary button-primary-lg px-4"
                                onClick={() => { addModel() }}>新增規格</button>
                        </div>
                        <div className="flex flex-col">
                            {modalData.models?.map((model, modelIndex) => (
                            <div className="subdata-card mb-4" key={model.model_id}>
                                <div className="flex justify-end mb-2 cursor-pointer" onClick={() => { deleteModel(modelIndex) }}>X</div>
                                <div className="grid grid-cols-12 gap-x-2">
                                    <div className="col-span-12">
                                        <label className="form-label flex items-center mb-2">
                                            <span className="form-title required-column">規格名稱</span>
                                            <input type="text" className="form-input form-input-lg"
                                                value={model.model_name}
                                                onChange={(e) => { setModelData(e.target.value, modelIndex, 'model_name') }}></input>
                                        </label>
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <label className="form-label flex items-center mb-2">
                                            <span className="form-title md:text-center required-column">售價</span>
                                            <input type="number" className="form-input form-input-lg"
                                                value={model.model_price}
                                                onChange={(e) => { setModelData(e.target.value, modelIndex, 'model_price') }}></input>
                                        </label>
                                    </div>
                                </div>
                            </div>))}
                        </div>
                        <div className="devider my-4"></div>
                        {/* 描述 */}
                        <div className="flex flex-col">
                            <span className="required-column">商品描述</span>
                            <textarea className="form-textarea" value={modalData.product_info || ""}
                                onChange={(e) => { setProductData(e.target.value, 'product_info') }}></textarea>
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