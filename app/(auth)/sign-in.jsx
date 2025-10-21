import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import React, {useState} from 'react'
import {authStyles} from "../../assets/styles/auth.styles";
import {COLORS} from "../../constants/colors";
import {Ionicons} from "@expo/vector-icons";

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const[showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    // Handle the submission of the sign-in form
    const handleSignIn = async () => {
        if(!emailAddress || !password){
            Alert.alert("Error", "Please fill in all fields")
            return;
        }


        if (!isLoaded) return

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                Alert.alert("Error", "Sign in failed")
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            Alert.alert("Error", err.errors?.[0]?.message || "Sign in failed")
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={authStyles.container}>
           <KeyboardAvoidingView
               style={authStyles.keyboardView}
               behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 50}
           >

               <ScrollView
               contentContainerStyle={authStyles.scrollContent}
               showsVerticalScrollIndicator={false}
               >
                   <View style={authStyles.imageContainer}>
                   <Image
                   source={require("../../assets/images/i1.png")}
                   resizeMode="contain"
                   style={authStyles.image}
                   />
                   </View>
                   {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                   <Text style={authStyles.title}>Welcome Back</Text>
                   {/* Form */}
                   <View style={authStyles.formContainer}>
                       <View style={authStyles.inputContainer}>
                       <TextInput
                       placeholder="Email"
                       placeholderTextColor={COLORS.textLight}
                       style={authStyles.textInput}
                       value={emailAddress}
                       keyboardType="email-address"
                       autoCapitalize="none"
                       onChangeText={(email) => setEmailAddress(email)}
                       />
                       </View>

                       <View style={authStyles.inputContainer}>
                       <TextInput
                       placeholder="Password"
                       placeholderTextColor={COLORS.textLight}
                       style={authStyles.textInput}
                       value={password}
                       secureTextEntry={!showPassword}
                       autoCapitalize={"none"}
                       onChangeText={(password) => setPassword(password)}
                       />
                           <TouchableOpacity
                               onPress={() => setShowPassword(!showPassword)}
                               style={authStyles.eyeButton}>
                               <Ionicons
                                   name={!showPassword ? "eye-off-outline" : "eye-outline"}
                                   size={20}
                                   color={COLORS.textLight} />
                           </TouchableOpacity>
                       </View>
                       <TouchableOpacity
                           style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                           onPress={handleSignIn}
                           disabled={loading}
                            activeOpacity={0.8}
                       >
                           <Text
                               style={authStyles.buttonText}>
                               {loading ? "Signing in..." : "Sign In"}
                           </Text>
                       </TouchableOpacity>

                       <TouchableOpacity
                           style={authStyles.linkContainer}
                           onPress={() => router.push("/(auth)/sign-up")}
                       >
                           <Text
                               style={authStyles.linkText}
                           >
                               Don&apos;t have an account?
                               <Text> </Text>
                               <Text
                                   style={authStyles.link}
                               >
                                    Sign up
                               </Text>
                           </Text>
                       </TouchableOpacity>
                   </View>

               </ScrollView>

           </KeyboardAvoidingView>
        </View>
    )
}