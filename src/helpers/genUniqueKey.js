import md5 from 'md5'

export default function Main() {
  return md5(Math.round(Math.random() * 1e10).toString() + Date.now().toString())
}
