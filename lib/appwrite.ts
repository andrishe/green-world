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
