const itemTableContent = document.getElementById('itemTableContent');
const socket = io();

const cargarDom = (products) => {
  itemTableContent.innerHTML = products.map((prod) => `
    <tr>
      <td>${prod._id}</td>
      <td class="itemLeft">${prod.title}</td>
      <td class="itemLeft">${prod.description}</td>
      <td>${prod.price}</td>
      <td>${prod.status}</td>
      <td>${prod.category}</td>
      <td class="imgConten">
        <img class="imgTable" src="${prod.thumbnail}" alt="${prod.title}" />
      </td>
      <td>${prod.code}</td>
      <td>${prod.stock}</td>
    </tr>
  `).join('');
};

const emitAndDisplayResponse = (event, dataField, responseField) => {
  const form = document.getElementById(event + 'Form');
  const responseElement = document.getElementById(responseField);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = document.getElementById(dataField).value;
    socket.emit(event, formData);
    responseElement.innerHTML = '';
  });

  socket.on(event, (data) => {
    responseElement.innerHTML = data.messaje;
    cargarDom(data.products);
  });
};

emitAndDisplayResponse('getProduct', 'getProduct', 'resGet');
emitAndDisplayResponse('addProduct', 'addProduct', 'resAdd');
emitAndDisplayResponse('putProduct', 'infoPutProduct', 'resPut');
emitAndDisplayResponse('deleteProduct', 'productDelete', 'resDelete');

socket.emit('messaje', 'Conectado con el Cliente por Sockets');

socket.on('estado', (data) => {
  console.log(data);
});
