import { useContext } from "react"
import { AdminContext } from "./AdminContext"

export default () => {
    const { hintText } = useContext(AdminContext)
    return <>
        <div className="modal micromodal-slide" id="notify-modal" aria-hidden="true">
            <div className="modal__overlay" data-micromodal-close>
                <div className="modal__container" role="dialog" aria-modal="true" aria-labelledby="notify-modal-title">
                    <header className="modal__header">
                        <h2 className="modal__title" id="notify-modal-title">
                            通知
                        </h2>
                        <button className="modal__close" aria-label="Close modal" data-micromodal-close></button>
                    </header>
                    <main className="modal__content" id="notify-modal-content">
                        {hintText}
                    </main>
                </div>
            </div>
        </div>
    </>
}