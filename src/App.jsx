import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
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
    console.log(idSet)
    return () => {
      setPokemonIds([])
    }
  }, [pokemonRefresh])

  const [randomizedPokemonIds, setRandomizedPokemonIds] = useState([])
  const [pokemonIdRefresh, setPokemonIdRefresh] = useState(false)
  useEffect(() => {
    let pokemonIdsCopy = pokemonIds
    let randomizedIds = []
    while (pokemonIdsCopy.length > 0) {
      let randomNumber = Math.floor(Math.random() * Number(pokemonIdsCopy.length))
      randomizedIds.length > 0 ? randomizedIds = [...randomizedIds, pokemonIdsCopy[randomNumber]] : randomizedIds = [pokemonIdsCopy[randomNumber]]
      pokemonIdsCopy = pokemonIdsCopy.filter((id) => id !== pokemonIdsCopy[randomNumber])
    }
    console.log(randomizedIds)
    setRandomizedPokemonIds([...randomizedIds])
    return () => {
      setRandomizedPokemonIds([])
    }
  }, [pokemonIds, pokemonIdRefresh])


  return (
    <>
      <header>Memory Card Project</header>
      <main>
        {(randomizedPokemonIds.length > 0 && pokemonIds.length > 0) && 
        <>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} randomPokemonId={randomizedPokemonIds[0]}></PokemonImages>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} randomPokemonId={randomizedPokemonIds[1]}></PokemonImages>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} randomPokemonId={randomizedPokemonIds[2]}></PokemonImages>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} randomPokemonId={randomizedPokemonIds[3]}></PokemonImages>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} randomPokemonId={randomizedPokemonIds[4]}></PokemonImages>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} randomPokemonId={randomizedPokemonIds[5]}></PokemonImages>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} randomPokemonId={randomizedPokemonIds[6]}></PokemonImages>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} randomPokemonId={randomizedPokemonIds[7]}></PokemonImages>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} randomPokemonId={randomizedPokemonIds[8]}></PokemonImages>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} randomPokemonId={randomizedPokemonIds[9]}></PokemonImages>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} randomPokemonId={randomizedPokemonIds[10]}></PokemonImages>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} randomPokemonId={randomizedPokemonIds[11]}></PokemonImages>
          </>
        }
      </main>
      <footer></footer>
    </>
  )
}

function PokemonImages(props) {
  const [imageUrls, setImageUrls] = useState()
  const [pokemonName, setPokemonName] = useState()
  const imageOne = fetchPokemonById(props.randomPokemonId)
  useEffect(() => {
    imageOne.then(result => {
      console.log(result.sprites.front_default)
      setImageUrls(result.sprites.other.dream_world.front_default)
      setPokemonName(result.forms[0].name)
    }).catch(err => {
      console.log(`here's the error: ${err}`)
    })
  }, [])
  
  return (
    <>
      <div>
        <button type="button" >
          <img src={imageUrls} alt=""></img>
          <div>{pokemonName}</div>
          </button>
      </div>
    </>
  )
}

async function fetchPokemonById(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const data = await response.json()
    return data
}

export default App
