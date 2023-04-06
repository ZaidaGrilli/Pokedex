export async function getPokemonList(offset = 0, limit = 20) {
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}.`;
  
    const res = await fetch(url).then((res) => res.json());
    const listOfPokemon = res.results;
  
    const pokemonPromises = listOfPokemon.map((pokemon) =>
      fetch(pokemon.url).then((res) => res.json())
    );
    const data = await Promise.all(pokemonPromises);
  
    res.results = data;
    return res;
  }
  
  export async function getPokemon(name) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    const res = await fetch(url).then((res) => res.json());
    return res;
  }
  
  export async function fetchAllPokemonNames(limit = 1300) {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
    ).then((res) => res.json());
  
    return res.results.map((item) => item.name);
  }