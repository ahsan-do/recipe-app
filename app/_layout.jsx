import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from 'expo-router'
import SafeView from "../components/SafeView";


export default function RootLayout() {
    return (
        <ClerkProvider tokenCache={tokenCache}>
            <SafeView >
                <Slot />
            </SafeView>

        </ClerkProvider>
    )
}