import { getCompletions, getPlumbers } from "./dataAccess.js"

export const Completions = () => {
    const completions = getCompletions()
    
    let html = `
    <ul>
    ${
        completions.map(convertCompletionToListElement).join("")
    }
    </ul>
    `
    return html
}

const convertCompletionToListElement = (completion) => {
    const plumbers = getPlumbers()
    const foundPlumber = plumbers.find(plumber => plumber.id === completion.plumberId)
    return `<li>Request #${completion.requestId} 
    was completed on ${completion.date_created} 
    by ${foundPlumber.name}</li>`
}