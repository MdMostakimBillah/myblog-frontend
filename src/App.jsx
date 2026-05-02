import './App.css'
import Main from './component/Main'
import Menu from './component/Menu'
import AppProviders from './context/AppProviders'

function App() {

  return (
    <AppProviders>
      <div className='mainWraper'>
        <Menu />
        <Main />
      </div>
    </AppProviders>
  )
}

export default App;
