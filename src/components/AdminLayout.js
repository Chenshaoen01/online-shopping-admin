import { Outlet } from "react-router-dom"
import SideBar from "./SideBar"
import { LoadingPage } from "../components/LoadingPage.js";

export default () => {
    return <>
        <LoadingPage></LoadingPage>
        <div className="body-container">
            <SideBar />
            <div className="main-conteant-area">
                <Outlet />
            </div>
        </div>
    </>
}