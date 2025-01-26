import { useCallback } from "react"

export default ({ MicroModal, modalName, columnList, mainIdColumnName, dataList, dataListActions, setDataList, getDetailData, doDelete }) => {
    const setDataChecked = useCallback((isChekedValue, dataIndex) => {
        const newDataLst = [...dataList]
        newDataLst[dataIndex].isChecked = isChekedValue
        setDataList(newDataLst)
    }, [dataList])

    const isActionButtonExist = ((targetAction) => dataListActions.some(action => action === targetAction))
    return <>
        {/* 電腦版列表 */}
        <table className="data-list-table w-full hidden lg:table">
            <thead>
                <tr>
                    <th></th>
                    {columnList.map((column, columnIndex) => <th key={columnIndex}>{column.columnChName}</th>)}
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {
                    (Array.isArray(dataList) && dataList.length > 0) ? <>
                        {dataList.map((data, dataIndex) => <tr key={`list-item${data[mainIdColumnName]}`}>
                            <td>
                                <input type="checkbox" checked={data.isChecked}
                                    onChange={(e) => { setDataChecked(e.target.checked, dataIndex) }}></input>
                            </td>
                            {columnList.map((column, columnIndex) => <td key={`pc${columnIndex}`}>{data[column.columnName]}</td>)}
                            <td className="action-button-column">
                                {isActionButtonExist('edit') && (
                                    <button type="button" className="action-button button-transparent"
                                        onClick={() => { getDetailData(data[mainIdColumnName]); MicroModal.show(modalName); }}>編輯</button>
                                )}
                                {isActionButtonExist('detail') && (
                                    <button type="button" className="action-button button-transparent"
                                        onClick={() => { getDetailData(data[mainIdColumnName]); MicroModal.show(modalName); }}>查看</button>
                                )}
                                {isActionButtonExist('delete') && (
                                    <button type="button" className="action-button button-transparent"
                                        onClick={() => { doDelete([data[mainIdColumnName]]) }}>刪除</button>
                                )}
                            </td>
                        </tr>)}
                    </> : <tr><td colSpan={"100%"}>查無資料</td></tr>
                }

            </tbody>
        </table>
        {/* 行動版 */}
        <div className="flex flex-col p-5 lg:hidden">
            {
                (Array.isArray(dataList) && dataList.length > 0) ? <>
                    {dataList.map((data, dataIndex) => <div className="list-item-card mb-3" key={`mobile-list-item${data[mainIdColumnName]}`}>
                        <div className="flex justify-between">
                            <input type="checkbox" checked={data.isChecked}
                                onChange={(e) => { setDataChecked(e.target.checked, dataIndex) }}></input>
                            <div className="flex">
                                {isActionButtonExist('edit') && (
                                    <button type="button" className="button-transparent me-3"
                                        onClick={() => { getDetailData(data[mainIdColumnName]); MicroModal.show(modalName); }}>編輯</button>
                                )}
                                {isActionButtonExist('detail') && (
                                    <button type="button" className="button-transparent me-3"
                                        onClick={() => { getDetailData(data[mainIdColumnName]); MicroModal.show(modalName); }}>查看</button>
                                )}
                                {isActionButtonExist('delete') && (
                                    <button type="button" className="button-transparent"
                                        onClick={() => { doDelete([data[mainIdColumnName]]) }}>刪除</button>
                                )}
                            </div>
                        </div>
                        <table className="list-item-content-table">
                            <tbody>
                                {columnList.map((column, columnIndex) => <tr key={'mobile' + columnIndex}>
                                    <td className="whitespace-nowrap">{column.columnChName}</td>
                                    <td>{data[column.columnName]}</td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>)}
                </> : <div className="text-center mt-16">查無資料</div>
            }
        </div>
    </>
}