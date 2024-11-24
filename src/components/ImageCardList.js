export default ({ MicroModal, modalName, mainIdColumnName, imgColumnName, dataList, dataListActions, getDetailData, doDelete }) => {
    const isActionButtonExist = ((targetAction) => dataListActions.some(action => action === targetAction))
    return <>
        <div className="grid grid-col-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-4">
            {dataList.map((data, dataIndex) => (
                <div className="data-img-card mb-3" key={`mobile-list-item${data[mainIdColumnName]}`}
                    style={{ backgroundImage: `url('${process.env.REACT_APP_API_URL}/images/banner/${data[imgColumnName]}')` }}>
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
            ))}
        </div>
    </>
}