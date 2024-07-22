import {
	Account,
	Avatars,
	Client,
	Databases,
	ID,
	Query,
	Storage,
} from 'react-native-appwrite'

export const config = {
	endpoint: 'https://cloud.appwrite.io/v1',
	platform: 'com.reactnativejs.aora',
	projectId: '668a9937002a86e4cab4',
	databaseId: '668a9ade00056f6a8e29',
	userCollectionId: '668a9af5002cacad91fc',
	videoCollectionId: '668a9b2d003d951718b3',
	favoritesVideoCollectionId: '668bc0110017696fbeac',
	storageId: '668a9ddb003ca6bce080',
}
const {
	endpoint,
	platform,
	projectId,
	databaseId,
	userCollectionId,
	videoCollectionId,
	favoritesVideoCollectionId,
	storageId,
} = config

const client = new Client()

client
	.setEndpoint(config.endpoint)
	.setProject(config.projectId)
	.setPlatform(config.platform)

const account = new Account(client)
const storage = new Storage(client)
const avatars = new Avatars(client)
const databases = new Databases(client)

// Register user
export async function createUser(email, password, username) {
	try {
		const newAccount = await account.create(
			ID.unique(),
			email,
			password,
			username
		)

		if (!newAccount) throw Error

		const avatarUrl = avatars.getInitials(username)

		await signIn(email, password)

		const newUser = await databases.createDocument(
			config.databaseId,
			config.userCollectionId,
			ID.unique(),
			{
				accountId: newAccount.$id,
				email: email,
				username: username,
				avatar: avatarUrl,
			}
		)

		return newUser
	} catch (error) {
		throw new Error(error)
	}
}

// Sign In
export async function signIn(email, password) {
	try {
		const session = await account.createEmailPasswordSession(email, password)

		return session
	} catch (error) {
		throw new Error(error)
	}
}

// Get Account
export async function getAccount() {
	try {
		const currentAccount = await account.get()

		return currentAccount
	} catch (error) {
		throw new Error(error)
	}
}

export async function getCurrentUser() {
	try {
		const currentAccount = await getAccount()
		if (!currentAccount) throw Error

		const currentUser = await databases.listDocuments(
			config.databaseId,
			config.userCollectionId,
			[Query.equal('accountId', currentAccount.$id)]
		)

		if (!currentUser) throw Error

		return currentUser.documents[0]
	} catch (error) {
		console.log(error)
		return null
	}
}

export async function signOut() {
	try {
		const session = await account.deleteSession('current')

		return session
	} catch (error) {
		throw new Error(error)
	}
}

// Get video posts created by user
export async function getUserPosts(userId) {
	try {
		const posts = await databases.listDocuments(
			config.databaseId,
			config.videoCollectionId,
			[Query.equal('creator', userId)]
		)

		return posts.documents
	} catch (error) {
		throw new Error(error)
	}
}

// Get video posts saved by user
export async function getUserFavoritesPosts(userId) {
	try {
		const posts = await databases.listDocuments(
			databaseId,
			favoritesVideoCollectionId,
			[Query.equal('user', userId)]
		)
		return posts.documents[0].videos
	} catch (error) {
		throw new Error(error)
	}
}

export async function getUserPostsLikeCounts(userId) {
	try {
		return posts.documents
	} catch (error) {
		throw new Error(error)
	}
}

export async function getAllPosts() {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.orderDesc('$createdAt'),
		])

		return posts.documents
	} catch (error) {
		throw new Error(error)
	}
}

// Get latest created video posts
export async function getLatestPosts() {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.orderDesc('$createdAt'),
			Query.limit(7),
		])

		return posts.documents
	} catch (error) {
		throw new Error(error)
	}
}

// Get video posts that matches search query
export async function searchPosts(query) {
	try {
		const posts = await databases.listDocuments(databaseId, videoCollectionId, [
			Query.search('title', query),
			Query.orderDesc('$createdAt'),
		])

		if (!posts) throw new Error('Что-то пошло не так...')

		return posts.documents
	} catch (error) {
		throw new Error(error)
	}
}

