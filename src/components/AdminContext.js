import { createContext, useState } from "react"

export const AdminContext = createContext(null)
export const AdminProvider = ({children}) => {
    const [hintText, setHintText] = useState("")
    
    return <AdminContext.Provider value={{hintText, setHintText}}>{children}</AdminContext.Provider>
}