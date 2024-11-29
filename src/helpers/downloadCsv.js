export default function Main(data) {
  const convertToCSV = data => {
    const csvArray = []
    const headers = Object.keys(data[0])

    const excludedFields = ['_id', 'fkListingId', 'fkBusinessId', 'isPublic']

    const filteredHeaders = headers.filter(header => !excludedFields.includes(header))
    csvArray.push(['S.no.', ...filteredHeaders].join(','))

    data.forEach((row, index) => {
      const createdAt = new Date(row['createdAt'])
      const formattedCreatedAt = createdAt.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })
      const values = [
        index + 1,
        ...filteredHeaders.map(header => (header === 'createdAt' ? formattedCreatedAt : row[header]))
      ]
      csvArray.push(values.join(','))
    })

    return csvArray.join('\n')
  }

  const csvContent = convertToCSV(data)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob, 'leads_data.csv')
  } else {
    link.href = window.URL.createObjectURL(blob)
    link.download = 'leads_data.csv'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(link.href)
  }
}
