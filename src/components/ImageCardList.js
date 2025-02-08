export default ({ MicroModal, modalName, mainIdColumnName, imgColumnName, mobileImgColumnName, dataList, dataListActions, getDetailData, doDelete }) => {
    const isActionButtonExist = ((targetAction) => dataListActions.some(action => action === targetAction))
    return <>
        {
            (Array.isArray(dataList) && dataList.length > 0) ? <>
                <div className="grid grid-col-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-4">
                    {dataList.map(data => (
                        <>
                            <div className="data-img-card hidden lg:block mb-3" key={`mobile-list-item${data[mainIdColumnName]}`}
                                style={{ backgroundImage: `url('${process.env.REACT_APP_CLOUDEFLARE_PUBLIC_URL}/${data[imgColumnName]}')` }}>
                                <div className="flex justify-end">
                                    {isActionButtonExist('edit') && (
                                        <div className="edit-button-lg me-2"
                                            onClick={() => { getDetailData(data[mainIdColumnName]); MicroModal.show(modalName); }}></div>
                                    )}
                                    {isActionButtonExist('delete') && (
                                        <div className="delete-button-lg" onClick={() => { doDelete([data[mainIdColumnName]]) }}></div>
                                    )}
                                </div>
                            </div>
                            <div className="data-img-card block lg:hidden mb-3" key={`mobile-list-item${data[mainIdColumnName]}`}
                                style={{ backgroundImage: `url('${process.env.REACT_APP_CLOUDEFLARE_PUBLIC_URL}/${data[mobileImgColumnName]}')` }}>
                                <div className="flex justify-end">
                                    {isActionButtonExist('edit') && (
                                        <div className="edit-button-lg me-2"
                                            onClick={() => { getDetailData(data[mainIdColumnName]); MicroModal.show(modalName); }}></div>
                                    )}
                                    {isActionButtonExist('delete') && (
                                        <div className="delete-button-lg" onClick={() => { doDelete([data[mainIdColumnName]]) }}></div>
                                    )}
                                </div>
                            </div>
                        </>
                    ))}
                </div>
            </> : <div className="text-center mt-16">查無資料</div>
        }
    </>
}