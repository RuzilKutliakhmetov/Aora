import { router, usePathname } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, TextInput, TouchableOpacity, View } from 'react-native'

import { icons } from '../constants'

const SearchInput = ({ initialQuery }) => {
	const pathname = usePathname()
	const [query, setQuery] = useState(initialQuery || '')

	return (
		<View className='flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary'>
			<TextInput
				className='text-base mt-0.5 text-white flex-1 font-pregular'
				value={query}
				placeholder='Поиск по теме видео'
				placeholderTextColor='#CDCDE0'
				onChangeText={e => setQuery(e)}
			/>

			<TouchableOpacity
				onPress={() => {
					if (query === '')
						return Alert.alert(
							'Ничего не найдено...',
							'Пожалуйста, введите что-нибудь для получения результатов поиска.'
						)

					if (pathname.startsWith('/search')) router.setParams({ query })
					else router.push(`/search/${query}`)
				}}
			>
				<Image source={icons.search} className='w-5 h-5' resizeMode='contain' />
			</TouchableOpacity>
		</View>
	)
}

export default SearchInput
