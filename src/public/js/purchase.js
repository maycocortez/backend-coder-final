const formPurchase = document.getElementById('form-purchase')

formPurchase.addEventListener('submit', e => {
  e.preventDefault()
  const name = e.target[0].value
  const address = e.target[1].value


  if (!name || !address) {
    Toastify({
      text: 'Faltan datos',
      className: 'warning',
      offset: {
        x: 0,
        y: 55
      }
    }).showToast()
  } else {
    formPurchase.submit()
  }
})