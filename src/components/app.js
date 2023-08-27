import React, { useState, useEffect } from 'react'
import LoadingPage from './LoadingPage.js'
import LoginPage from './LoginPage.js'
import MainPage from './MainPage.js'
import ManageUsersPage from './ManageUsersPage.js'
import ManageEmployeesPage from './ManageEmployeesPage.js'

export default function App() {
	const [page, setPage] = useState('loading-page')
	const [user, setUser] = useState({})
	const [errorMessage, setErrorMessage] = useState('')
	useEffect(() => {
		refreshAccessToken('login')
	}, [])	

	async function refreshAccessToken(origin) {
		try {
			const response = await fetch('https://company-managing-api.onrender.com/users/refresh', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			})
			if (response.status === 200) {
				const data = await response.json()
				setUser(user => ({...data.user, accessToken: data.accessToken}))
				console.log(`new AccessToken \n ${data.accessToken}`)
				if (origin === 'login') setPage('main-page')
			} else {
				setPage('login-page')
			}
		} catch(err) {
			console.error(err.message)
			if (err.message.includes('Failed')) {
				setErrorMessage('Something got wrong. Check your entenet connection and try again later.')
			}
		}
	}
	async function logout() {
		try {
			const body = JSON.stringify({ username: user.username })
			const response = await fetch('https://company-managing-api.onrender.com/users/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					authorization: user.accessToken
				},
				credentials: 'include',
				body
			})
			if (response.status === 200) {
				console.log(response)
				console.log(await response.json())
				setUser(user => ({ ...user, accessToken: '' }))
				setPage('login-page')
			}
		} catch (err) {
			console.log(err)
			if (err.message.includes('fetch')) {
				alert('Logout failed, Check your internet connection and try again.')
			}
		}
	}
	function getRole(user) {
		const role = user.roles.SuperAdmin === 2004 ? 'Super Admin' :
			user.roles.Admin === 2002 ? 'Admin' :
			user.roles.Editor === 2000 ? 'Editor' :
			'User'
		return role
	}
	function getRoles(role) {
		const roles = {User: 1998}
		console.log(role)
		role === 'Super Admin'? roles.SuperAdmin = 2004
		: role === 'Admin'? roles.Admin = 2002
		: role === 'Editor'? roles.Editor = 2000
		: roles.User = 1998
		console.log(roles)
		return roles
	}
	function getLastActivity(date) {
		const timeNow = new Date()
		const diff = timeNow - date
		const
			sec = 1000,
			min = sec * 60,
			h = min * 60,
			d = h * 24,
			w = d * 7,
			m = d * 7,
			y = m * 12;
		const lastActiveTime =
			Math.floor(diff / y) > 1 ? `Active ${Math.floor(diff / y)} years ago.` :
			Math.floor(diff / y) === 1 ? `Active one year ago.` :
			Math.floor(diff / m) > 1 ? `Active ${Math.floor(diff / m)} months ago.` :
			Math.floor(diff / m) === 1 ? `Active one month ago.` :
			Math.floor(diff / w) > 1 ? `Active ${Math.floor(diff / w)} weeks ago.` :
			Math.floor(diff / w) === 1 ? `Active one week ago.` :
			Math.floor(diff / d) > 1 ? `Active ${Math.floor(diff / d)} days ago.` :
			Math.floor(diff / d) === 1 ? `Active yesterday.` :
			Math.floor(diff / h) > 1 ? `Active ${Math.floor(diff / h)} hours ago.` :
			Math.floor(diff / h) === 1 ? `Active one hour ago.` :
			Math.floor(diff / min) > 1 ? `Active ${Math.floor(diff / min)} miuntes ago.` :
			Math.floor(diff / min) === 1 ? `Active one minute ago.` :
			'Active just now.'
		return lastActiveTime
	}
	if (errorMessage) {
		return <h3>{errorMessage}</h3>
	}
	if (page === 'loading-page') {
		return <LoadingPage />
	}
	if(page === 'login-page') {
		return (
			<LoginPage setPage={setPage} setUser = {setUser} refreshAccessToken={refreshAccessToken}/>
		)
	} else if(page === 'main-page') {
		return(
			<MainPage user={user} setUser={setUser}
			setPage={setPage} getRole={getRole} logout={logout}/>	
		)
	} else if(page === 'manage-users-page') {
		return(
			<ManageUsersPage setPage={setPage} user={user} setUser={setUser}
			getRole={getRole} getLastActivity={getLastActivity} getRoles={getRoles}
			refreshAccessToken={refreshAccessToken} logout={logout}/>	
		)
	} else if (page === 'manage-employees-page') {
		return (
			<ManageEmployeesPage setPage={setPage} user={user}
				getRole={getRole} getLastActivity={getLastActivity} getRoles={getRoles}
				refreshAccessToken={refreshAccessToken} logout={logout}/>
		)
	}
}