import { useState, useEffect } from 'react'
import pikachuGif from './assets/pikachu-running.gif'
import './App.css'

function App() {
  const [pokemonIds, setPokemonIds] = useState([])
  const [pokemonRefresh, setPokemonRefresh] = useState(0)
  const [gameState, setGameState] = useState('menu')
  const [gameMode, setGameMode] = useState('classic')
  const [pokemonGen, setPokemonGen] = useState('1')
  const [counter, setCounter] = useState(0)
  const [highScore, setHighScore] = useState(counter)
  const [amountOfPokemon, setAmountOfPokemon] = useState(0)
  
  
  useEffect(() => {
    let idSet = new Set([Math.floor(Math.random() * 150 + 1)])
    while (idSet.size < amountOfPokemon) {
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
  }, [amountOfPokemon, pokemonRefresh])

  useEffect(() => {
    if (counter > highScore) {
      setHighScore(counter)
    }
    if (counter >= amountOfPokemon && amountOfPokemon > 1 && gameMode !== 'endless') {
      let scores = JSON.parse(localStorage.getItem('scores'))
      if (scores[[amountOfPokemon]] < counter) {
        scores[[amountOfPokemon]] = counter
        localStorage.setItem('scores', JSON.stringify(scores))
      }
      setCounter(0)
      setGameState('won')
    }
  }, [counter, highScore, amountOfPokemon, gameMode])


  return (
    <>
      <header>
        <span>Memory Card Project </span> 
        { gameState === 'playing' &&
          <>
            <span>Score: {counter} </span>
            <span>High Score: {highScore}</span>
            <button type="button" onClick={() => {
                setGameState('menu')
                setPokemonIds([])
                setPokemonRefresh(0)
                setCounter(0)
                setAmountOfPokemon(0)
              }
            }>Menu</button>
          </>
        }
      </header>
      <main>
        {gameState === 'menu' &&
        <section className={gameState}>
          <MainMenu setAmountOfPokemon={setAmountOfPokemon} setGameState={setGameState} setHighScore={setHighScore} setGameMode={setGameMode}></MainMenu>
        </section>
        }

        {(gameState === 'lost' || gameState === 'won') && 
        <section className='outcome'>
          <DisplayOutcome gameState={gameState}  imageSrc={gameState === 'won' ? 
          'https://media1.tenor.com/m/nJclFuwdP5wAAAAC/squirtle-pikachu.gif' : 
          'https://media1.tenor.com/m/4uPJsA8k1KEAAAAC/pokemon-pikachu.gif'}>
          </DisplayOutcome>
          <button type="button" onClick={() => {
                setGameState('menu')
                setPokemonIds([])
                setPokemonRefresh(0)
                setCounter(0)
                setAmountOfPokemon(0)
              }
            }>Menu</button>
        </section>
        }
        {(pokemonIds.length > 1 && gameState === 'playing') && 
        <section className={gameMode === 'endless' ? gameMode : gameMode}>
          <PokemonImages setPokemonRefresh={setPokemonRefresh} pokemonIds={pokemonIds} 
          setGameState={setGameState} counter={counter} setCounter={setCounter} 
          gameMode={gameMode} amountOfPokemon={amountOfPokemon}></PokemonImages>
        </section>
        }
      </main>
      <footer></footer>
    </>
  )
}

function PokemonImages({setPokemonRefresh, pokemonIds, setGameState, counter, setCounter, gameMode}) {
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
        counter={counter} setCounter={setCounter} gameMode={gameMode} setPokemonRefresh={setPokemonRefresh}>
        </DisplayPokemon>
      }
    </>
  )
}


function DisplayPokemon({setPokemonIdRefresh, randomizedPokemonData, pokemonIdRefresh, setState, state, setGameState, counter, setCounter, gameMode, setPokemonRefresh}) {
  const [pokemonClicked, setPokemonClicked] = useState(new Set())
  useEffect(() => {
    let timer = 1000
    if (gameMode === 'endless') {
      timer = 600
    }
    const load = setInterval(() => {
      setState('Success')
    }, timer); 
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
            let amountOfPokemon = randomizedPokemonData.length
            if (pokemonClicked.size === amountOfPokemon - 1 && gameMode === 'endless') {
              setPokemonClicked(new Set())
              setPokemonRefresh(num => num + 1)
            }
            if (pokemonClicked.has(pokemon.id)) {
              let scores = JSON.parse(localStorage.getItem('scores'))
              gameMode === 'endless' ? amountOfPokemon = 'endless' : null
              if (scores[[amountOfPokemon]] < counter) {
                scores[[amountOfPokemon]] = counter
                localStorage.setItem('scores', JSON.stringify(scores))
              }
              setPokemonRefresh(0)
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
  for (let i = 0; i < id.length; i++) {
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

function MainMenu({setAmountOfPokemon, setGameState, setHighScore, setGameMode}) {
  let scores = JSON.parse(localStorage.getItem('scores'))

  return (
    <>
      <button type="button" onClick={() => {
        setAmountOfPokemon(6)
        setGameState('playing')
        setGameMode('classic')
        scores !== null ? setHighScore(scores[[6]]) : localStorage.setItem('scores', JSON.stringify({6: 0, 12: 0, 18: 0, 'endless': 0}))
      }}>Easy</button>
      <button type="button" onClick={() => {
        setAmountOfPokemon(12)
        setGameState('playing')
        setGameMode('classic')
        scores !== null ? setHighScore(scores[[12]]) : localStorage.setItem('scores', JSON.stringify({6: 0, 12: 0, 18: 0, 'endless': 0}))
      }}>Medium</button>
      <button type="button" onClick={() => {
        setAmountOfPokemon(18)
        setGameState('playing')
        setGameMode('classic')
        scores !== null ? setHighScore(scores[[18]]) : localStorage.setItem('scores', JSON.stringify({6: 0, 12: 0, 18: 0, 'endless': 0}))
      }}>Hard</button>
      <button type="button" onClick={() => {
        setAmountOfPokemon(15)
        setGameState('playing')
        setGameMode('endless')
        scores !== null ? setHighScore(scores.endless) : localStorage.setItem('scores', JSON.stringify({6: 0, 12: 0, 18: 0, 'endless': 0}))
      }}>Endless</button>
    </>
  )
}

export default App
