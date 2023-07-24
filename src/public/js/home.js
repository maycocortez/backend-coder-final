const socket = io();

// Función para agregar productos al carrito
const addProductToCart = (idProduct) => {
  socket.emit('addProducts', idProduct);
  Toastify({
    text: 'Producto agregado!',
    className: 'info',
    style: {
      background: 'linear-gradient(to right,#000000)',
    },
    offset: {
      x: 0,
      y: 55,
    },
  }).showToast();
};

// Agregar evento click a los botones de agregar productos
const addProducts = document.querySelectorAll('.addProducts');
addProducts.forEach((btn) => {
  const idProduct = btn.getAttribute('data-id');
  btn.addEventListener('click', () => addProductToCart(idProduct));
});

// Función para eliminar productos del carrito
const removeProductFromCart = (idProduct, btn) => {
  socket.emit('removeProducts', idProduct);
  btn.classList.add('clicked');
};

// Agregar evento click a los botones de eliminar productos
const removeProducts = document.querySelectorAll('.removeProducts');
if (removeProducts) {
  removeProducts.forEach((btn) => {
    const idProduct = btn.getAttribute('data-id');
    btn.addEventListener('click', () => removeProductFromCart(idProduct, btn));
  });
}

// Función para actualizar el contenido del carrito
const updateCart = (data) => {
  cartInfo.innerHTML += `
    <li class="cardPreviusItems">
      <div class="img-info">
        <img alt="${data.title}" class="imgCartPrevius" src="${data.thumbnail}"></img>
        <div class="infoPrevius">
          <p class="infoTitle">${data.title}</p>
          <p class="infoCant"><strong>${data.quantity} </strong>x<strong> ${data.price}</strong></p>
          <div class="infoFin">
          </div>
        </div>
      </div>
      <div class="delete-price">
        <div class="removeProducts" id="removeProducts" data-id="${data.id}">

        </div>
        <div class="price-conten">
          <p>$</p>
          <p class="price">${data.totalPrice}</p>
        </div>
      </div>
    </li>
  `;
}

// Función para vaciar el carrito
const emptyCart = () => {
  cartInfo.innerHTML = '';
};

// Función para mostrar el número de productos en el carrito en un popup
const showCartPopup = (data) => {
  popupCart.innerHTML = `<p>${data.countCart}</p>`;
  popupCart.style.opacity = '1';
  popupCartXs.innerHTML = `<p>${data.countCart}</p>`;
  popupCartXs.style.opacity = '1';
};

// Función para ocultar elementos del DOM
const hideDOMElements = () => {
  sectionTotal.style.display = 'none';
  sectionButtons.style.display = 'none';
  popupCart.innerHTML = '';
  popupCart.style.opacity = '0';
  popupCartXs.innerHTML = '';
  popupCartXs.style.opacity = '0';
};

// Actualizar el carrito cuando se agreguen productos
socket.on('addProducts', (data) => {
  cartInfo.textContent = '';
  totalCart.textContent = '';
  data.productsInCart.forEach((prod) => {
    updateCart(prod);
  });
  totalCart.innerHTML = data.totalCart;
  sectionTotal.style.display = 'flex';
  sectionButtons.style.display = 'flex';
  showCartPopup(data);

  // Volver a agregar eventos de click a los botones de eliminar productos
  const removeProducts = document.querySelectorAll('.removeProducts');
  removeProducts.forEach((btn) => {
    const idProduct = btn.getAttribute('data-id');
    btn.addEventListener('click', () => removeProductFromCart(idProduct, btn));
  });
});

// Mostrar mensaje cuando un producto no tiene stock
socket.on('noStock', () => {
  Toastify({
    text: 'Producto sin Stock',
    className: 'warning',
    offset: {
      x: 0,
      y: 55,
    },
  }).showToast();
});

// Actualizar el carrito cuando se eliminen productos
socket.on('removeProducts', (data) => {
  setTimeout(() => {
    cartInfo.textContent = '';
    totalCart.textContent = '';
    if (data.totalCart === 0) {
      emptyCart();
      hideDOMElements();
    } else {
      data.productsInCart.forEach((prod) => {
        updateCart(prod);
      });
      showCartPopup(data);
      totalCart.innerHTML = data.totalCart;
    }
  }, 500);
});

// Eliminar todos los productos del carrito
deleteFrom.addEventListener('click', () => {
  socket.emit('deleteProductsInCart');
});

socket.on('deleteProductsInCart', (data) => {
  cartInfo.textContent = '';
  totalCart.textContent = '';
  emptyCart();
  hideDOMElements();
});

// Agregar evento click al botón "cardMore"
const cardMore = document.getElementById('cardMore');
cardMore.addEventListener('click', () => {
  cardMore.classList.toggle('is-selected');
});

// Agregar evento click al enlace "purchaser-link"
const purchaserLink = document.getElementById('purchaser-link');
purchaserLink.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('purchaserCart');
});

// Mostrar mensaje cuando no haya más stock de un producto y se intente agregar al carrito
socket.on('noMoreStock', (data) => {
  const productTitle = data.map((data) => data.title);
  Swal.fire({
    title: 'No hay mas stock',
    html: `<p> No hay mas stock de "${productTitle.toString()}" ¿desea eliminarlo? </p>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Borrar',
    customClass: {
      htmlContainer: 'swalText',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const productId = data.map((data) => data.idProduct);
      for (let i = 0; i < productId.length; i++) {
        socket.emit('removeProducts', productId[i]);
      }
      Swal.fire('Eliminado', 'Su producto fue eliminado', 'success');
    }
  });
});

// Redireccionar a la página del comprador cuando se realice la compra
socket.on('purchaserCart', () => {
  window.location = purchaserLink.href;
});
