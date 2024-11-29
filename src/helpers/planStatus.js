export default function Main(expirationDateStr) {
  const expirationDate = new Date(expirationDateStr)
  const currentDate = new Date()

  if (currentDate > expirationDate) {
    return 'Expired'
  } else if (expirationDate - currentDate <= 7 * 24 * 60 * 60 * 1000) {
    // Difference in milliseconds, 7 days
    return 'Expiring'
  } else {
    return 'Active'
  }
}
