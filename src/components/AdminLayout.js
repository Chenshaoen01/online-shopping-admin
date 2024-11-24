import { Outlet } from "react-router-dom"
import SideBar from "./SideBar"

export default () => {
    return <>
        <div className="body-container">
            <SideBar />
            <div className="main-conteant-area">
                <Outlet />
            </div>
        </div>
    </>
}