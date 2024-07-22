import { Redirect, Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Image, Text, View } from 'react-native'

// import { Loader } from '../../components'
import { icons } from '../../constants'
import { useGlobalContext } from '../../context/GlobalProvider'

const TabIcon = ({ icon, color, name, focused }) => {
	return (
		<View className='flex items-center justify-center gap-2'>
			<Image
				source={icon}
				resizeMode='contain'
				tintColor={color}
				className='w-6 h-6'
			/>
			<Text
				className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
				style={{ color: color }}
			>
				{name}
			</Text>
		</View>
	)
}

const TabLayout = () => {
	const { isLoading, isLogged } = useGlobalContext()

	if (!isLoading && !isLogged) return <Redirect href='/sign-in' />

	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: '#FFA001',
					tabBarInactiveTintColor: '#CDCDE0',
					tabBarShowLabel: false,
					tabBarStyle: {
						backgroundColor: '#161622',
						borderTopWidth: 1,
						borderTopColor: '#232533',
						height: 84,
					},
				}}
			>
				<Tabs.Screen
					tabPr
					name='home'
					options={{
						title: 'Главная',
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.home}
								color={color}
								name='Главная'
								focused={focused}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name='bookmark'
					options={{
						title: 'Избранное',
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.bookmark}
								color={color}
								name='Избранное'
								focused={focused}
							/>
						),
					}}
				/>

				<Tabs.Screen
					name='create'
					options={{
						title: 'Создать',
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.plus}
								color={color}
								name='Создать'
								focused={focused}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name='profile'
					options={{
						title: 'Profile',
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.profile}
								color={color}
								name='Профиль'
								focused={focused}
							/>
						),
					}}
				/>
			</Tabs>

			{/* <Loader isLoading={loading} /> */}
			<StatusBar backgroundColor='#161622' style='light' />
		</>
	)
}

export default TabLayout
