import React, { useState } from 'react'

export default function LoginPage({setPage, setUser, refreshAccessToken}) {
	const [data, setData] = useState({})
	const [errorMessage, setErrorMessage] = useState({})
	
	function updateForm(event) {
		let { name, value } = event.target
		setData(prevData => ({...prevData, [name]: value}))
	}
	async function login(event) {
		event.preventDefault()
		const body = JSON.stringify(data)
		try {
			const response = await fetch('https://company-managing-api.onrender.com/users/login', {
				method: 'POST',
				headers: {
					"Content-Type": "Application/json"
				},
				body,
				credentials: 'include'
			})
			if (response.status === 200) {
				const data = await response.json()
				data.user.accessToken = data.accessToken
				setUser(data.user)
				setPage('main-page')
				setInterval(refreshAccessToken, 600000)
			} else {
				const error = await response.json()
				if (error.message.includes('username')) {
					setErrorMessage({username: error.message})
				} else if (error.message.includes('password')) {
					setErrorMessage({password: error.message})
				}
			}
		} catch(err) {
			console.error(err)
			if (err.message.includes('Failed to fetch')) {
				setErrorMessage({network: 'Network issues. Try again'})
			}
		}
	}
	return (
		<div className="login-page">
			<form className="login-form" onSubmit={login}>
				<span>Log in</span>
				<div>
					<input type="name" placeholder="Username" name="username"
						value={data.username || ''} onChange={updateForm}/>
						{errorMessage.username && <span className="error-message">{errorMessage.username}</span>}
				</div>	
				<div>
					<input type="password" placeholder="Password" name="password"
					value={data.password || ''} onChange={updateForm}/>
					{errorMessage.password && <span className="error-message">{errorMessage.password}</span>}
				</div>
				<div>
					{errorMessage.network && <span className="network-error">{errorMessage.network}</span>}
					<button>Log in</button>
				</div>
			</form>
		</div>
	)
}