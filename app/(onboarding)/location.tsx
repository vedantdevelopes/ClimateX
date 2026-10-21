import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/tokens';
import { Heading } from '../../components/Heading';
import { useUser } from '../../store/useUser';
import { useRisk } from '../../store/useRisk';
import { searchCities, GeocodedCity } from '../../lib/openMeteo';

const POPULAR_CITIES = [
  { name: 'Hyderabad, India', lat: 17.385, lon: 78.4867 },
  { name: 'New Delhi, India', lat: 28.6139, lon: 77.209 },
  { name: 'Bengaluru, India', lat: 12.9716, lon: 77.5946 },
  { name: 'Mumbai, India', lat: 19.076, lon: 72.8777 },
  { name: 'Chennai, India', lat: 13.0827, lon: 80.2707 },
  { name: 'Kolkata, India', lat: 22.5726, lon: 88.3639 },
];

export default function LocationScreen() {
  const router = useRouter();
  const setLocation = useUser((s) => s.setLocation);
  const fetchRisk = useRisk((s) => s.fetchRisk);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodedCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  const handleSelectLocation = async (name: string, lat: number, lon: number) => {
    setLocation(name, lat, lon);
    fetchRisk(lat, lon, name, true).catch(() => {});
    router.push('/(onboarding)/lifestyle');
  };

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    const cities = await searchCities(text);
    setResults(cities);
    setIsSearching(false);
  };

  const handleUseGps = async () => {
    setIsGpsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission denied. Please select your city from the list below.');
        setIsGpsLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [address] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const cityName = address?.city || address?.region || 'Current Location';
      await handleSelectLocation(cityName, loc.coords.latitude, loc.coords.longitude);
    } catch (err) {
      console.warn('[Location] GPS failed:', err);
      // Fallback
      await handleSelectLocation('Hyderabad, India', 17.385, 78.4867);
    } finally {
      setIsGpsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>STEP 01</Text>
          </View>
          <Heading size="medium" color={colors.maroon} style={styles.title}>
            WHERE ARE YOU?
          </Heading>
          <Text style={styles.subtitle}>
            Climate risk varies drastically by neighbourhood and city.
          </Text>
          <View style={styles.rule} />
        </View>

        {/* GPS Button */}
        <TouchableOpacity
          style={styles.gpsButton}
          onPress={handleUseGps}
          disabled={isGpsLoading}
          accessibilityRole="button"
          accessibilityLabel="Detect location automatically via GPS"
        >
          {isGpsLoading ? (
            <ActivityIndicator color={colors.blush} size="small" />
          ) : (
            <>
              <Feather name="navigation" size={18} color={colors.blush} style={styles.gpsIcon} />
              <Text style={styles.gpsText}>USE CURRENT LOCATION</Text>
            </>
          )}
        </TouchableOpacity>

        {/* City Search Bar */}
        <View style={styles.searchBar}>
          <Feather name="search" size={16} color={colors.maroon} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search your city or campus..."
            placeholderTextColor="rgba(107, 0, 16, 0.4)"
            value={query}
            onChangeText={handleSearch}
            autoCorrect={false}
          />
          {isSearching ? <ActivityIndicator size="small" color={colors.maroon} /> : null}
        </View>

        {/* Search Results or Popular Cities */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionHeading}>
            {results.length > 0 ? 'SEARCH RESULTS' : 'POPULAR HUBS'}
          </Text>

          {results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => {
                const displayName = `${item.name}, ${item.admin1 || item.country}`;
                return (
                  <TouchableOpacity
                    style={styles.cityItem}
                    onPress={() => handleSelectLocation(displayName, item.latitude, item.longitude)}
                  >
                    <Feather name="map-pin" size={14} color={colors.maroon} />
                    <Text style={styles.cityName}>{displayName}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <FlatList
              data={POPULAR_CITIES}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cityItem}
                  onPress={() => handleSelectLocation(item.name, item.lat, item.lon)}
                >
                  <Feather name="map-pin" size={14} color={colors.maroon} />
                  <Text style={styles.cityName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.blush,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
  },
  pillText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.maroon,
    lineHeight: 18,
    opacity: 0.8,
  },
  rule: {
    height: 1,
    backgroundColor: colors.rule,
    width: '100%',
    marginTop: 12,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.maroon,
    paddingVertical: 14,
    borderRadius: 4,
    marginVertical: 12,
  },
  gpsIcon: {
    marginRight: 8,
  },
  gpsText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 15,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.maroon,
    backgroundColor: colors.blushSoft,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.maroon,
  },
  listContainer: {
    flex: 1,
  },
  sectionHeading: {
    fontFamily: 'Anton_400Regular',
    fontSize: 14,
    color: colors.maroon,
    letterSpacing: 0.5,
    marginBottom: 8,
    opacity: 0.8,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(107, 0, 16, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: colors.blushSoft,
  },
  cityName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.maroon,
    marginLeft: 10,
  },
});
