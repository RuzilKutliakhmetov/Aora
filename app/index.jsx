import { Redirect, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../components/CustomButton'
import { images } from '../constants'
import { useGlobalContext } from '../context/GlobalProvider'

export default function App() {
	const { isLoading, isLogged } = useGlobalContext()
	if (!isLoading && isLogged) return <Redirect href='/home' />
	return (
		<SafeAreaView className='bg-primary h-full'>
			<ScrollView
				contentContainerStyle={{
					height: '100%',
				}}
			>
				<View className='w-full flex justify-start items-center min-h-[85vh] px-4'>
					<Image
						source={images.logo}
						className='w-[130px] h-[84px]'
						resizeMode='contain'
					/>
					<Image
						source={images.cards}
						className='max-w-[380px] w-full h-[298px]'
						resizeMode='contain'
					/>

					<View className='relative mt-5'>
						<Text className='text-3xl text-white font-bold text-center'>
							Откройте для себя бесконечные возможности с{' '}
							<Text className='text-secondary-200'>Aora</Text>
						</Text>
						<Image
							source={images.path}
							className='w-[136px] h-[15px] absolute -bottom-2 -right-8'
							resizeMode='contain'
						/>
					</View>
					<Text className='text-sm font-pregular text-gray-100 mt-7 text-center'>
						Там, где креативность сочетается с инновациями: отправляйтесь в
						безграничное путешествие исследуйте с Aora{' '}
					</Text>
					<CustomButton
						title='Войти с помощью Email'
						handlePress={() => router.push('/sign-in')}
						containerStyles='w-full mt-7'
					/>
				</View>
			</ScrollView>
			<StatusBar backgroundColor='#161622' style='light' />
		</SafeAreaView>
	)
}
