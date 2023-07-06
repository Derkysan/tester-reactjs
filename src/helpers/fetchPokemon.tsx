import { Pokemon, SmallPokemon } from "../interfaces/Pokemon";

export const fetchAllPokemon = async (): Promise<Pokemon[]> => {
  
  const resp = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
  const response = await resp.json();
  return transformToPokemon(response.results)

}

const transformToPokemon = (smallPokemonList: SmallPokemon[]) => {

  const pokemonArr = smallPokemonList.map( poke => {
    const id = poke.url.split('/')[6]
    
    return {
      id,
      name: poke.name,
      pic: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    }
  })

  return pokemonArr;

}