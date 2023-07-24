const handleScroll = () => {
  const nav = document.querySelector(".nav");
  nav.classList.toggle("nav-scroll", window.scrollY > 400);
};

window.addEventListener("scroll", handleScroll);

const handleMenuItemIntersection = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const menuItems = document.querySelectorAll(".menu");
      const menuActual = Array.from(menuItems).find(
        (item) => item.dataset.url === entry.target.id
      );
      menuActual.classList.add("active");
      menuItems.forEach((menuItem) => {
        if (menuItem !== menuActual) {
          menuItem.classList.remove("active");
        }
      });
    }
  });
};

const menuItems = document.querySelectorAll(".seccion");
const menuObserver = new IntersectionObserver(handleMenuItemIntersection, {
  root: null,
  rootMargin: "0px",
  threshold: 0.8,
});
menuItems.forEach((item) => menuObserver.observe(item));

const cartIcon = document.querySelector(".cartIcon");
const navMobile = document.querySelector(".nav-mobile");
const navItemMobile = document.getElementsByClassName("nav-mobile-item");

const navMobileOpenClose = () => {
  cartIcon.classList.toggle("is-active");
  navMobile.classList.toggle("is-active");
};

cartIcon.addEventListener("click", navMobileOpenClose);

for (let i = 0; i < navItemMobile.length; i++) {
  navItemMobile[i].addEventListener("click", () => {
    setTimeout(() => {
      navMobileOpenClose();
    }, 200);
  });
}


const modalCarrito = document.getElementById("modal-carrito");
const openCarritoXs = document.getElementById("carrito_xs");
const openCarrito = document.getElementById("carrito");
const closeCarrito = document.getElementById("close-carrito");



const handleOpenCarrito = (e) => {
  e.preventDefault();
  carrito.length === 0 ? alertVacio() : modalCarrito.classList.add("modal_show");
};

openCarritoXs.addEventListener("click", handleOpenCarrito);
openCarrito.addEventListener("click", handleOpenCarrito);

closeCarrito.addEventListener("click", () => {
  modalCarrito.classList.remove("modal_show");
});