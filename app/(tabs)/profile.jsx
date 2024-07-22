import { router } from 'expo-router'
import {
	FlatList,
	Image,
	RefreshControl,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useEffect, useState } from 'react'
import EmptyState from '../../components/EmptyState'
import InfoBox from '../../components/InfoBox'
import VideoCard from '../../components/VideoCard'
import { icons } from '../../constants'
import { useGlobalContext } from '../../context/GlobalProvider'
import {
	getUserPosts,
	getUserPostsLikeCounts,
	signOut,
} from '../../lib/appwrite'
import useAppWrite from '../../lib/useAppWrite'

const Profile = () => {
	const { user, setUser, setIsLogged } = useGlobalContext()
	const { data: posts, refetch } = useAppWrite(() => getUserPosts(user.$id))
	const [refreshing, setRefreshing] = useState(false)

	useEffect(() => {
		getUserPostsLikeCounts(user.$id)
	}, [])

	const onRefresh = async () => {
		setRefreshing(true)
		await refetch()
		setRefreshing(false)
	}

	const logout = async () => {
		await signOut()
		setUser(null)
		setIsLogged(false)

		router.replace('/sign-in')
	}

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
					/>
				)}
				ListEmptyComponent={() => (
					<EmptyState
						title='Видео не найдены.'
						subtitle='Вы ещё не опубликовали ни одно видео... Скорее сделайте это!'
					/>
				)}
				ListHeaderComponent={() => (
					<View className='w-full flex justify-center items-center mt-6 mb-12 px-4'>
						<TouchableOpacity
							onPress={logout}
							className='flex w-full items-end mb-10'
						>
							<Image
								source={icons.logout}
								resizeMode='contain'
								className='w-6 h-6'
							/>
						</TouchableOpacity>

						<View className='w-16 h-16 border border-secondary rounded-lg flex justify-center items-center'>
							<Image
								source={{ uri: user?.avatar }}
								className='w-[100%] h-[100%] rounded-lg'
								resizeMode='cover'
							/>
						</View>

						<InfoBox
							title={user?.username}
							containerStyles='mt-5'
							titleStyles='text-lg'
						/>

						<View className='mt-5 flex flex-row'>
							<InfoBox
								title={posts.length || 0}
								subtitle='Posts'
								titleStyles='text-xl'
								containerStyles='mr-10'
							/>
							<InfoBox
								title='1.2k'
								subtitle='Followers'
								titleStyles='text-xl'
							/>
						</View>
					</View>
				)}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
		</SafeAreaView>
	)
}

export default Profile