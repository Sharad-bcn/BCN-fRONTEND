const Main = async (element, type = 'Membership Card') => {
  try {
    if (!element) {
      console.error(`Element not found.`)
      return
    }

    const pdfOptions = {
      margin: 10,
      filename: type === 'Receipt' ? `Receipt.pdf` : `Membership Card.pdf`,
      image: { type: 'png', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    await window.html2pdf().set(pdfOptions).from(element).save()

    return Promise.resolve('PDF generated successfully.')
  } catch (err) {
    console.error('Error generating PDF:', err)
    return Promise.reject(err)
  }
}
export default Main
