
import './App.css'
import Homepage from './components/Homepage'
import {GeneralProvider} from './components/Provider'

function App() {

  return (
    <>
    <GeneralProvider>
      <Homepage />
    </GeneralProvider>
    </>
  )
}

export default App
