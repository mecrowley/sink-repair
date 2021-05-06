import { getRequests, deleteRequest, getPlumbers, saveCompletion, getCompletions, fetchPlumbers } from "./dataAccess.js"

export const Requests = () => {
    const requests = getRequests()
    const completions = getCompletions()
    let requestsCompleted = requests.map(request => {
        if (completions.length === 0) {
            request.completed = false
        } else {
            for (const completion of completions) {
                if (request.id === completion.requestId) {
                    request.completed = true
                    return request
                }
                request.completed = false
            }
        }
        return request
    })

    requestsCompleted.sort((a, b) => a.completed - b.completed)

    let html = `
    <div class="requests__container">
    <div class="requests__header">
    <div class="header__description">Description</div><div class="header__completed">Completed By</div>
    </div>
    <div class="requests">
    ${requestsCompleted.map(convertRequestToDivElement).join("")
        }
    </div>
    </div>
    `
    return html
}

const convertRequestToDivElement = (request) => {
    const plumbers = getPlumbers()
    const completions = getCompletions()
    if (request.completed === false) {
        return `<div class="request incomplete">
            <div class="description">
            ${request.description}
            </div>
            <div class="request__mods">
            <div class="plumber__selection">
            <select class="plumbers" id="plumbers">
            <option value="">Choose</option>
            ${plumbers.map(
            plumber => {
                return `<option value="${request.id}--${plumber.id}">${plumber.name}</option>`
            }
        ).join("")
            }
            </select>
            </div>
            <div class="delete__button">
            <button class="request__delete"id="request--${request.id}">Delete</button>
            </div>
            </div>
            </div>`

    } else {
        const foundCompletion = completions.find(completion => completion.requestId === request.id)
        const foundPlumber = plumbers.find(plumber => foundCompletion.plumberId === plumber.id)
        return `<div class="request complete">
            <div class="description">
            ${request.description}
            </div>
            <div class="request__mods">
            <div class="selected__plumber">
            ${foundPlumber.name}
            </div>
            <div class="delete__button">
            <button class="request__delete"id="request--${request.id}">Delete</button>
            </div>
            </div>
            </div>`
    }
}



const mainContainer = document.querySelector("#container")

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

mainContainer.addEventListener("click", click => {
    if (click.target.id.startsWith("request--")) {
        const [, requestId] = click.target.id.split("--")
        deleteRequest(parseInt(requestId))
    }
})