// Datos de los Pokémon
const pokemonData = [
    {
        number: 1,
        name: "Bulbasaur",
        types: ["grass", "poison"],
        sprite: "1.png"
    },
    {
        number: 2,
        name: "Ivysaur",
        types: ["grass", "poison"],
        sprite: "2.png"
    },
    {
        number: 3,
        name: "Venusaur",
        types: ["grass", "poison"],
        sprite: "3.png",
        variants: [
            {
                name: "Mega Venusaur",
                types: ["grass", "poison"],
                sprite: "10033.png",
                special: "mega"
            },
            {
                name: "Venusaur G-Max",
                types: ["grass", "poison"],
                sprite: "10195.png",
                special: "gigamax"
            }
        ]
    },
    // ... más Pokémon
];

// Configuración de tipos y sus traducciones
const typeTranslations = {
    normal: "Normal",
    fire: "Fuego",
    water: "Agua",
    electric: "Eléctrico",
    grass: "Planta",
    ice: "Hielo",
    fighting: "Lucha",
    poison: "Veneno",
    ground: "Tierra",
    flying: "Volador",
    psychic: "Psíquico",
    bug: "Bicho",
    rock: "Roca",
    ghost: "Fantasma",
    dragon: "Dragón",
    dark: "Siniestro",
    steel: "Acero",
    fairy: "Hada"
};

// Configuración de colores por tipo
const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD"
};

// Función para crear una tarjeta de Pokémon
function createPokemonCard(pokemon, isVariant = false) {
    const card = document.createElement('div');
    const typeClasses = pokemon.types.map(type => `type-${type}`).join(' ');
    const specialClass = pokemon.special ? `sp-${pokemon.special}` : '';
    
    card.className = `card ${typeClasses} ${specialClass}`.trim();
    
    const typeText = pokemon.types.map(type => typeTranslations[type]).join('/');
    
    card.innerHTML = `
        <p class="number">${pokemon.number}</p>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.sprite}" alt="${pokemon.name}">
        <h2 class="name">${pokemon.name}</h2>
        <p>Tipo: ${typeText}</p>
    `;
    
    return card;
}

// Función para cargar todos los Pokémon
function loadPokemon() {
    const container = document.querySelector('.poke-cont');
    
    pokemonData.forEach(pokemon => {
        // Agregar el Pokémon base
        container.appendChild(createPokemonCard(pokemon));
        
        // Agregar variantes si existen
        if (pokemon.variants) {
            pokemon.variants.forEach(variant => {
                const variantData = {
                    ...variant,
                    number: pokemon.number
                };
                container.appendChild(createPokemonCard(variantData, true));
            });
        }
    });
}

// Inicialización cuando el documento está listo
$(document).ready(function(){
    // Cargar Pokémon
    loadPokemon();
    
    const $pokeCont = $(".poke-cont");
    let filters = [];

    // Inicializar Isotope después de cargar los Pokémon
    $pokeCont.isotope({
        itemSelector: '.card',
        layoutMode: 'fitRows',
        getSortData: {
            name: ".name",
            number: ".number parseInt"
        }
    });

    // Actualizar contador de Pokémon
    function updateCount() {
        const visibleCount = $pokeCont.data('isotope').filteredItems.length;
        $("#count").text(`Pokémon seleccionados: ${visibleCount}`);
    }

    // Gestionar filtros
    $(".pokemon-buttons .filter").on("click", function(){
        const filterVal = $(this).data("filter");

        if (filters.includes(filterVal)) {
            filters = filters.filter(f => f !== filterVal);
            $(this).removeClass("active");
        } else {
            filters.push(filterVal);
            $(this).addClass("active");
        }

        const filterString = filters.length ? filters.join("") : "*";
        $pokeCont.isotope({ filter: filterString });
        updateCount();
    });

    // Gestionar ordenamiento
    $(".pokemon-buttons .sort").on("click", function(){
        const sortVal = $(this).data("sort-by");
        $pokeCont.isotope({ sortBy: sortVal });
    });

    // Resetear filtros
    $(".pokemon-buttons .reset").on("click", function(){
        filters = [];
        $(".pokemon-buttons .filter").removeClass("active");
        $pokeCont.isotope({ filter: "*" });
        updateCount();
    });

    // Eventos de disposición
    $pokeCont.on('arrangeComplete', updateCount);
    updateCount();

    // Aplicar colores a los botones
    function applyButtonColors() {
        document.querySelectorAll(".pokemon-buttons button[data-filter^='.type-']").forEach(button => {
            const type = button.getAttribute("data-filter").replace('.type-', '');
            if (typeColors[type]) {
                button.style.backgroundColor = typeColors[type];
            }
        });
    }

    // Inicializar colores de botones
    applyButtonColors();
}); 