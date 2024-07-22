import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser } from '../lib/appwrite'

const GlobalContext = createContext()
export const useGlobalContext = () => useContext(GlobalContext)

export default GlobalProvider = ({ children }) => {
	const [isLogged, setIsLogged] = useState(false)
	const [user, setUser] = useState(null)
	const [isLoading, setLoading] = useState(true)

	useEffect(() => {
		getCurrentUser()
			.then(res => {
				if (res) {
					setIsLogged(true)
					setUser(res)
				} else {
					setIsLogged(false)
					setUser(null)
				}
			})
			.catch(error => {
				console.log(error)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])
	return (
		<GlobalContext.Provider
			value={{
				isLogged,
				setIsLogged,
				user,
				setUser,
				isLoading,
			}}
		>
			{children}
		</GlobalContext.Provider>
	)
}
