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
      </main>
      <footer></footer>
    </>
  )
}

export default App
