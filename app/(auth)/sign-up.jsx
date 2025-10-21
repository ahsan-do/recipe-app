import React, {useState} from 'react'
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
import { useSignUp } from '@clerk/clerk-expo'
import {  useRouter } from 'expo-router'
import {authStyles} from "../../assets/styles/auth.styles";
import {COLORS} from "../../constants/colors";
import {Ionicons} from "@expo/vector-icons";
import VerifyEmail from "./verify-email";

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [pendingVerification, setPendingVerification] = useState(false)
    const [loading, setLoading] = useState(false)


    const handleSignUp = async () => {
        if (!emailAddress || !password) {
            return Alert.alert("Error", "Please fill in all fields")
        }
        setLoading(true)
        if (!isLoaded) return

        try {
            await signUp.create({
                emailAddress: emailAddress,
                password,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            setPendingVerification(true)
        } catch (err) {
            Alert.alert("Error", err.errors?.[0]?.message || "Failed to create account")
            console.error(JSON.stringify(err, null, 2))
        }finally {
            setLoading(false)
        }
    }

    if(pendingVerification) return <VerifyEmail emailAddress={emailAddress} onBack={() => setPendingVerification(false)}/>

    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                style={authStyles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 50}
            >
                <ScrollView
                    contentContainerStyle={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    <View style={authStyles.imageContainer}>
                        <Image
                        source={require("../../assets/images/i2.png")}
                        resizeMode="contain"
                        style={authStyles.image}
                        />
                    </View>
                    {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                    <Text style={authStyles.title}>Create an account</Text>
                    /* Form */
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
                            onPress={handleSignUp}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={authStyles.buttonText}>
                                {loading ? "Creating an account..." : "Sign Up"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={authStyles.linkContainer}
                            onPress={() => router.push("/(auth)/sign-in")}
                        >
                            <Text
                                style={authStyles.linkText}
                            >
                                Already have an account?
                                <Text
                                    style={authStyles.link}
                                ><Text> </Text>
                                    Sign in
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}