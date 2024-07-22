import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Dimensions, Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import { images } from '../../constants'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getCurrentUser, signIn } from '../../lib/appwrite'
const SignIn = () => {
	const { setUser, setIsLogged } = useGlobalContext()
	const [form, setForm] = useState({
		email: '',
		password: '',
	})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const submit = async () => {
		if (form.email === '' || form.password === '') {
			Alert.alert('Ошибка', 'Пожалуйста, заполните все поля')
		}
		setIsSubmitting(true)

		try {
			await signIn(form.email, form.password)
			const result = await getCurrentUser()
			setUser(result)
			setIsLogged(true)

			router.replace('/home')
		} catch (error) {
			Alert.alert('Ошибка', error.message)
		} finally {
			setIsSubmitting(false)
		}
	}
	return (
		<SafeAreaView className='bg-primary h-full'>
			<ScrollView>
				<View
					className='w-full flex justify-start min-h-[82vh] px-4 my-6'
					style={{
						minHeight: Dimensions.get('window').height - 100,
					}}
				>
					<Image
						source={images.logo}
						resizeMode='contain'
						className='w-[115px] h-[34px]'
					/>

					<Text className='text-2xl font-semibold text-white mt-10 font-psemibold'>
						Авторизация
					</Text>
					<FormField
						title='Email'
						value={form.email}
						handleChangeText={e => setForm({ ...form, email: e })}
						otherStyles='mt-7'
						keyboardType='email-address'
					/>
					<FormField
						title='Пароль'
						value={form.password}
						handleChangeText={e => setForm({ ...form, password: e })}
						otherStyles='mt-7'
					/>
					<CustomButton
						title='Войти'
						handlePress={submit}
						containerStyles='mt-7'
						isLoading={isSubmitting}
					/>

					<View className='flex justify-center pt-5 flex-row gap-2'>
						<Text className='text-lg text-gray-100 font-pregular'>
							Нет аккаунта?
						</Text>
						<Link
							href='/sign-up'
							className='text-lg font-psemibold text-secondary'
						>
							Зарегистрируйся
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default SignIn
