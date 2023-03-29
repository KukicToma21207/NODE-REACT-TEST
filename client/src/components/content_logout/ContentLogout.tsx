import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import "./content-logout.css";


const ContentLogin = () => {

    const [errorMessages, setErrorMessages] = useState<[]>([])

	const doLogout = () => {
        fetch('http://localhost:5000/logout', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.status == 'SUCCESS') {
                window.location.href = '/'
            }else{
                if(data.messages)
                    setErrorMessages(data.messages)
                else
                    console.error(data);
            }
        })
	};
    doLogout()
    

	return (
		<div className='content-logout-container'>
			<h2>Log out from the system</h2>

            <div className="error-messages">
                {errorMessages.map((message: {msg: string}, index) => 
                    <p className="error" key={index}>{message.msg}</p>
                )}
            </div>

			<h3>Loading...</h3>

            <Link to={'/'}>Click to return home</Link>
		</div>
	);
};

export default ContentLogin;
