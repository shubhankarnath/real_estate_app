import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import Signin from "./pages/Signin"
import SignUp from "./pages/SignUp"
import Profile from "./pages/Profile"
import About from "./pages/About"
import Header from "./component/Header"
import PrivateRoute from "./component/PrivateRoute"
import CreateListing from "./pages/CreateListing"
import UpdateListing from "./pages/UpdateListing"
import Listing from "./pages/Listing"
import Search from "./pages/Search"
import ComponentTest from "./component/ComponentTest"
import GMP2 from "./component/GoogleMap2"

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
      <Route path="/" element = {<Home/>}/>
      <Route path="/sign-in" element = {<Signin/>}/>
      <Route path="/sign-up" element = {<SignUp/>}/>
      <Route path="/about" element = {<About/>}/>

      <Route element = {<PrivateRoute/>}>
          <Route path="/profile" element = {<Profile/>}/>
          <Route path = "/create-listing" element = {<CreateListing/>}/>  
          <Route path="/update-listing/:listingId" element = {<UpdateListing/>}></Route>
      </Route>

      <Route path="/listing/:listingId" element = {<Listing></Listing>}></Route>
      <Route path="/search" element = {<Search></Search>}></Route>
      <Route path="/map" element = {<Map></Map>}></Route>
      <Route path="/componentTest" element = {<ComponentTest></ComponentTest>}></Route>
      <Route path="/GMP2" element = {<GMP2></GMP2>}></Route>



      </Routes>
    </BrowserRouter>
  )
}