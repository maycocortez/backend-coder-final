
window.addEventListener("scroll", () => {
  let nav = document.querySelector(".nav");
  nav.classList.toggle("nav-scroll", window.scrollY > 400);
});
const menu = document.querySelectorAll(".menu");
const menu1 = document.querySelectorAll(".seccion");
const menu2 = new IntersectionObserver(
  (items) => {
    items.forEach((entrada) => {
      if (entrada.isIntersecting) {
        let menuActual = Array.from(menu).find(
          (item) => item.dataset.url === entrada.target.id
        );
        menuActual.classList.add("active");
        for (let menuAnterior of menu) {
          menuAnterior != menuActual && menuAnterior.classList.remove("active");
        }
      }
    });
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: 0.8,
  }
);
menu1.forEach((item) => menu2.observe(item));

const cartIcon = document.querySelector(".cartIcon");

let navItemMobile = document.getElementsByClassName("nav-mobile-item");

let navMobileOpenClose = () => {
  cartIcon.classList.toggle("is-active");
  nav_mobile.classList.toggle("is-active");
};

cartIcon.addEventListener("click", () => {
  navMobileOpenClose();
});

for (let i = 0; i < navItemMobile.length; i++) {
  navItemMobile[i].addEventListener("click", function () {
    setTimeout(() => {
      navMobileOpenClose();
    }, 200);
  });
}

const modalCarrito = document.getElementById("modal-carrito");
const openCarrito = document.getElementById("carrito");
const openCarritoXs = document.getElementById("carrito_xs");
const closeCarrito = document.getElementById("close-carrito");

const alertVacio = () => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: "No hay productos en el carrito",
  });
};

openCarritoXs.addEventListener("click", (e) => {
  e.preventDefault();
  carrito.length === 0
    ? alertVacio()
    : modalCarrito.classList.add("modal_show");
});

openCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  carrito.length === 0
    ? alertVacio()
    : modalCarrito.classList.add("modal_show");
});

closeCarrito.addEventListener("click", () => {
  modalCarrito.classList.remove("modal_show");
});