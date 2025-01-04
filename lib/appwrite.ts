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
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || '',
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_ID || '',
  postCollectionId: process.env.EXPO_PUBLIC_APPWRITE_POST_ID || '',
  storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID || '',
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

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

    if (!newAccount) throw new Error('Failed to create user');

    const avatarUrl = avatars.getInitials(username);

    console.log('Creating user document in database...');
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
  } catch (error) {
    console.error(error);
    throw new Error(error as any);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error(error);
    throw new Error(error as any);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw new Error('Failed to get current user');
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser) throw new Error('Failed to get current user');
    return currentUser.documents[0];
  } catch (error) {
    console.error(error, 'Failed to get current user');
    throw new Error(error as any);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.postCollectionId,
      [Query.orderDesc('$createdAt')]
    );

    if (!posts) throw new Error('No posts found');
    return posts.documents;
  } catch (error) {
    console.error(error);
    throw new Error(error as any);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.postCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(5)]
    );

    if (!posts) throw new Error('No posts found');
    return posts.documents;
  } catch (error) {
    console.error(error);
    throw new Error(error as any);
  }
};

export const deleteFileFromDatabase = async (
  collectionId: string,
  documentId: string,
  fileId: string
) => {
  try {
    await storage.deleteFile(config.storageId, fileId);
    console.log(`Fichier avec l'ID ${fileId} supprimé du stockage.`);

    await databases.deleteDocument(config.databaseId, collectionId, documentId);
    console.log(
      `Document avec l'ID ${documentId} supprimé de la base de données.`
    );
  } catch (error) {
    console.error(
      'Erreur lors de la suppression du fichier ou du document :',
      error
    );
    throw new Error(error as any);
  }
};

export const logout = async () => {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error(error);
    throw new Error(error as any);
  }
};

export const getFilePreView = async (
  fileId: string,
  type: string
): Promise<string> => {
  let fileUrl = '';
  try {
    fileUrl = (await storage.getFileView(config.storageId, fileId)).toString();
    return fileUrl;
  } catch (error) {
    console.error('Error fetching file preview:', error);
    throw new Error('Unable to fetch file preview');
  }
};

export const uploadFile = async (file: any): Promise<string> => {
  if (!file) throw new Error('No file provided');

  try {
    // Convert image URI to Blob
    const response = await fetch(file.uri);
    const blob = await response.blob();

    // Create file name from URI
    const fileName = file.uri.split('/').pop() || 'image.jpg';

    // Create a File object from the Blob
    const fileObject = {
      name: fileName,
      type: blob.type || 'image/jpeg',
      size: blob.size,
      uri: file.uri,
    };

    // Upload to Appwrite
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      fileObject
    );

    if (!uploadedFile || !uploadedFile.$id) {
      throw new Error('File upload failed');
    }

    // Get file view URL
    const fileUrl = storage.getFileView(config.storageId, uploadedFile.$id);

    return fileUrl.href;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Update the type to match your actual collection schema
type PostForm = {
  title: string;
  description: string;
  address: string;
  image: any;
  userId?: string;
};

interface PostDocument {
  title: string;
  description: string;
  address: string;
  image: string;
  userId: string; // Changed from user_id to userId
  email: string;
}

export const createPost = async (form: PostForm): Promise<any> => {
  try {
    if (!form.image) {
      throw new Error('No image provided for post');
    }

    // Upload the image first
    const imageUrl = await uploadFile(form.image);

    // Get the current user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Could not get user information');
    }

    // Create the post document
    const postData: PostDocument = {
      title: form.title,
      description: form.description,
      address: form.address,
      image: imageUrl,
      userId: currentUser.$id,
      email: currentUser.email,
    };

    const newPost = await databases.createDocument(
      config.databaseId,
      config.postCollectionId,
      ID.unique(),
      postData
    );

    return newPost;
  } catch (error: any) {
    console.error('Post creation error:', error);
    throw error;
  }
};