// Search video on favorites collection
export async function SearchUserFavoritesVideo(userId) {
	try {
		const posts = await databases.listDocuments(
			databaseId,
			favoritesVideoCollectionId,
			[Query.equal('user', userId)]
		)
		return posts.documents[0]
	} catch (error) {
		throw new Error(error)
	}
}

export async function updateVideoFromFavoritesVideos(post) {
	try {
		const updatedPost = await databases.updateDocument(
			config.databaseId,
			favoritesVideoCollectionId,
			post.$id,
			{ videos: post.videos }
		)
		return updatedPost
	} catch (error) {
		throw new Error(error)
	}
}

export async function SearchVideoOnUserFavoritesVideos(userId, VideoID) {
	const posts = await SearchUserFavoritesVideo(userId)
	if (posts.videos.filter(video => video.$id == VideoID).length > 0) return true
	else return false
}
export async function getVideoById(VideoId) {
	const posts = await databases.listDocuments(databaseId, videoCollectionId, [
		Query.equal('$id', VideoId),
	])
	return posts.documents[0]
}
// Change video to favorites
export async function ChangeVideoToFavorites(userId, videoObj) {
	try {
		let tempVideo = null
		let isFavorite = false
		const posts = await SearchUserFavoritesVideo(userId)
		posts.videos.map(postsVideosItem => {
			if (postsVideosItem.$id === videoObj.$id) {
				tempVideo = postsVideosItem
			}
		})

		if (tempVideo) {
			posts.videos = posts.videos.filter(
				postItem => postItem.$id !== videoObj.$id
			)
			await ChangeVideoLikes(tempVideo, 'delete')
			isFavorite = false
		} else {
			posts.videos.push(
				await ChangeVideoLikes(await getVideoById(videoObj.$id), 'add')
			)
			isFavorite = true
		}
		const updatedVideoCollection = await updateVideoFromFavoritesVideos(posts)
		return isFavorite
	} catch (error) {
		throw new Error(error)
	}
}
export async function ChangeVideoLikes(videoObj, operation) {
	try {
		let changedLikes = 0
		if (operation === 'add') changedLikes = videoObj.likes + 1
		if (operation === 'delete') changedLikes = videoObj.likes - 1
		const updatedPost = await databases.updateDocument(
			config.databaseId,
			videoCollectionId,
			videoObj.$id,
			{ likes: changedLikes }
		)
		return updatedPost
	} catch (error) {
		throw new Error(error)
	}
}

// Get File Preview
export async function getFilePreview(fileId, type) {
	let fileUrl

	try {
		if (type === 'video') {
			fileUrl = storage.getFileView(storageId, fileId)
		} else if (type === 'image') {
			fileUrl = storage.getFilePreview(
				storageId,
				fileId,
				2000,
				2000,
				'top',
				100
			)
		} else {
			throw new Error('Invalid file type')
		}

		if (!fileUrl) throw Error

		return fileUrl
	} catch (error) {
		throw new Error(error)
	}
}

// Upload File
export async function uploadFile(file, type) {
	if (!file) return

	const asset = {
		name: file.fileName,
		type: file.mimeType,
		size: file.fileSize,
		uri: file.uri,
	}

	try {
		const uploadedFile = await storage.createFile(storageId, ID.unique(), asset)

		const fileUrl = await getFilePreview(uploadedFile.$id, type)
		return fileUrl
	} catch (error) {
		throw new Error(error)
	}
}

// Create Video Post
export async function createVideoPost(form) {
	try {
		const [thumbnailUrl, videoUrl] = await Promise.all([
			uploadFile(form.thumbnail, 'image'),
			uploadFile(form.video, 'video'),
		])

		const newPost = await databases.createDocument(
			databaseId,
			videoCollectionId,
			ID.unique(),
			{
				title: form.title,
				thumbnail: thumbnailUrl,
				video: videoUrl,
				prompt: form.prompt,
				creator: form.userId,
			}
		)

		return newPost
	} catch (error) {
		throw new Error(error)
	}
}
