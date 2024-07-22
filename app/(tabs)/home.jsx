import React, { useState } from 'react'
import { FlatList, Image, RefreshControl, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '../../components/EmptyState'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import VideoCard from '../../components/VideoCard'
import { images } from '../../constants'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppWrite from '../../lib/useAppWrite'

const Home = () => {
	const { user } = useGlobalContext()
	const { data: posts, refetch } = useAppWrite(getAllPosts)
	const { data: latestPosts } = useAppWrite(getLatestPosts)
	const [refreshing, setRefreshing] = useState(false)

	const onRefresh = async () => {
		setRefreshing(true)
		await refetch()
		setRefreshing(false)
	}

	return (
		<SafeAreaView className='bg-primary  h-full'>
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
						likesIsVisible={true}
					/>
				)}
				ListHeaderComponent={() => (
					<View className='my-6 px-4 space-y-6'>
						<View className='justify-between items-start flex-row mb-6'>
							<View>
								<Text className='font-pmedium text-sm text-gray-100'>
									Добро пожаловать
								</Text>
								<Text className='text-2xl font-psemibold text-white'>
									{user?.username}
								</Text>
							</View>
							<View className='mt-1.5'>
								<Image
									source={images.logoSmall}
									className='w-9 h-10'
									resizeMode='contain'
								/>
							</View>
						</View>

						<SearchInput />

						<View className='w-full flex-1 pt-1 pb-8'>
							<Text className='text-gray-100 text-lg font-pregular mb-3'>
								Новые видео
							</Text>
							<Trending posts={latestPosts ?? []} />
						</View>
					</View>
				)}
				ListEmptyComponent={() => (
					<EmptyState
						title='Видео не найдены.'
						subtitle='Загрузи видео первым!'
					/>
				)}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
		</SafeAreaView>
	)
}

export default Home
