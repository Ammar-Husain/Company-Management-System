import React, { useState } from 'react'

export default function AddAndUpdateEmpPopup({setRefresh, setIsInprocess, currentUser, initialData}) {
	const [data, setData] = useState(initialData)
	const [errorMessage, setErrorMessage] = useState({})

	function updateData(event) {
		const name = event.target.name
		const value = event.target.value
		if(errorMessage[name]) setErrorMessage({name: false})
		setData(prevData => ({...prevData, [name]: value}))
	}
	
	function cancel(event) {
		event.preventDefault()
		setIsInprocess(false)
	}
	async function confirm(event) {
		event.preventDefault()
		let { firstname, lastname, email, phoneNumber, birthDate, employmentStatus } = data
		if (!firstname) {
			setErrorMessage({firstname: 'firstname required.'})
			return 
		} else if (!lastname) {
			setErrorMessage({lastname: 'lastname required.'})
			return
		} else if (!email) {
			setErrorMessage({email: 'email required.'})
			return
		} else if (!phoneNumber) {
			setErrorMessage({phoneNumber: 'phone number required.'})
			return
		} else if (!birthDate) {
			setErrorMessage({birthDate: 'birth date required.'})
			return
		} else if (!employmentStatus || employmentStatus === 'choose') {
			setErrorMessage({ employmentStatus: 'Employment statsu required.' })
			return
		}
		const empData = {...data, id: data._id};
		const body = JSON.stringify(empData)
		const method = initialData.firstname ? 'PUT' : 'POST'
		try {
			const response = await fetch(`https://company-managing-api.onrender.com/employees/`, {
				method,
					headers: {
						'Content-Type': 'application/json',
						authorization: currentUser.accessToken
					},
					credentials: 'include',
					body
			})
			if (response.status === 201) {
				setIsInprocess(false)
				setRefresh(pre => pre + 1)
			} else if (response.status === 500) {
				setErrorMessage({form: 'Server error. try again later.'})
			}
		} catch(err) {
			console.error(err)
			setErrorMessage({form: 'Server error. try again later.'})
		}
	}
	return(
		<div className='add-emp-popup popup'>
			<form>
				<div>
					<label>firstname: </label>
					<input type="name" name="firstname" placeholder="firstname"
					value={data.firstname} onChange={updateData}/>
					{errorMessage.firstname &&
					<span id="error-message">{errorMessage.firstname}</span>
					}
				</div>
				<div>
					<label>lastname: </label>
					<input type="lastname" name="lastname" placeholder="lastname"
					value={data.lastname} onChange={updateData}/>
					{errorMessage.lastname &&
					<span id="error-message">{errorMessage.lastname}</span>
					}
				</div>
				<div>
					<label>email: </label>
					<input type="email" name="email" placeholder="email"
					value={data.email} onChange={updateData}/>
					{errorMessage.email &&
					<span id="error-message">{errorMessage.email}</span>
					}
				</div>
				<div>
					<label>phone number: </label>
					<input name="phoneNumber" placeholder="Phone number"
					value={data.phoneNumber} onChange={updateData}/>
					<br />
					{errorMessage.phoneNumber &&
					<span id="error-message">{errorMessage.phoneNumber}</span>
					}
				</div>
				<div>
					<label>Birth date: </label>
					<input type="date" name="birthDate" placeholder="Birth date"
					value={data.birthDate} onChange={updateData}/>
					{errorMessage.birthDate &&
					<span id="error-message">{errorMessage.birthDate}</span>
					}
				</div>
				<div>
					<label>Employment status: </label>
					<select name="employmentStatus" value={data.employmentStatus} onChange={updateData}>
						<option value="choose">Choose Status</option>
						<option value="Full-time">Full-time</option>
						<option value="Partial-time">Partial-time</option>
						<option value="Remote">Remote</option>
						<option value="Contract">Contract</option>
					</select>
					{errorMessage.employmentStatus &&
					<span id="error-message">{errorMessage.employmentStatus}</span>
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