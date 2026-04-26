// src/utils/exportUtils.js
export const exportToCSV = (data, filename) => {
    if (!data.length) return
    const headers = Object.keys(data[0])
    const csvRows = [
        headers.join(','),
        ...data.map((row) =>
            headers.map((h) => JSON.stringify(row[h] ?? '')).join(','),
        ),
    ]
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}
