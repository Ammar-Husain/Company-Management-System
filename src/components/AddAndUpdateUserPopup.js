import React, { useState } from 'react'

export default function AddAndUpdateUserPopup(props) {
	const {
		currentUser, setRefresh, getRole, getRoles,
		setIsInProcess, initialData, refreshAccessToken
	} = props
	if (initialData.username) {
		initialData.password = '';
	}
	initialData.role = getRole(initialData)
	const [data, setData] = useState(initialData)
	const [errorMessage, setErrorMessage] = useState({})

	const currentUserRole = getRole(currentUser)
	function updateData(event) {
		const name = event.target.name
		const value = event.target.value
		if(errorMessage[name]) setErrorMessage({name: false})
		if (value === 'Super Admin' && data.role !== 'Super Admin') {
			setErrorMessage(errorMessage => ({
				role: `If you make another user a "Super Admin your position will be automatically set to "Admin".`
			}))		
		} else if (data.role === 'Super Admin' && name === 'role' && value !== 'Super Admin') {
			setErrorMessage(errorMessage => ({
				role: 'You have to make another person super admin before leaving the position.'
			}))
			return
		}
		setData(prevData => ({...prevData, [name]: value}))
	}
	function cancel(event) {
		event.preventDefault()
		setIsInProcess(false)
	}
	async function confirm(event) {
		event.preventDefault()
		if (!data.username) {
			setErrorMessage({username: 'username require.'})
			return
		} else if (!data.password && !initialData.username) {
			setErrorMessage({password: 'password required.'})
			return
		} else if (!data.username) {
			setErrorMessage({ username: 'username require.' })
			return
		} else if (!data.email) {
			setErrorMessage({ email: 'email require.' })
			return
		} else if (!data.phoneNumber) {
			setErrorMessage({ phoneNumber: 'phoneNumber require.' })
			return
		} 
		const userRoles = getRoles(data.role)
		let updatedData = {...data, id: data._id, roles: userRoles} 
		if((initialData.username && data.password) || !initialData.username) {
			updatedData.password = data.password 
		}
		console.log(updatedData)
		const method = initialData.username ? 'PUT' : 'POST'
		const body = JSON.stringify(updatedData)
		const route = initialData.username ? 'update': 'register'
		try {
			const response = await fetch(`https://company-managing-api.onrender.com/users/${route}`, {
				method,
					headers: {
						'Content-Type': 'application/json',
						authorization: currentUser.accessToken
					},
					credentials: 'include',
					body
			})
			if (response.status === 201 || response.status === 200) {
				setIsInProcess(false)
			 	setRefresh(pre => pre + 1)
				if (userRoles.SuperAdmin === 2004) {
					refreshAccessToken()
				}
			} else if (response.status === 401) {
				const data = await response.json();
				const duplicated = data.duplicated
				setErrorMessage(errorMessage => ({
					[duplicated]: `there is already a user with this "${duplicated}".`
				}))
			} else if (response.status === 500) {
				setErrorMessage(errorMessage => ({
					form: 'Server error. try again later.'
				}))
			}
		} catch(err) {
			console.error(err)
			setErrorMessage({form: 'Server error. try again later.'})
		}
	}
	return(
		<div className='add-user-popup popup'>
			<form>
				<div>
					<label>username: </label>
					<input type="name" name="username" placeholder="username"
					value={data.username} onChange={updateData} placeholder="username"/>
					<br />
					{errorMessage.username &&
					<span id="error-message">{errorMessage.username}</span>
					}
				</div>
				<div>
					<label>password: </label>
					<input type="password" name="password" id={initialData.username?"update-password":""}
					placeholder={initialData.username ? "Leave it blank if you don't want to change it": "password"}
					value={data.password} onChange={updateData}/>
					<br />
					{errorMessage.password &&
					<span id="error-message">{errorMessage.password}</span>
					}
				</div>
				<div>
					<label>email: </label>
					<input type="email" name="email" placeholder="email"
					value={data.email} onChange={updateData}/>
					<br />
					{errorMessage.email &&
					<span id="error-message">{errorMessage.email}</span>
					}
				</div>
				<div>
					<label>Phone number: </label>
					<input type="text" name="phoneNumber" placeholder="phone Number"
					value={data.phoneNumber} onChange={updateData}/>
					<br />
					{errorMessage.phoneNumber &&
					<span id="error-message">{errorMessage.phoneNumber}</span>
					}
				</div>
				<div>
					<label>Role: </label>
					<select name="role" onChange={updateData} value={data.role} >
						{ currentUserRole === 'Super Admin' &&
							<option value={'Super Admin'}>
								Super Admin
							</option>
						}
						{ currentUserRole === 'Super Admin' &&
							<option value={'Admin'}>
								Admin
							</option>
						}
						<option value={'Editor'}>
							Editor
						</option>
						<option value={'User'}>
							User
						</option>
					</select>
					<br />
					{errorMessage.role &&
					<span id="error-message">{errorMessage.role}</span>
					}
				</div>
				{errorMessage.form &&
					<span id="error-message">{errorMessage.form}</span>
				}
				<div className="cancel-and-confirm-update-container">
					<button className="confirm-button" onClick={confirm}>Confirm</button>
					<button className="cancel-button"  onClick={cancel}>Cancel</button>
				</div>
			</form>
		</div>
	)
}