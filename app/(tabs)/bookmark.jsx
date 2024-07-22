import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getUserFavoritesPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppWrite'

const Bookmark = () => {
	const { user } = useGlobalContext()
	const { data: posts, refetch } = useAppwrite(() =>
		getUserFavoritesPosts(user.$id)
	)
	const [refreshing, setRefreshing] = useState(false)
	const onRefresh = async () => {
		setRefreshing(true)
		await refetch()
		setRefreshing(false)
	}
	useEffect(() => {
		onRefresh()
	}, [])

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
						videoObj={item}
						userId={user ? user.$id : null}
						onRefresh={onRefresh}
					/>
				)}
				ListHeaderComponent={() => (
					<View className='my-6 px-4 space-y-6'>
						<Text className='text-2xl text-white font-psemibold'>
							Избранное
						</Text>
					</View>
				)}
				ListEmptyComponent={() => (
					<EmptyState
						title='Нет сохраненных видео'
						subtitle='Добавь понравившиеся видео в избранное'
					/>
				)}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
		</SafeAreaView>
	)
}

export default Bookmark
