export default function Main() {
  const startTime = 0 // 24-hour format, so 0 corresponds to 00:00
  const endTime = 24 * 60 // 24 hours converted to minutes

  const timeArray = []

  for (let i = startTime; i < endTime; i += 60) {
    const hours = Math.floor(i / 60)
    const minutes = i % 60

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    timeArray.push({ field: formattedTime })
  }

  return timeArray
}
