import {
    View,
    Text,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Image,
    Platform,
    TextInput,
    TouchableOpacity
} from 'react-native'
import React, {useState} from 'react'
import {useSignUp} from "@clerk/clerk-expo";
import {authStyles} from "../../assets/styles/auth.styles";
import {COLORS} from "../../constants/colors";

const VerifyEmail = ({emailAddress, onBack}) => {

    const { isLoaded, signUp, setActive } = useSignUp()
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState('')

    const handleVerification = async () => {
        if(!isLoaded) return
        setLoading(true)

        try{
            const signUpAttempt = await signUp.attemptEmailAddressVerification({code})

            if(signUpAttempt.status === 'complete'){
                await setActive({session: signUpAttempt.createdSessionId})
            }else{
                Alert.alert("Error", "Verification failed")
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        }catch (err) {
                Alert.alert("Error", err.errors?.[0]?.message || "Verification failed")
            console.error(JSON.stringify(err, null, 2))
        }finally {
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
                        source={require("../../assets/images/i3.png")}
                        resizeMode="contain"
                        style={authStyles.image}
                        />
                        </View>
                        <Text style={authStyles.title}>Verify Your Email</Text>
                        <Text style={authStyles.subtitle}>We&apos;ve sent a verification code to {emailAddress}</Text>

                        <View style={authStyles.formContainer}>
                            <View style={authStyles.inputContainer}>
                                <TextInput
                                    placeholder="Enter verification code"
                                    placeholderTextColor={COLORS.textLight}
                                    style={authStyles.textInput}
                                    value={code}
                                    keyboardType="number-pad"
                                    onChangeText={(code) => setCode(code)}
                                />
                            </View>
                            <TouchableOpacity
                                style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                                onPress={handleVerification}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <Text style={authStyles.buttonText}>
                                    {loading ? "Verifying..." : "Verify"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={authStyles.linkContainer}
                                onPress={onBack}>
                                <Text style={authStyles.linkText}>
                                    <Text style={authStyles.link}>Back to Sign Up</Text>
                                </Text>
                            </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}
export default VerifyEmail
