import "./styles.scss";
import Navigo from "navigo";
import { fetchAllPokemonNames, getPokemon, getPokemonList } from "./fetches";
import { clamp } from "./utils";

const router = new Navigo("/");

router.on("/", async function (match) {
  const page = document.getElementById("main-page");

  // get params from url:
  const offsetStr = match.params?.offset;
  const limitStr = match.params?.limit;

  // convert params to integer:
  let offset = 0;
  if (offsetStr) offset = parseInt(offsetStr);

  let limit = 21;
  if (limitStr) limit = parseInt(limitStr);

  // render loading skeleton:
  const loadingSkeleton = renderPokemonListLoadingSkeleton(limit);
  page.innerHTML = loadingSkeleton;

  // fetch pokemons
  const res = await getPokemonList(offset, limit);
  const pokeList = renderPokemonList(res.results);

  const nextOffset = clamp(offset + limit, 0, res.count);
  const prevOffset = clamp(offset - limit, 0, res.count);

  const nextPage = `/?offset=${nextOffset}&limit=${limit}`;
  const prevPage = `/?offset=${prevOffset}&limit=${limit}`;

  page.innerHTML = `
    <div class="home-page pack-content">
      <input id="poke-search" type="text"/>
      <div class="btn-container">
        <a href="${prevPage}" id="prev-page-link" class="page-btn">prev</a>
        <a href="${nextPage}" id="next-page-link" class="page-btn">next</a>
      </div>
      <ul class="poke-card-container">${pokeList}</ul>
    </div>
  `;

  document.getElementById("next-page-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    router.navigate(nextPage);
  });
  document.getElementById("prev-page-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    router.navigate(prevPage);
  });
});

router.on("/about", function (match) {
  const page = document.getElementById("main-page");
  page.innerHTML = `<pre>${JSON.stringify(match, null, 2)}</pre>`;
});

// EACH DYNAMIC INDIVIDUAL POKEMON GOES HERE:
router.on("/pokemon/:name", async function (match) {
  const page = document.getElementById("main-page");

  const data = await getPokemon(match.data.name);

  page.innerHTML = `<pre>${JSON.stringify(match, null, 2)}</pre>`;
});

router.navigate(window.location.pathname + window.location.search);

function renderPokemonCard({ name, types, imgSrc, bgImgSrc }) {
  const typesHtml = types.map((type) => renderTypeElement(type)).join("");
  return `
  <li class="poke-card">
    <a href=/pokemon/${name} data-navigo>
      <img class="bg-img" src="${bgImgSrc}" alt=""/>
      <div class="poke-card-header">
        <h2>${name}</h2>
        <div class="types-wrapper">${typesHtml}</div>
      </div>
      <img class="poke-img" src="${imgSrc}" alt="Picture of ${name}"/>
    </a>
  </li>
  `;
}

function renderPokemonList(pokemonList) {
  const html = pokemonList.map((pokemon) => {
    const imgSrc =
      pokemon.sprites.versions["generation-v"]["black-white"]["animated"]
        .front_default;
    const bgImgSrc = pokemon.sprites.front_default;

    return renderPokemonCard({
      name: pokemon.name,
      types: pokemon.types.map((item) => item.type.name),
      abilities: pokemon.abilities.map((item) => item.ability.name),
      imgSrc,
      bgImgSrc,
    });
  });

  return html.join("");
}

function renderTypeElement(type) {
  if (!type) return "";
  return `<span class="type-element-label type-${type}">${type}</span>`;
}

function renderPokemonListLoadingSkeleton(numOfItems) {
  let pokeList = [];
  for (let i = 0; i < numOfItems; i++) {
    pokeList.push("<li class='poke-card-loading'></li>");
  }
  pokeList.join("");

  return `
    <div class="home-page pack-content">
      <input id="poke-search" type="text"/>
      <div class="btn-container">
        <a href="" id="prev-page-link" class="page-btn">prev</a>
        <a href="" id="next-page-link" class="page-btn">next</a>
      </div>
      <ul class="poke-card-container">${pokeList}</ul>
    </div>
  `;
}
