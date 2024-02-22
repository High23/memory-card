import { useState, useEffect } from 'react'
import pikachuGif from './assets/pikachu-running.gif'
import './App.css'

function App() {
  const [pokemonIds, setPokemonIds] = useState([])
  const [pokemonRefresh, setPokemonRefresh] = useState(0)
  const [gameState, setGameState] = useState('won')
  const [counter, setCounter] = useState(0)
  const [highScore, setHighScore] = useState(counter)
  const [amountOfPokemon, setAmountOfPokemon] = useState(0)
  
  
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

  useEffect(() => {
    if (counter > highScore) {
      setHighScore(counter)
    }
    if (counter >= 12) {
      setCounter(0)
      setGameState('won')
    }
  }, [counter, highScore])
  
  return (
    <>
      <header>
        <span>Memory Card Project </span> 
        <span>Score: {counter} </span>
        <span>High Score: {highScore}</span>
      </header>
      <main>
        {(gameState === 'lost' || gameState === 'won') && 
        <>
          <DisplayOutcome gameState={gameState} imageSrc={gameState === 'won' ? 
          'https://media1.tenor.com/m/nJclFuwdP5wAAAAC/squirtle-pikachu.gif' : 
          'https://media1.tenor.com/m/4uPJsA8k1KEAAAAC/pokemon-pikachu.gif'}>
          </DisplayOutcome>
        </>
        }
        {(pokemonIds.length > 0 && gameState === 'playing') && 
        <>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} pokemonIds={pokemonIds} setGameState={setGameState} counter={counter} setCounter={setCounter} setHighScore={setHighScore}></PokemonImages>
        </>
        }
      </main>
      <footer></footer>
    </>
  )
}

function PokemonImages({setPokemonRefresh, pokemonIds, setGameState, counter, setCounter, setHighScore}) {
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
    setRandomizedPokemonData([...randomizedIds])
    return () => {
      setRandomizedPokemonData([])
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
        <DisplayPokemon setPokemonIdRefresh={setPokemonIdRefresh} randomizedPokemonData={randomizedPokemonData} 
        pokemonIdRefresh={pokemonIdRefresh} setState={setState} state={state} setGameState={setGameState} 
        counter={counter} setCounter={setCounter} setHighScore={setHighScore}>
        </DisplayPokemon>
      }
    </>
  )
}


function DisplayPokemon({setPokemonIdRefresh, randomizedPokemonData, pokemonIdRefresh, setState, state, setGameState, counter, setCounter, setHighScore}) {
  const [pokemonClicked, setPokemonClicked] = useState(new Set())
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
            if (pokemonClicked.has(pokemon.id)) {
              setHighScore(counter)
              setCounter(0)
              setGameState('lost')
              return
            } else if (pokemonClicked.size > 0) {
              setPokemonClicked(new Set([...pokemonClicked, pokemon.id])); 
            }
            else {
              setPokemonClicked(new Set([pokemon.id]))
            }
            setCounter(counter + 1)
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
    const data = await response.json()
    dataArray.push(data)
  }
  return dataArray
}

function DisplayOutcome({gameState, imageSrc}) {
  console.log(imageSrc)
  return (
  <>
    <img src={imageSrc}></img>
    <div>You {gameState}!!!</div>
  </>
    
  )
}

export default App
