import { useState, useEffect } from 'react'
import pikachuGif from './assets/pikachu-running.gif'
import './App.css'

function App() {
  const [pokemonIds, setPokemonIds] = useState([])
  const [pokemonRefresh, setPokemonRefresh] = useState(0)
  
  
  useEffect(() => {
    let idSet = new Set([Math.floor(Math.random() * 150 + 1)])
    while (idSet.size < 12) {
      let randomNumber = Math.floor(Math.random() * 150 + 1)
      let bool = idSet.has(randomNumber)
      if (bool) {
        randomNumber = Math.floor(Math.random() * 150 + 1)
      } else {
        idSet = new Set([...idSet, randomNumber])
      }
    }
    setPokemonIds([...idSet])
    return () => {
      setPokemonIds([])
    }
  }, [pokemonRefresh])


  return (
    <>
      <header>Memory Card Project</header>
      <main>
        {pokemonIds.length > 0  && 
        <>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} pokemonIds={pokemonIds}></PokemonImages>
        </>
        }
      </main>
      <footer></footer>
    </>
  )
}

function PokemonImages({setPokemonRefresh, pokemonIds}) {
  const [pokemonData, setPokemonData] = useState([])
  const [randomizedPokemonData, setRandomizedPokemonData] = useState([])
  const [pokemonIdRefresh, setPokemonIdRefresh] = useState(false)
  const [state, setState] = useState('Loading')
 
  useEffect(() => {
    setState('Loading')
    fetchPokemonById(pokemonIds).then(data => {
      setPokemonData(data)
    }).catch(err => console.log(err))
    return () => {
      setPokemonData([])
    }
  }, [pokemonIds]) 

  useEffect(() => {
    let pokemonDataCopy = pokemonData
    let randomizedIds = []
    while (pokemonDataCopy.length > 0) {
      let randomNumber = Math.floor(Math.random() * Number(pokemonDataCopy.length))
      randomizedIds.length > 0 ? randomizedIds = [...randomizedIds, pokemonDataCopy[randomNumber]] : randomizedIds = [pokemonDataCopy[randomNumber]]
      pokemonDataCopy = pokemonDataCopy.filter((id) => id !== pokemonDataCopy[randomNumber])
    }
    console.log(randomizedIds)
    setRandomizedPokemonData([...randomizedIds])
    return () => {
      setRandomizedPokemonData()
    }
  }, [pokemonData, pokemonIdRefresh])

  
  
  return (
    <>
      {state === 'Loading' && 
      <div className='loading'> 
        <img src={pikachuGif} alt=""></img> 
        <div>Loading...</div>
      </div>}
      {(pokemonData.length > 0) &&
        <DisplayPokemon setPokemonIdRefresh={setPokemonIdRefresh} randomizedPokemonData={randomizedPokemonData} pokemonIdRefresh={pokemonIdRefresh} setState={setState} state={state}></DisplayPokemon>
      }
    </>
  )
}


function DisplayPokemon({setPokemonIdRefresh, randomizedPokemonData, pokemonIdRefresh, setState, state}) {
  useEffect(() => {
    const load = setInterval(() => {
      setState('Success')
    }, 2000); 
    return () => {
      clearInterval(load)
    }
  })

  return (
    <>
    {state === 'Success' && randomizedPokemonData.map((pokemon) => {
      return (
        <div key={pokemon.id}>
          <button type="button" onClick={() => {
            console.log(pokemonIdRefresh)
            pokemonIdRefresh ? setPokemonIdRefresh(false) : setPokemonIdRefresh(true)
            }}>
            <img src={pokemon.sprites.other.dream_world.front_default} alt=""></img>
            <div>{pokemon.forms[0].name.charAt(0).toUpperCase() + pokemon.forms[0].name.slice(1)}</div>
          </button>
        </div>
      )
    })}
    </>
  )
}

async function fetchPokemonById(id) {
  let dataArray = [];
  for (let i = 0; i < 12; i++){
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id[i]}`)
    console.log(response)
    const data = await response.json()
    dataArray.push(data)
  }
  return dataArray
}

export default App
