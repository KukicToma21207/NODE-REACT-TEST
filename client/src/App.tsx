import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Content from "./components/content/Content";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import ContentLogin from "./components/content_login/ContentLogin";
import ContentRegister from "./components/content_register/ContentRegister";
import { useEffect, useState } from "react";
import ContentLogout from "./components/content_logout/ContentLogout"

function App() {
    const [user, setUser] = useState()

    useEffect(() => {
        fetch('http://localhost:5000', {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.status == 'SUCCESS' && data.user) {
                setUser(data.user);
            }
        })
    }, [])

	return (
		<>
			<Header></Header>

			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Content user={user}></Content>} />
                    <Route path='/login' element={<ContentLogin user={user}></ContentLogin>} />
                    <Route path='/register' element={<ContentRegister user={user}></ContentRegister>} />
                    <Route path='/logout' element={<ContentLogout></ContentLogout>}/>
				</Routes>
			</BrowserRouter>

			<Footer></Footer>
		</>
	);
}

export default App;
