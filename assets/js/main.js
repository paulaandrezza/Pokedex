const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modal = document.getElementById('modalPokemon')

const typeDetail = document.getElementsByClassName("modal-detail")[0];

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="showDetails('${pokemon.name}')">
            <span class="number">#${("000" + pokemon.number).slice(-3)}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})


// Abrindo a tela de detalhes do pokemon
function showDetails(name) {
    document.body.style.overflow = 'hidden';

    const title = document.getElementById("title");

    pokeApi.getPokemonByName(name)
        .then((pokemon) => {
            const newTitleHtml = convertPokemonToDetailStats(pokemon);
            title.innerHTML = newTitleHtml;
            const newTypeHtml = convertPokemonToDetailType(pokemon);
            typeDetail.innerHTML = newTypeHtml
        })


    modal.style.display = "Block";
}

// Fechando o modal clicando no x
function closeModal(modalName) {
    modal.style.display = "none";
}


function convertPokemonToDetailStats(pokemon) {
    const statsTabel = ['hp','atq','def','satq','sdef','spd']
    document.getElementById('pokemon-detail-img').setAttribute("src", pokemon.photo);
    for (let i = 0; i < statsTabel.length; i++) {
        document.documentElement.style.setProperty(`--my-end-width-${statsTabel[i]}`, `${pokemon.status[i]*120/100}px`);   
    }
    return `
    <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} N°${("000" + pokemon.number).slice(-3)}</h2>
    `
}
function convertPokemonToDetailType(pokemon) {
    let geracao = 1;
    if (pokemon.number > 151) {
        geracao = 2;
    }
    
    return `
    <div class="details-type">
        <ul class="types">
            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            <li class="generation">${geracao}ª Geração</li>
        </ul>
    </div>
    <ul class="top-information">
        <li class="info">
            <p class="name-info"><span>Altura</span></p>
            <p>${pokemon.height/10} m</p>
        </li>
        <li class="info">
            <p class="name-info"><span>Peso</span></p>
            <p>${pokemon.weight/10} kg</p>
        </li>
        <li class="info">
            <p class="name-info"><span>Habilidades</span></p>
            <ul class="habilities-list">
                ${pokemon.abilities.map((habilidade) => `<li class="habilidade">${habilidade}</li>`).join('')}
            </ul>
        </li>
    </ul>
    `
}