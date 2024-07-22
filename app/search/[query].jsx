import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '../../components/EmptyState'
import SearchInput from '../../components/SearchInput'
import VideoCard from '../../components/VideoCard'
import { searchPosts } from '../../lib/appwrite'
import useAppWrite from '../../lib/useAppWrite'

const Search = () => {
	const { query } = useLocalSearchParams()
	const { data: posts, refetch } = useAppWrite(() => searchPosts(query))

	useEffect(() => {
		refetch()
	}, [query])

	return (
		<SafeAreaView className='bg-primary h-full'>
			<FlatList
				data={posts}
				keyExtractor={item => item.$id}
				renderItem={({ item }) => (
					<VideoCard
						title={item.title}
						thumbnail={item.thumbnail}
						video={item.video}
						creator={item.creator.username}
						avatar={item.creator.avatar}
					/>
				)}
				ListHeaderComponent={() => (
					<>
						<View className='flex my-6 px-4'>
							<Text className='font-pmedium text-gray-100 text-sm'>
								Результат поиска
							</Text>
							<Text className='text-2xl font-psemibold text-white mt-1'>
								{query}
							</Text>

							<View className='mt-6 mb-8'>
								<SearchInput initialQuery={query} refetch={refetch} />
							</View>
						</View>
					</>
				)}
				ListEmptyComponent={() => (
					<EmptyState
						title='Видео не найдены.'
						subtitle='Не найдены видео по запросу...'
					/>
				)}
			/>
		</SafeAreaView>
	)
}

export default Search
