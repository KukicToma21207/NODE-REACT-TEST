import { FormEvent, useState } from "react";
import { Link, redirect } from "react-router-dom";
import {ContentProps} from "../content/Content"
import ContentActions from "../content_actions/ContentActions"
import "./content-register.css";


interface FormProps {
    first_name: string
    last_name: string
    email: string
    password: string
    confirm_password: string
}

// Main register component
const ContentRegister = ({user}: ContentProps) => {
	const [
		registerForm,
		setValue,
	] = useState<FormProps>({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: ''
    })

    const [errorMessages, setErrorMessages] = useState<[]>([])

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();

        fetch('http://localhost:5000/register', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                first_name: registerForm.first_name,
                last_name: registerForm.last_name,
                email: registerForm.email,
                password: registerForm.password,
                confirm_password: registerForm.confirm_password
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
		<div className='content-register-container'>
			<h2>Register</h2>

            <div className="error-messages">
                {errorMessages.map((message: {msg: string}, index) => 
                    <p className="error" key={index}>{message.msg}</p>
                )}
            </div>

            {(!user || (user && !user.first_name) || (user && user.first_name === '')) &&
            <>
			<form onSubmit={onSubmit} noValidate>
				<div className='form-field'>
					<label htmlFor='first_name'>First Name *</label>
					<input
						type='text'
						id='first_name'
						name='first_name'
						placeholder='First Name *'
                        onChange={(e) => {setValue({...registerForm, first_name: e.target.value})}}
					/>
				</div>

				<div className='form-field'>
					<label htmlFor='last_name'>Last Name *</label>
					<input
						type='text'
						id='last_name'
						name='last_name'
						placeholder='Last Name *'
                        onChange={(e) => {setValue({...registerForm, last_name: e.target.value})}}
					/>
				</div>

				<div className='form-field'>
					<label htmlFor='email'>Email *</label>
					<input
						type='email'
						id='email'
						name='email'
						placeholder='Email *'
                        onChange={(e) => {setValue({...registerForm, email: e.target.value})}}
					/>
				</div>

				<div className='form-field'>
					<label htmlFor='password'>Password *</label>
					<input
						type='password'
						id='password'
						name='password'
						placeholder='Password *'
                        onChange={(e) => {setValue({...registerForm, password: e.target.value})}}
					/>
				</div>

				<div className='form-field'>
					<label htmlFor='confirm_password'>Confirm Password *</label>
					<input
						type='password'
						id='confirm_password'
						name='confirm_password'
						placeholder='Confirm Password *'
                        onChange={(e) => {setValue({...registerForm, confirm_password: e.target.value})}}
					/>
				</div>

				<button className='button' type='submit'>
					Register
				</button>
			</form>

			<p>
				Already registered? Login <Link to={"/login"}>here</Link>.
			</p>
            </>
            }

            {(user && user.first_name) && 
                <>
                <h3>You are already logged in as {user.first_name} {user.last_name}</h3>
                <ContentActions user={user}>
                    <Link className='button' to={'/'}>Home</Link>
                </ContentActions>
                </>
            }
            
		</div>
	);
};

export default ContentRegister;
