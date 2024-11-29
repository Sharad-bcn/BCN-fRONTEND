export default function Main(time, getTime = false) {
  if (getTime) return new Date(time).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  return new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).toLocaleDateString('en-US')
}
