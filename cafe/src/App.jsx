import Home from "./components/Home"
import About from "./components/About"
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Signup from "./components/Signup";
import Login from "./components/Login";
import Menu from "./components/Menu";
import Cart from './components/Cart';
import { CartProvider } from "./context/CartContext";
import { MenuProvider } from "./context/MenuContext";
import { OrdersProvider } from "./context/OrdersContext";
import AddMenu from "./components/AddMenu";
import OrdersPage from "./components/Order";
function App() {

  return (
    <>
      <BrowserRouter>
       <OrdersProvider>
        <MenuProvider>
        <CartProvider>
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/menu" element={<Menu/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/add" element={<AddMenu/>}/>
        <Route path="/orders" element={<OrdersPage/>}/>
        </Routes>
        </CartProvider>
        </MenuProvider>
        </OrdersProvider>
      </BrowserRouter>
    </>
  )
}

export default App
