export default ({ lastPage, pageButtonList, currentPage, setCurrentPage, getDataList }) => {
    return <>
        <div className="main-conteant-footer">
            <div className="flex items-center">
                {currentPage > 1 && <button type="button" className="page-button page-button-pre"
                    onClick={() => { setCurrentPage(currentPage - 1) }}></button>}
                {currentPage > 3 && <div className="page-button-dots"></div>}
                {
                    pageButtonList.map(pageNum => <button type="button" key={pageNum}
                        className={pageNum === currentPage? "page-button active": "page-button"}
                        onClick={() => { setCurrentPage(pageNum) }}>{pageNum}
                    </button>)
                }
                {pageButtonList[pageButtonList.length - 1] < lastPage && <div className="page-button-dots"></div>}
                {currentPage < lastPage && <button type="button" className="page-button page-button-next"
                    onClick={() => { setCurrentPage(currentPage + 1) }}></button>}
            </div>
        </div>
    </>
}