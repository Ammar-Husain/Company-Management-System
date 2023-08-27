import React, { useState } from 'react'

export default function DeletePopup({person, currentUser, setIsDeleting, setRefresh}) {
	const [confirmationText, setComfirmationText] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	if (!person) {
		setIsDeleting(false)
		return
	}
	const name = person.username ? person.username : person.firstname
	function updateConfirmationText(event) {
		if(errorMessage) setErrorMessage(false)
		setComfirmationText(event.target.value)
	}
	function cancelDelete(event) {
		event.preventDefault()
		setIsDeleting(false)
	}
	async function confirmDelete(event) {
		event.preventDefault()
		if (confirmationText !== name) {
			setErrorMessage(`what you typed dosen't match "${name}"".` )
			return
		}
		try {
			const route = person.username ? `users`: `employees`
			const response = await fetch(`https://company-managing-api.onrender.com/${route}/${person._id}`, {
				method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						authorization: currentUser.accessToken
					},
					credentials: 'include'
			})
			if (response.status === 200) {
				setIsDeleting(false)
				setRefresh(pre => pre + 1)
			}
		} catch(err) {
			console.error(err)
			setErrorMessage('Deleteing user failed. Try again later.')
		}
	}
	return(
		<div className='delete-popup popup'>
			<form>
				<span>Are you sure you want to delete <strong>{name}</strong> ?</span>
				<span className="caution">This will permanently delete <strong>{name}</strong> and it can't be recovered after that.</span>
				<label>Type "{name}" to confirm deleting.</label>
				<input placeholder={name} value={confirmationText} onChange={updateConfirmationText}/>
				{errorMessage && <span id="error-message">{errorMessage}</span>}
				<div>
					<button className="confirm-button" onClick={confirmDelete}>Confirm</button>
					<button className="cancel-button" onClick={cancelDelete}>Cancel</button>
				</div>
			</form>
		</div>
	)
}