import { useEffect, useState } from "react"
import { fetchAllPokemon } from "../helpers/fetchPokemon"
import { Pokemon } from "../interfaces/Pokemon"

export const Homepage = () => {

  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    fetchAllPokemon()
      .then( pokemons => {
        setTimeout(() => {
          setIsLoading(false);
          setPokemons(pokemons);
        }, 500);
      })
  }, [])

  const firteredPokemons = () => {
    
    if (search.length === 0) 
      return pokemons.slice(currentPage, currentPage + 5)

    const filtered = pokemons.filter( poke => poke.name.includes(search) );
    
    return filtered.slice(currentPage, currentPage + 5)

  }

  const nextPage = () => {
    if ( pokemons.filter( poke => poke.name.includes(search) ).length > currentPage + 5 )
      setCurrentPage(currentPage + 5)
      setPage(page + 1)
  }
  const previousPage = () => {
    if( currentPage === 0 ) return
    setCurrentPage(currentPage - 5)
    setPage(page - 1)
  }

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setCurrentPage(0);
    setSearch(e.target.value);
  }

  return (
    <div className="py-5">
      <div className="container">
        <div className="row">
          <div className="col">

            <h3>Listado pokemons</h3>
            <hr />

          </div>
        </div>

        <div className="row g-2 mb-3 align-items-center">
          <div className="col-2">
            <button 
              className={`w-100 btn btn-primary ${ currentPage === 0 && 'btn-outline-primary disabled' }`}
              onClick={ previousPage }
              disabled={ currentPage === 0 || isLoading }
              >Previous</button>
          </div>
          <div className="col-2">
            <button 
              className={`w-100 btn btn-primary ${ !( pokemons.filter( poke => poke.name.includes(search) ).length > currentPage + 5 ) && 'btn-outline-primary disabled'  }`}
              onClick={ nextPage }
              disabled={ isLoading || !( pokemons.filter( poke => poke.name.includes(search) ).length > currentPage + 5 ) }
              >Next</button>
          </div>
          {
            page > 1
              ? (
                <div className="col-1">
                  <button 
                    className="w-100 btn btn-outline-danger"
                    onClick={ () => {
                      setCurrentPage(0);
                      setPage(1);
                      setSearch('');
                    }}
                    disabled={ isLoading || !( pokemons.filter( poke => poke.name.includes(search) ).length >= currentPage ) }
                    ><i className="bi bi-x-lg"></i></button>
                </div>
              ) : null
          }
          <div className="col">
            Página { page } de {'\n'}
            {
              search.length === 0
                ? Math.ceil(pokemons.length / 5)
                : Math.ceil(pokemons.filter( poke => poke.name.includes(search) ).length / 5)
            }
          </div>

          <div className="col-4 ms-auto">
            <div className="input-group">
              <input 
                type="text" 
                value={search}
                onChange={ onSearch }
                disabled={isLoading}
                className="form-control border-end-0" 
                placeholder="Buscar pokemon"
                />
              {
                search.length > 0
                  ? (
                      <span 
                        className="input-group-text bg-white border-0 fs-6 btn btn-link"
                        onClick={ () => setSearch('') }>
                          <i className="bi bi-eraser"></i>
                      </span>
                    )
                  : null
              }
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">

            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th style={{ width: '200px' }}>ID</th>
                  <th style={{ width: '200px' }}>Name</th>
                  <th style={{ textAlign: 'center' }}>Image</th>
                </tr>
              </thead>

              <tbody>
                {
                  firteredPokemons().map( ({ id, name, pic }) => (
                    <tr key={id} >
                      <td style={{ width: '200px' }}>{ id }</td>
                      <td style={{ width: '200px' }}>{ `${name[0].toLocaleUpperCase()}${name.slice(1)}` }</td>
                      <td style={{ textAlign: 'center' }}>
                        {
                          pic ? <img src={pic} alt={name} /> : null
                        }
                      </td>
                    </tr>
                  ))
                }

              </tbody>
            </table>
                {
                  isLoading && <div className="w-100 alert alert-warning">Cargando...</div>
                }

          </div>
        </div>
      </div>
    </div>
  )
}
