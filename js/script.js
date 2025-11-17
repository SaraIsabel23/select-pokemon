
const button = document.getElementById('get-pokemon');
const select = document.getElementById('pokemon-select');
const infoDiv = document.getElementById('pokemon-info');


button.addEventListener('click', () => {
  const nombrePokemon = select.value;
  
  fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`)
    .then(respuesta => respuesta.json())
    .then(datosPokemon => {
      const urlsTipos = datosPokemon.types.map(tipo => tipo.type.url);
      const promesasTipos = urlsTipos.map(url => 
        fetch(url)
        .then(res => res.json())
      );
      return Promise.all(promesasTipos)
        .then(datosTipos => {
          return {
            pokemon: datosPokemon,
            tipos: datosTipos
          };
        });
    })
    .then(datosCompletos => {
      mostrarInformacion(datosCompletos);
    });
});

function mostrarInformacion(datos) {
  const pokemon = datos.pokemon;
  const tipos = datos.tipos;
  
  const nombresTiposES = tipos.map(tipo => {
    const nombreEspanol = tipo.names.find(n => n.language.name === "es");
    return nombreEspanol ? nombreEspanol.name : tipo.name;
  });
  
  const etiquetasTipos = nombresTiposES.map(tipo => 
    `<span class="type-tag">${tipo}</span>`
  ).join('');
  
  const html = `
    <h2 class="pokemon-name">${pokemon.name}</h2>
    <img class="pokemon-image" src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
    
    <div class="types-container">
      ${etiquetasTipos}
    </div>
    
    <div class="pokemon-stats">
      <div class="stat">
        <span class="stat-label">Altura:</span> ${(pokemon.height / 10).toFixed(1)} m
      </div>
      <div class="stat">
        <span class="stat-label">Peso:</span> ${(pokemon.weight / 10).toFixed(1)} kg
      </div>
    </div>
  `;
  
  infoDiv.innerHTML = html;
}