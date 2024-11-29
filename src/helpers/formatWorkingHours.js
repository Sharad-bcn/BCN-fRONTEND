export default function Main(timings) {
  let formattedHours = []
  let currentRange = { start: '', end: '', isClosed: false, from: '', to: '' }

  for (let i = 0; i < timings.length; i++) {
    const currentDay = timings[i]
    const nextDay = timings[i + 1]

    if (currentRange.start === '') {
      currentRange.start = currentDay.day.substring(0, 3).toUpperCase()
      currentRange.isClosed = currentDay.isClosed
      currentRange.from = currentDay.from
      currentRange.to = currentDay.to
    }

    const areConsecutiveDays =
      nextDay &&
      ((currentDay.isClosed && nextDay.isClosed) ||
        (!currentDay.isClosed && !nextDay.isClosed && currentDay.from === nextDay.from && currentDay.to === nextDay.to))

    if (areConsecutiveDays) {
      currentRange.end = nextDay.day.substring(0, 3).toUpperCase()
    } else {
      currentRange.end = currentDay.day.substring(0, 3).toUpperCase()
      formattedHours.push({ ...currentRange })
      currentRange = { start: '', end: '', isClosed: false, from: '', to: '' }
    }
  }

  return formattedHours.map(({ start, end, isClosed, from, to }) => ({
    day: start === end ? start : `${start} - ${end}`,
    isClosed,
    from,
    to
  }))
}
