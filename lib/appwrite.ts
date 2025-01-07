import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Storage,
  Query,
} from 'react-native-appwrite';

export const config = {
  platform: 'com.sima.greenworld',
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_ID!,
  postCollectionId: process.env.EXPO_PUBLIC_APPWRITE_POST_ID!,
  storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID!,
};

// Initialisation du client Appwrite
export const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Fonction pour créer un utilisateur
export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    const avatarUrl = avatars.getInitials(username);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw new Error('Unable to create user');
  }
};

// Fonction pour se connecter
export const signIn = async (email: string, password: string) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error: any) {
    console.error('Error during sign-in:', error);
    throw new Error('Failed to sign in');
  }
};

// Récupération de l'utilisateur actuel
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    return currentUser.documents[0];
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    throw new Error('No user found');
  }
};

// Fonction pour récupérer tous les posts
export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.postCollectionId,
      [Query.orderDesc('$createdAt')]
    );

    return posts.documents;
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    throw new Error('No posts found');
  }
};

// Fonction pour récupérer les derniers posts
export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.postCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(5)]
    );

    return posts.documents;
  } catch (error: any) {
    console.error('Error fetching latest posts:', error);
    throw new Error('No posts found');
  }
};

//Fonction search
export const searchPosts = async (query: string) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.postCollectionId,
      [Query.search('title', query)]
    );

    if (!posts.documents.length) throw new Error('No posts found');
    return posts.documents;
  } catch (error) {
    console.error('Error fetching search posts:', error);
    throw error;
  }
};

// Suppression d'un fichier et d'un document associés
// Type for Post document

type Creator = {
  username: string;
  avatar: string;
};
type Post = {
  $id: string;
  title: string;
  description: string;
  address: string;
  image: string;
  creator: Creator;
};

export const deleteSelectedPost = async (post: Post) => {
  try {
    // Vérification que le post existe et a un ID
    if (!post || !post.$id) {
      console.error('Invalid post object:', post);
      throw new Error('Invalid post data: missing post ID');
    }

    // Supprimer le document de la base de données
    await databases.deleteDocument(
      config.databaseId,
      config.postCollectionId,
      post.$id
    );

    // Si l'image est une URL Appwrite Storage, extraire l'ID du fichier et le supprimer
    if (post.image && post.image.includes('appwrite.io')) {
      try {
        const fileId = post.image.split('/files/')[1].split('/')[0];
        await storage.deleteFile(config.storageId, fileId);
      } catch (imageError) {
        console.warn('Could not delete associated image:', imageError);
        // On continue même si la suppression de l'image échoue
      }
    }

    return true;
  } catch (error: any) {
    console.error('Error deleting post:', error.message || error);
    throw new Error(`Failed to delete post: ${error.message}`);
  }
};

// Fonction pour mettre à jour un document dans Appwrite
export const updatePost = async (
  postId: string,
  data: object
): Promise<any> => {
  try {
    const updatedPost = await databases.updateDocument(
      config.databaseId,
      config.postCollectionId,
      postId,
      data
    );

    console.log('Post mis à jour avec succès :', updatedPost);
    return updatedPost;
  } catch (error: any) {
    console.error(
      'Erreur lors de la mise à jour du post :',
      error.message || error
    );
    throw new Error('Impossible de mettre à jour le post');
  }
};

// Fonction pour déconnecter un utilisateur
export const logout = async () => {
  try {
    await account.deleteSession('current');
  } catch (error: any) {
    console.error('Error during logout:', error);
    throw new Error('Failed to logout');
  }
};

// Fonction pour prévisualiser un fichier
export const getFilePreview = async (fileId: string): Promise<string> => {
  try {
    return (await storage.getFileView(config.storageId, fileId)).toString();
  } catch (error: any) {
    console.error('Error fetching file preview:', error);
    throw new Error('Unable to fetch file preview');
  }
};

// Téléchargement d'un fichier
export const uploadFile = async (file: any): Promise<string> => {
  if (!file) throw new Error('No file provided');

  try {
    const response = await fetch(file.uri);
    const blob = await response.blob();
    const fileName = file.uri.split('/').pop() || 'file.jpg';

    // Création du fichier dans Appwrite
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      {
        name: fileName,
        type: blob.type,
        size: blob.size,
        uri: file.uri,
      }
    );

    return (
      await storage.getFileView(config.storageId, uploadedFile.$id)
    ).toString();
  } catch (error: any) {
    console.error('Upload error:', error.message, error);
    throw new Error('Failed to upload file');
  }
};

// Création d'un post

type PostForm = {
  title: string;
  description: string;
  address: string;
  image: any;
  creator?: string;
};
export const createPost = async (form: PostForm): Promise<any> => {
  try {
    // Upload de l'image
    const imageUrl = await uploadFile(form.image);

    // Récupération de l'utilisateur actuel
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Current user not found');
    }

    // Création du document dans Appwrite
    const newPost = await databases.createDocument(
      config.databaseId,
      config.postCollectionId,
      ID.unique(),
      {
        title: form.title,
        description: form.description,
        address: form.address,
        image: imageUrl,
        creator: currentUser.$id,
      }
    );

    return newPost;
  } catch (error: any) {
    console.error('Error creating post:', error.message, error);
    throw new Error('Failed to create post');
  }
};
