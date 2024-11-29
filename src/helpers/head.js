export default function Main({ title = 'BCN-India', description = '', image = '/logo.png', largeImage = true }) {
  image = window.location.origin + image
  const url = window.location.origin + window.location.pathname

  document.querySelector('title').innerText = title
  document.querySelector('meta[name="title"]').content = title
  document.querySelector('meta[name="description"]').content = description

  document.querySelector('meta[property="og:title"]').content = title
  document.querySelector('meta[property="og:description"]').content = description
  document.querySelector('meta[property="og:image"]').content = image
  document.querySelector('meta[property="og:url"]').content = url

  document.querySelector('meta[property="twitter:title"]').content = title
  document.querySelector('meta[property="twitter:description"]').content = description
  document.querySelector('meta[property="twitter:image:src"]').content = image
  document.querySelector('meta[property="twitter:url"]').content = url

  if (largeImage) document.querySelector('meta[property="twitter:card"]').content = 'summary_large_image'
  else document.querySelector('meta[property="twitter:card"]').content = 'summary'

  window.scrollTo(0, 0)
}
