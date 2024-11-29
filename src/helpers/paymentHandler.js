const Main = async (key, order, name, email, contact, description, cb, failureCB) => {
  const options = {
    key,
    amount: order.amount,
    currency: 'INR',
    name: 'BCN India',
    description: description + ' year subscription plan for BCN India',
    image: '/logo.png',
    order_id: order.id,
    handler: function (response) {
      cb(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature)
    },
    prefill: {
      name,
      email,
      contact
    },
    notes: {
      address:
        'GBCN SOFTWARE PRIVATE LIMITED B 12, Pride Crosswinds, Bukkasagara Vill,anekal, Bannerghatta, Bangalore Rural, Bangalore South, Karnataka, India, 560083'
    },
    theme: {
      color: '#ff7538'
    },
    readOnly: {
      name: true,
      email: true,
      contact: true
    },
    send_sms_hash: true,
    modal: {
      // ondismiss: function () {
      //   failureCB()
      // }
      backdropclose: true,
      escape: true,
      handleback: false,
      confirm_close: true,
      animation: true
    }
  }
  const razor = new window.Razorpay(options)

  // Function to close Razorpay modal when back button is pressed
  const handlePopState = () => {
    razor.close()
    const razorpayContainer = document.querySelector('.razorpay-container')
    if (razorpayContainer) razorpayContainer.style.display = 'none'
    window.history.replaceState(null, null, window.location.pathname)
    window.removeEventListener('popstate', handlePopState)

    // Call failure callback
    // failureCB()
  }

  window.addEventListener('popstate', handlePopState)
  window.history.pushState(null, null, window.location.pathname + '#processingPayment')

  razor.open()
  razor.on('payment.failed', function (response) {
    //   // alert(`Code: ${response.error.code}`)
    //   // alert(`Description: ${response.error.description}`)
    //   // alert(`Source: ${response.error.source}`)
    //   // alert(`Step: ${response.error.step}`)
    //   // alert(`Reason: ${response.error.reason}`)
    //   // alert(`Order ID: ${response.error.metadata.order_id}`)
    //   // alert(`Payment ID: ${response.error.metadata.payment_id}`)
    //   // Call failure callback
    failureCB()
    window.removeEventListener('popstate', handlePopState)
  })
}

export default Main
