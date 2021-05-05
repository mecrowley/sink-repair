import { getRequests, deleteRequest, getPlumbers, saveCompletion } from "./dataAccess.js"

export const Requests = () => {
    const requests = getRequests()
    
    let html = `
    <ul>
    ${
        requests.map(convertRequestToListElement).join("")
    }
    </ul>
    `
    return html
}

const convertRequestToListElement = (request) => {
    const plumbers = getPlumbers()
    return `<li>
    ${request.description}
    <select class="plumbers" id="plumbers">
    <option value="">Choose</option>
    ${
        plumbers.map(
            plumber => {
                return `<option value="${request.id}--${plumber.id}">${plumber.name}</option>`
            }
        ).join("")
    }
</select>
    <button class="request__delete"id="request--${request.id}">Delete</button>
    </li>`
}

const mainContainer = document.querySelector("#container")

mainContainer.addEventListener("click", click => {
    if (click.target.id.startsWith("request--")) {
        const [,requestId] = click.target.id.split("--")
        deleteRequest(parseInt(requestId))
    }
})

mainContainer.addEventListener(
    "change",
    (event) => {
        if (event.target.id === "plumbers") {
            const [requestId, plumberId] = event.target.value.split("--")
            const timestamp = Date.now()
            const date_created = new Date(timestamp).toLocaleDateString("en-US")
            const completion = {
                "requestId": parseInt(requestId),
                "plumberId": parseInt(plumberId),
                "date_created": date_created
             }
             saveCompletion(completion)
        }
    }
)