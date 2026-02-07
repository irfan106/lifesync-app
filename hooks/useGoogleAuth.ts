import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@services/firebaseConfig';

// Ensure WebBrowser is dismissed properly on redirect
WebBrowser.maybeCompleteAuthSession();

// You need to get these from Google Cloud Console
// 1. Go to https://console.cloud.google.com/apis/credentials
// 2. Create OAuth 2.0 Client IDs for Android, iOS, and Web
// For Expo Go, use the Web client ID

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    // For Expo Go development, you only need the webClientId
    // For production builds, add androidClientId and iosClientId
    webClientId: '557833679414-XXXX.apps.googleusercontent.com', // Get this from Firebase Console > Authentication > Sign-in method > Google > Web SDK Configuration
    // androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    // iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  return {
    request,
    promptAsync,
    isLoading: !request,
  };
}
