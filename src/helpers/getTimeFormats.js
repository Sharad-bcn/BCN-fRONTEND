export default function Main(date, monthYear = false) {
  if (!(date instanceof Date) || isNaN(date)) {
    return 'Invalid Date'
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const day = date.getDate()
  const monthAbbreviation = monthNames[date.getMonth()]
  const year = date.getFullYear().toString()
  if (monthYear) return `${monthAbbreviation}/${year}`
  return `${day}/${monthAbbreviation}/${year}`
}
