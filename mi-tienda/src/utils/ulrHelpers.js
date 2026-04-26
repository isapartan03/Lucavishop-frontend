const BACKEND_URL = 'https://lucavishop.com/api'
console.log('url.enc-', BACKEND_URL)
export const getImageUrl = (relativePath) => {
    console.log('url-', relativePath)
    if (!relativePath) return null
    // Si ya es una URL absoluta (empieza con http), la devolvemos tal cual
    if (relativePath.startsWith('http')) return relativePath
    // Si no, le anteponemos la URL del backend
    const url = `${BACKEND_URL}${relativePath}`
    console.log('la url despues del if=', url)
    return `${BACKEND_URL}${relativePath}`
}
