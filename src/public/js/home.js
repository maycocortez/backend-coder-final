
const addToCart = document.querySelectorAll('.addToCart')
const socket = io()



for (let i = 0; i < addToCart.length; i++) {
  addToCart[i].addEventListener('click', e => {
    const idProduct = addToCart[i].getAttribute('data-id')
    socket.emit('addToCart', idProduct)
    Toastify({
      text: 'Producto agregado!',
      className: 'info',
      style: {
        background: 'linear-gradient(to right,#000000)'
      },
      offset: {
        x: 0,
        y: 55
      }
    }).showToast()
  })
}


const cardPrevius = document.getElementById('cardPrevius')
const totalCart = document.getElementById('totalCart')
const cartDelete = document.querySelectorAll('.cartDelete')
const vaciarcarrito = document.getElementById('vaciar-carrito')
const sectionTotal = document.getElementById('sectionTotal')
const sectionButtons = document.getElementById('sectionButtons')
const popupCartXs = document.getElementById('popupCartXs')
const popupCart = document.getElementById('popupCart')

if (cartDelete) {
  for (let i = 0; i < cartDelete.length; i++) {
    cartDelete[i].addEventListener('click', e => {
      const idProduct = cartDelete[i].getAttribute('data-id')
      socket.emit('removeProducts', idProduct)
      cartDelete[i].classList.add('clicked')
    })
  }
}

const updatecart = data => {
  cardPrevius.innerHTML += `
  <li class="cardPreviusItems">
    <div class="img-info">
      <img alt=${data.title} class="imgCartPrevius" src=${data.thumbnail}></img>
    <div class="infoPrevius">
     <p class="infoTitle">${data.title}</p>
     <p class="infoCant"><strong>${data.quantity} </strong>x<strong> ${data.price}</strong></p>
      <div class="infoFin">
        
      </div>
    </div>
    </div>
      <div class="delete-price">
      <div class="cartDelete" id="cartDelete" data-id=${data.id}>
      <span class="icon">
        <span class="lid"></span>
        <span class="can"></span>
        <span class="trash"></span>
      </span>
      </div>
      <div class="price-conten">
        <p>$</p>
        <p class="price">${data.totalPrice}</p>
      </div>
    </div>
  </li>
  `
}
const emptyCart = () => {
  cardPrevius.innerHTML += `

`
}
const popupVisible = data => {
  popupCart.innerHTML = `<p>${data.countCart}</p>`
  popupCart.style.opacity = '1'
  popupCartXs.innerHTML = `<p>${data.countCart}</p>`
  popupCartXs.style.opacity = '1'
}
const domHidden = () => {
  sectionTotal.style.display = 'none'
  sectionButtons.style.display = 'none'
  popupCart.innerHTML = ''
  popupCart.style.opacity = '0'
  popupCartXs.innerHTML = ''
  popupCartXs.style.opacity = '0'
}

socket.on('addToCart', data => {
  cardPrevius.textContent = ''
  totalCart.textContent = ''
  data.productsInCart.forEach(prod => {
    updatecart(prod)
  })
  totalCart.innerHTML = data.totalCart
  sectionTotal.style.display = 'flex'
  sectionButtons.style.display = 'flex'
  popupVisible(data)
  
  const cartDelete = document.querySelectorAll('.cartDelete')
  for (let i = 0; i < cartDelete.length; i++) {
    cartDelete[i].addEventListener('click', e => {
      const idProduct = cartDelete[i].getAttribute('data-id')
      socket.emit('removeProducts', idProduct)
      cartDelete[i].classList.add('clicked')
    })
  }


})

socket.on('noStock', () => {
  Toastify({
    text: 'Producto sin Stock',
    className: 'warning',
    offset: {
      x: 0,
      y: 55
    }
  }).showToast()
})







socket.on('removeProducts', data => {
  setTimeout(() => {
    cardPrevius.textContent = ''
    totalCart.textContent = ''
    if (data.totalCart === 0) {
      emptyCart()
      domHidden()
    } else {
      data.productsInCart.forEach(prod => {
        updatecart(prod)
      })
      popupVisible(data)
      totalCart.innerHTML = data.totalCart
    }
  }, 500)
})

vaciarcarrito.addEventListener('click', () => {
  socket.emit('deleteProductsInCart')
})
socket.on('deleteProductsInCart', data => {
  cardPrevius.textContent = ''
  totalCart.textContent = ''
  emptyCart()
  domHidden()
})

const cardMore = document.getElementById('cardMore')
cardMore.addEventListener('click', () => {
  cardMore.classList.toggle('is-selected')
})


const purchaserLink = document.getElementById('purchaser-link')
purchaserLink.addEventListener('click', e => {
  e.preventDefault()
  socket.emit('purchaserCart')
})

socket.on('noMoreStock', data => {
  const productTitle = data.map(data => data.title)
  Swal.fire({
    title: 'No hay mas stock',
    html:
      `<p> No hay mas stock de "${productTitle.toString()} desea eliminarlo?" </p>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Borrar',
    customClass: {
      htmlContainer: 'swalText'
    }
  }).then(result => {
    if (result.isConfirmed) {
      const productId = data.map(data => data.idProduct)
      console.log(productId[0])
      for (let i = 0; i < productId.length; i++) {
        socket.emit('removeProducts', productId[i])
      }
      Swal.fire('Eliminado', 'Su producto fue eliminado', 'success')
    }
  })
})
socket.on('purchaserCart', () => {
  window.location = purchaserLink.href
})