export const LoadingPage = () => {
    return <>
        <div id="loading-page" className="loading-page">
            <div className="loader"></div>
        </div>
    </>
}

export const LoadingPageShow = () => {
    document.getElementById('loading-page').style.display = "flex"
}

export const LoadingPageHide = () => {
    document.getElementById('loading-page').style.display = "none"
}