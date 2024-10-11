document.getElementById('search-btn').addEventListener('click', function() {
  let search = document.getElementById('product-search').value;
  if (search) {
    searchProduct(search);
  }
});

let products = []; // Variável global para armazenar os produtos

async function searchProduct(search) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(search)}&sort=sold_quantity&limit=20`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      products = data.results.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        available_quantity: product.available_quantity,
        permalink: product.permalink
      }));
      displayProducts(products);
    } else {
      document.getElementById('result').textContent = `Erro: ${response.status}`;
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    document.getElementById('result').textContent = 'Erro na requisição. Verifique o console para mais detalhes.';
  }
}

function displayProducts(products) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Título</th>
      <th>Preço</th>
      <th>Quantidade</th>
      <th>Link</th>
    </tr>
  `;

  products.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.title}</td>
      <td>R$ ${product.price}</td>
      <td>${product.available_quantity} Unid.</td>
      <td><a href="${product.permalink}" target="_blank">Acessar Produto</a></td>
    `;
    table.appendChild(row);
  });

  resultDiv.appendChild(table);
}

function downloadCSV(products, search) {
  const headers = ['ID', 'Title', 'Price', 'Quantity', 'Link'];
  const rows = products.map(p => [p.id, p.title, p.price, p.available_quantity, p.permalink]);

  const csvContent = `data:text/csv;charset=utf-8,${[headers, ...rows].map(e => e.join(',')).join('\n')}`;

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `produtos_mais_vendidos_${search}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Adiciona o evento de clique ao botão de download
document.getElementById('downloadBtn').addEventListener('click', function() {
  if (products.length > 0) {
    downloadCSV(products, document.getElementById('product-search').value);
  } else {
    alert('Nenhum produto encontrado para download.');
  }
});
