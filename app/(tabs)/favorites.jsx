import { View, Text, Alert, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { favoritesStyles } from '../../assets/styles/favorites.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import RecipeCard from '../../components/RecipeCard';
import NoFavoritesFound from '../../components/NoFavoritesFound';
import LoadingSpinner from '../../components/LoadingSpinner';
import {API_URL} from "../../constants/api";

const Favorites = () => {
    const { signOut } = useClerk();
    const { user } = useUser();
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [loading, setLoading] = useState(true); // should start true

    useEffect(() => {
        const loadFavorites = async () => {
            try {

                const response = await fetch(`${API_URL}/favorites/${user.id}`);
                if (!response.ok) throw new Error('Failed to fetch favorites');

                const favorites = await response.json();


                const transformedFavorites = favorites.map((favorite) => ({
                    ...favorite,
                    id: favorite.recipeId,
                }));

                setFavoriteRecipes(transformedFavorites);
            } catch (err) {
                console.log(err, 'failed to load favorites');
                Alert.alert('Error', 'Failed to load favorites');
            } finally {
                setLoading(false);
            }
        };
        loadFavorites();
    }, [user.id]);

    if (loading) return <LoadingSpinner message="Loading your favorites..." />;

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: signOut },
        ]);
    };

    return (
        <View style={favoritesStyles.container}>
            <View style={favoritesStyles.header}>
                <Text style={favoritesStyles.title}>Favorites</Text>
                <TouchableOpacity
                    style={favoritesStyles.logoutButton}
                    onPress={handleSignOut}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={22}
                        color={COLORS.textLight}
                    />
                </TouchableOpacity>
            </View>
            <View style={favoritesStyles.recipesSection}>
                <FlatList
                    data={favoriteRecipes}
                    renderItem={({ item }) => <RecipeCard recipe={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={favoritesStyles.row}
                    contentContainerStyle={favoritesStyles.recipesGrid}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<NoFavoritesFound />}
                />
            </View>
        </View>
    );
};

export default Favorites;
