export const endpoint = 'http://localhost:4000/graphql'

export const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const options = {
    method: "POST",
    headers,
    body: JSON.stringify({})
}
