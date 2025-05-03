import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import {useAuthContext} from "./context/useAuthContext";
import Dashboard from "./pages/Dashboard";
import Balance from "./pages/Balance";
import Transactions from "./pages/Transactions";
import MyCards from "./pages/MyCards";
import MyLoans from "./pages/MyLoans";
import Cards from "./pages/Cards";
import Loans from "./pages/Loans";


function App() {
    const {authUser} = useAuthContext()
  return (
        <BrowserRouter>
          <Routes>
              <Route path={'/login'} element={!authUser?<Login />:<Navigate to={'/'}/>} />
              <Route path={'/register'} element={!authUser?<Register />:<Navigate to={'/'}/>} />
              <Route path={'/'} element={<Home/>}/>
              <Route path={'/cards'} element={<Cards/>}/>
              <Route path={'/loans'} element={<Loans/>}/>
              <Route path={'/dashboard'} element={authUser?<Dashboard/>:<Navigate to={'/'}/> }/>
              <Route path={'/balance'} element={authUser?<Balance/>:<Navigate to={'/'}/> }/>
              <Route path={'/transactions'} element={authUser?<Transactions/>:<Navigate to={'/'}/> }/>
              <Route path={'/myCards'} element={authUser?<MyCards />:<Navigate to={'/'}/> }/>
              <Route path={'/myLoans'} element={authUser?<MyLoans/>:<Navigate to={'/'}/> }/>
          </Routes>
        </BrowserRouter>
  );
}

export default App;
