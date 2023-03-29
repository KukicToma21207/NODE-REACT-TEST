import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import "./content-login.css";

interface FormProps {
    email: string
    password: string
}

const ContentLogin = () => {
    const [
		loginForm,
		setValue,
	] = useState<FormProps>({
        email: '',
        password: '',
    })

    const [errorMessages, setErrorMessages] = useState<[]>([])

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();

        fetch('http://localhost:5000/login', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                email: loginForm.email,
                password: loginForm.password,
            }),
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
    

	return (
		<div className='content-login-container'>
			<h2>Log in to the system</h2>

            <div className="error-messages">
                {errorMessages.map((message: {msg: string}, index) => 
                    <p className="error" key={index}>{message.msg}</p>
                )}
            </div>

			<form onSubmit={onSubmit}>
				<div className='form-field'>
					<label htmlFor='email'>Email *</label>
					<input
						type='email'
						id='email'
						name='email'
						placeholder='Email *'
                        onChange={(e) => {setValue({...loginForm, email: e.target.value})}}
					/>
				</div>

				<div className='form-field'>
					<label htmlFor='password'>Password *</label>
					<input
						type='password'
						id='password'
						name='password'
						placeholder='Password *'
                        onChange={(e) => {setValue({...loginForm, password: e.target.value})}}
					/>
				</div>

				<button className='button' type='submit'>
					Log in
				</button>
			</form>
			<p>
				Not registered? Register <Link to={"/register"}>here</Link>.
			</p>
		</div>
	);
};

export default ContentLogin;
