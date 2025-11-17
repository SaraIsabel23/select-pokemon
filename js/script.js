// Obtener elementos del DOM
const pokemonSelect = document.getElementById('pokemon-select');
const getButton = document.getElementById('get-pokemon');
const pokemonInfo = document.getElementById('pokemon-info');
const errorMessage = document.getElementById('error-message');

// Event listener para el botón
getButton.addEventListener('click', obtenerPokemon);

// Función para obtener información del Pokémon
async function obtenerPokemon() {
  // Obtener el valor del select
  const pokemonName = pokemonSelect.value;
  
  // URL de la API
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  
  try {
    // Hacer fetch a la API
    const respuesta = await fetch(url);
    
    // Verificar si la respuesta es correcta
    if (!respuesta.ok) {
      throw new Error('Pokémon no encontrado');
    }
    
    // Convertir respuesta a JSON
    const datos = await respuesta.json();
    
    // Mostrar la información del Pokémon
    mostrarPokemon(datos);
    
    // Ocultar mensaje de error si hay
    errorMessage.classList.add('hidden');
    
  } catch (error) {
    // Mostrar mensaje de error
    mostrarError(error.message);
    pokemonInfo.classList.add('hidden');
  }
}

// Función para mostrar la información del Pokémon
function mostrarPokemon(datos) {
  // Actualizar nombre
  document.getElementById('pokemon-name').textContent = datos.name;
  
  // Actualizar imagen
  document.getElementById('pokemon-image').src = 
    datos.sprites.other['official-artwork'].front_default || 
    datos.sprites.front_default;
  
  // Actualizar altura (convertir a metros)
  const altura = (datos.height / 10).toFixed(1);
  document.getElementById('pokemon-height').textContent = `${altura} m`;
  
  // Actualizar peso (convertir a kg)
  const peso = (datos.weight / 10).toFixed(1);
  document.getElementById('pokemon-weight').textContent = `${peso} kg`;
  
  // Actualizar tipos usando forEach
  const tiposContainer = document.getElementById('pokemon-types');
  tiposContainer.innerHTML = ''; // Limpiar tipos anteriores
  
  // Usar forEach para iterar sobre los tipos
  datos.types.forEach((tipoObj) => {
    const badge = document.createElement('span');
    badge.className = 'type-badge';
    badge.textContent = tipoObj.type.name;
    tiposContainer.appendChild(badge);
  });
  
  // Mostrar el contenedor de información
  pokemonInfo.classList.remove('hidden');
}

// Función para mostrar mensaje de error
function mostrarError(mensaje) {
  errorMessage.textContent = `Error: ${mensaje}`;
  errorMessage.classList.remove('hidden');
}