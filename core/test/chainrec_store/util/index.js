function random() {
    return btoa(Math.random().toString(36))
}

function parseResponse(tx) {
    return JSON.parse(String.fromCharCode.apply(null, tx.data))
}

module.exports = {
    random,
    parseResponse
}