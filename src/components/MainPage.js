import React from 'react'

export default function MainPage({user, setUser, setPage, getRole, logout}) {
	const role = getRole(user)
	const name = user.username.charAt(0).toUpperCase() + user.username.slice(1)
	return(
		<div className="main-page">
			<i className="hello-message">Hello {name}</i>
			<span className="role">{role}</span>
			{ (user.roles.Admin === 2002 || user.roles.SuperAdmin === 2004) &&
				<button onClick={()=> setPage('manage-users-page')}>Manage Users</button>	
			}
			<button onClick={()=> setPage('manage-employees-page')}>Manage Employees</button>
			<div className="logout-back-container">
				<span	className="logout" onClick={logout}>logout</span>
			</div>
		</div>
	)
}