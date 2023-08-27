import React, { useState, useEffect } from 'react'
import DeletePopup from './DeletePopup.js'
import AddAndUpdateUserPopup from './AddAndUpdateUserPopup.js'

export default function ManageUsersPage(props) {
	const {user: currentUser, setUser, setPage, getRole, getLastActivity, getRoles, refreshAccessToken, logout} = props
	const [refresh, setRefresh] = useState(0)
	const [isUpdatingUser, setIsUpdatingUser] = useState(false)
	const [isDeletingUser, setIsDeletingUser] = useState(false)
	const [isAddingUser, setIsAddingUser] = useState(false)
	const [users, setUsers] = useState([])
	const role = getRole(currentUser)
	if (role !== 'Super Admin' && role !== 'Admin') setPage('main-page')
	useEffect(() => {
		const getUsers = async () => {
			try {
				const response = await fetch('https://company-managing-api.onrender.com/users/', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						authorization: currentUser.accessToken
					},
						credentials: 'include'
				})
				const data = await response.json()
				data.forEach(aUser => aUser.isSelected = false)
				setUsers(data.sort((a, b) => a.lastActiveTime === 'now' ? -1 : b.lastActiveTime === 'now' ? 1 : new Date(b.lastActiveTime) - new Date(a.lastActiveTime
				)))
			} catch(err) {
				console.error(err)
			}
		}
		getUsers()
	}, [refresh])
	function toggleIsSelected(event, id) {
		 console.log(event.type)
		setTimeout(() => {
			if (event.target.name !== 'edit' && event.target.name !== 'delete' &&
			!(isDeletingUser || isUpdatingUser || isAddingUser)) {
				if (event.type === 'mouseleave') {
						setUsers(prevUsers => prevUsers.map(user => ({ ...user, isSelected: false })))
				} else {
						setUsers(prevUsers => prevUsers.map(user => (
							user._id !== id ? {...user, isSelected: false}: {...user, isSelected: !user.isSelected}
						)))
				}
			}
	}, 20)
	}
	function start(action) {
		if (!(isDeletingUser || isUpdatingUser || isAddingUser)) {
			action === 'updating' ? setIsUpdatingUser(true)
			: action === 'deleting' ? setIsDeletingUser(true)
			: setIsAddingUser(true)
		}
	}
	const usersList = users.map((user, index) => {
		let lastActiveTime
		if (user.lastActiveTime === 'now') lastActiveTime = 'Active now'
		else {
			const lastActiveDate = new Date(user.lastActiveTime)
			lastActiveTime = getLastActivity(lastActiveDate)
		}
		const userRole = getRole(user)
		return(
			<div key={user._id} className="user" 
			onMouseOver = {(event) => toggleIsSelected(event, user._id)}
			onMouseLeave = {(event) => toggleIsSelected(event, user._id)} >
				<div className="number">{index + 1}.</div>
				<div className="name">
					{user.username}
				</div>
				<div className="user-role">{userRole}</div>
				<div className="email">{user.email}</div>
				<div className="phone">{user.phoneNumber}</div>
				<div className="user-last-active-time">{lastActiveTime}</div>
				{ user.isSelected && 
					<div id="edit-delete-buttons">
						{
							(!((user.roles.SuperAdmin === 2004 || user.roles.Admin === 2002) 
							&& role !== 'Super Admin') || user.username === currentUser.username) &&
							<button className="edit" name="edit">
								<img src="./icons/edit-icon.png" name="edit" onClick={() => start('updating')}/>
							</button>
						}
						{ !(user.roles.SuperAdmin === 2004 ||
						(user.roles.Admin === 2002 && role !== 'Super Admin' && user.username !== currentUser.username)) &&
							<button className="delete" name="delete" >
								<img src="./icons/delete-icon.png" name="delete" onClick={() => start('deleting')}/>
							</button>
						}
				</div>
				}
			</div>
		)
	})
	const name = currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1)
	return (
		<div>
		<i className="hello-message">Hello {name}</i><br/>
		<span className="role">{role}</span>
		<div className="users">
			<div className="user categs">
				<div>NO</div>
				<div>Name</div>
				<div>Role</div>
				<div>Email</div>
				<div>Phone number</div>
				<div>Last active date</div>
				<div>options</div>
			</div>
			{usersList}
			<div className="add-user-button" onClick={() => start('adding')}>
				<img src="./icons/add-user-icon.png"/>
			</div>
		</div>
		<div className="logout-back-container">
			<span className="logout" onClick={logout}>logout</span>
			<span className="back" onClick={() => setPage('main-page')}>Back</span>
		</div>
		{isDeletingUser  && 
			<DeletePopup currentUser={currentUser} setIsDeleting={setIsDeletingUser}
			person = {users.find(user => user.isSelected)} 
			setRefresh={setRefresh}/>}
		{isUpdatingUser  && 
			<AddAndUpdateUserPopup currentUser={currentUser} 
			setIsInProcess={setIsUpdatingUser} setRefresh={setRefresh}
		getRole = {getRole} getRoles={getRoles} refreshAccessToken={refreshAccessToken}
			initialData = {users.find(user => user.isSelected)}/>
		}
		{isAddingUser  && 
			<AddAndUpdateUserPopup currentUser={currentUser} 
			setIsInProcess={setIsAddingUser} setRefresh={setRefresh}
			getRole = {getRole} getRoles = {getRoles} refreshAccessToken={refreshAccessToken}
			initialData={{roles: {User: '1998'}}}/>
		}
		</div>
	)
}