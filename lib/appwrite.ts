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
  .setProject(config.projectId!)
  .setPlatform(config.platform!)
  .setEndpoint(config.endpoint!);

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

    const newUser = await databases.createDocument(
      config.userCollectionId,
      config.databaseId,
      ID.unique(),
      {
        accountID: newAccount.$id,
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
    const getCurrentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!getCurrentUser) throw new Error('Failed to get current user');
    return getCurrentUser.documents[0];
  } catch (error) {
    console.error(error, 'Failed to get current user');
    throw new Error(error as any);
  }
};
