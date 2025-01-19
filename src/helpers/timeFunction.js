export const dateStringTransfer = (sourceDateTime) => {
    const dateTime = new Date(sourceDateTime)
    if(!isNaN(dateTime)) {
        const year = dateTime.getFullYear()
        const month = (dateTime.getMonth() + 1).toString().padStart(2, "0")
        const date = dateTime.getDate()

        return `${year}/${month}/${date}`
    } else {
        return ""
    }
}