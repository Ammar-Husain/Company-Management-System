import React, { useState, useEffect } from 'react'
import DeletePopup from './DeletePopup.js'
import AddAndUpdateEmpPopup from './AddAndUpdateEmpPopup.js'

export default function ManageEmployeesPage(props) {
	const {user: currentUser, setPage, getRole, getLastActivity, getRoles, refreshAccessToken, logout} = props
	const [refresh, setRefresh] = useState(0)
	const [isUpdatingEmp, setIsUpdatingEmp] = useState(false)
	const [isDeletingEmp, setIsDeletingEmp] = useState(false)
	const [isAddingEmp, setIsAddingEmp] = useState(false)
	const [employees, setEmployees] = useState([])
	const role = getRole(currentUser)
	
	useEffect(() => {
		const getEmployees = async () => {
			try {
				const response = await fetch('https://company-managing-api.onrender.com/employees/', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						authorization: currentUser.accessToken
					},
						credentials: 'include'
				})
				const data = await response.json()
				data.forEach(emp => {
					emp.isSelected = false;
				})
				setEmployees(data.sort())
			} catch(err) {
				console.error(err)
			}
		}
		getEmployees()
	}, [refresh])
	
	function toggleIsSelected(event, id) {
		setTimeout(() => {
			if (event.target.name !== 'edit' && event.target.name !== 'delete' &&
				!(isDeletingEmp || isUpdatingEmp || isAddingEmp)) {
				if (event.type === 'mouseleave') {
					setEmployees(prevEmps => prevEmps.map(emp => ({ ...emp, isSelected: false })))
				} else {
					setEmployees(prevEmps => prevEmps.map(emp => (
						emp._id !== id ? { ...emp, isSelected: false } : { ...emp, isSelected: !emp.isSelected }
					)))
				}
			}
		}, 20)
	}
	function start(action) {
		if (!(isDeletingEmp || isUpdatingEmp || isAddingEmp)) {
			action === 'updating' ? setIsUpdatingEmp(true)
			: action === 'deleting' ? setIsDeletingEmp(true)
			: setIsAddingEmp(true)
		}
	}
	const empsList = employees.map((emp, index) => {
		return(
			<div key={emp._id} className="emp" 
			onMouseOver = {(event) => toggleIsSelected(event, emp._id)}
			onMouseLeave = {(event) => toggleIsSelected(event, emp._id)}>
				<div className="number">{index + 1}</div>
				<div className="name">
				{emp.firstname} {emp.lastname}			
				</div>
				<div className="email">
					{emp.email}			
				</div>
				<div className="phone">
					{emp.phoneNumber}			
				</div>
				<div className="bdate">
					{emp.birthDate}			
				</div>
				<div className="status" id="emp-inf">
					{emp.employmentStatus}
				</div>
					<div className="edit-delete-buttons" id="edit-delete-emp">
					{ emp.isSelected && 
						<button className="edit" id="edit-emp" name="edit">
							<img src="/src/icons/edit-icon.png" name="edit" onClick={() => start('updating')}/>
						</button>
					}
					{ emp.isSelected && role !== 'User' &&
					<button className="delete" id="delete-emp" name="delete" >
						<img src="/src/icons/delete-icon.png" name="delete" onClick={() => start('deleting')}/>
					</button>
					}
				</div>
			</div>
		)
	})
	const name = currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1)
	return (
		<div>
			<i className="hello-message">Hello {name}</i> < br / >
			<span className="role">{role}</span>
			<div className="emps">
				<div className="emp categs">
					<div>NO</div>
					<div>Name</div>
					<div>Email</div>
					<div>Phone number</div>
					<div>Birth date</div>
					<div id="emp-inf">Employment status</div>
					<div>options</div>
				</div>
				{empsList}
				<div className="add-button" id="add-emp" onClick={() => start('adding')}>
					<img id="emp-icon" src="/src/icons/employee-icon.png"/>
					<img id="add-icon" src="/src/icons/add-icon.png"/>
				</div>
			</div>
			{isDeletingEmp  && 
				<DeletePopup person={employees.find(emp => emp.isSelected)} 
				setIsDeleting={setIsDeletingEmp} setRefresh={setRefresh}
				currentUser={currentUser}/>}
			{isUpdatingEmp  && 
				<AddAndUpdateEmpPopup setIsInprocess={setIsUpdatingEmp} setRefresh={setRefresh}
				currentUser={currentUser} initialData={employees.find(emp => emp.isSelected)}/>
			}
			{isAddingEmp  && 
				<AddAndUpdateEmpPopup setIsInprocess={setIsAddingEmp} setRefresh={setRefresh}
				currentUser={currentUser} initialData={{}}/>
			}
			<div className="logout-back-container">
				<span className="logout" onClick={logout}>logout</span>
				<span className="back" onClick={() => setPage('main-page')}>Back</span>
			</div>
		</div>
	)
}