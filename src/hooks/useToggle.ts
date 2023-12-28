/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

const useToggle = (initialState = { isOpen: false } as any) => {
	// const [isOpen, setIsOpen] = useState<boolean>(initialState.isOpen)
	const [payload, setPayload] = useState<any>({ ...initialState })

	const close = (payload: any) => {
		// setIsOpen(false)
		setPayload({ ...payload, isOpen: false })
	}
	const show = (payload: any) => {
		// setIsOpen(true)
		setPayload({ ...payload, isOpen: true })
	}
	const toggle = () => {
		// setIsOpen(!isOpen)
		setPayload({ ...payload, isOpen: !payload.isOpen })
	}

	return { close, show, toggle, payload, isOpen: payload.isOpen }
}
export default useToggle

export type ModalToggle = ReturnType<typeof useToggle>
