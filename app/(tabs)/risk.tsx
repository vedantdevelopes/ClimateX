import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { Heading } from '../../components/Heading';
import { Card } from '../../components/Card';
import { RiskCard } from '../../components/RiskCard';
import { OfflineBanner } from '../../components/OfflineBanner';
import { useUser } from '../../store/useUser';
import { useRisk } from '../../store/useRisk';
import { lightTheme, darkTheme, colors } from '../../theme/tokens';
import { searchCities, GeocodedCity } from '../../lib/openMeteo';

export default function RiskScreen() {
  const profile = useUser((s) => s.profile);
  const setLocation = useUser((s) => s.setLocation);
  const themeMode = profile.theme;
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const { data: riskData, isLoading, fetchRisk } = useRisk();

  // Location search modal
  const [modalVisible, setModalVisible] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  const onRefresh = async () => {
    await fetchRisk(profile.lat, profile.lon, profile.city, true);
  };

  const handleCitySearch = async (text: string) => {
    setCityQuery(text);
    if (text.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const cities = await searchCities(text);
    setSearchResults(cities);
    setIsSearching(false);
  };

  const handleSelectCity = async (name: string, lat: number, lon: number) => {
    setLocation(name, lat, lon);
    setModalVisible(false);
    await fetchRisk(lat, lon, name, true);
  };

  const handleGpsDetect = async () => {
    setIsGpsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission denied.');
        setIsGpsLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [address] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      const cityName = address?.city || address?.region || 'Current Location';
      await handleSelectCity(cityName, loc.coords.latitude, loc.coords.longitude);
    } catch (e) {
      console.warn('GPS detection failed:', e);
    } finally {
      setIsGpsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title="LOCAL RISK" subtitle={profile.city} />
      <OfflineBanner />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={theme.tint}
          />
        }
      >
        {/* Location Switcher Row */}
        <View style={styles.locationBar}>
          <View style={styles.locationInfo}>
            <Feather name="map-pin" size={14} color={theme.text} />
            <Text style={[styles.locationName, { color: theme.text }]} numberOfLines={1}>
              {profile.city}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.changeLocBtn, { borderColor: theme.cardBorder }]}
            onPress={() => setModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Change Location"
          >
            <Text style={[styles.changeLocText, { color: theme.text }]}>CHANGE</Text>
            <Feather name="chevron-down" size={14} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* 3 RISK CARDS */}
        {riskData ? (
          <>
            <RiskCard
              title="Heat Stress"
              hazardType="heat"
              data={riskData.heat}
            />
            <RiskCard
              title="Air Quality (AQI)"
              hazardType="aqi"
              data={riskData.aqi}
            />
            <RiskCard
              title="Flood & Inundation"
              hazardType="flood"
              data={riskData.flood}
            />

            {/* 3-DAY OUTLOOK ROW */}
            <View style={styles.outlookSection}>
              <Heading size="subheading" color={theme.text} style={styles.outlookTitle}>
                3-DAY CLIMATE OUTLOOK
              </Heading>

              <View style={styles.outlookRow}>
                {riskData.threeDayOutlook.map((day, idx) => {
                  let badgeColor = colors.ok;
                  if (day.level === 'Moderate') badgeColor = colors.warn;
                  if (day.level === 'High' || day.level === 'Severe') badgeColor = colors.danger;

                  return (
                    <Card key={idx} style={styles.outlookCard}>
                      <Text style={[styles.dayName, { color: theme.text }]}>
                        {day.dayName.toUpperCase()}
                      </Text>
                      <Text style={[styles.outlookScore, { color: badgeColor }]}>
                        {day.overallScore}
                      </Text>
                      <View style={[styles.miniLevelPill, { backgroundColor: badgeColor }]}>
                        <Text style={styles.miniLevelText}>{day.level.toUpperCase()}</Text>
                      </View>
                      <View style={[styles.outlookDivider, { backgroundColor: theme.rule }]} />
                      <Text style={[styles.outlookTemp, { color: theme.textMuted }]}>
                        {Math.round(day.apparentTempMax)}°C
                      </Text>
                      <Text style={[styles.outlookPrecip, { color: theme.textMuted }]}>
                        {Math.round(day.precipitationSum)} mm
                      </Text>
                    </Card>
                  );
                })}
              </View>
            </View>
          </>
        ) : (
          <ActivityIndicator size="large" color={theme.tint} style={{ marginTop: 40 }} />
        )}
      </ScrollView>

      {/* CHANGE LOCATION MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <SafeAreaView style={[styles.modalOverlay, { backgroundColor: theme.background }]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Heading size="medium" color={theme.text}>
                CHANGE LOCATION
              </Heading>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* GPS Button inside Modal */}
            <TouchableOpacity
              style={styles.modalGpsBtn}
              onPress={handleGpsDetect}
              disabled={isGpsLoading}
            >
              {isGpsLoading ? (
                <ActivityIndicator color={colors.blush} size="small" />
              ) : (
                <>
                  <Feather name="navigation" size={16} color={colors.blush} style={{ marginRight: 6 }} />
                  <Text style={styles.modalGpsText}>USE CURRENT GPS</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Search Input */}
            <View style={[styles.modalSearchBar, { borderColor: theme.cardBorder, backgroundColor: theme.cardBg }]}>
              <Feather name="search" size={16} color={theme.text} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.modalInput, { color: theme.text }]}
                placeholder="Search city, district, or campus..."
                placeholderTextColor={theme.textMuted}
                value={cityQuery}
                onChangeText={handleCitySearch}
                autoCorrect={false}
              />
              {isSearching ? <ActivityIndicator size="small" color={theme.text} /> : null}
            </View>

            <FlatList
              data={searchResults}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => {
                const displayName = `${item.name}, ${item.admin1 || item.country}`;
                return (
                  <TouchableOpacity
                    style={[styles.cityRow, { borderColor: theme.rule, backgroundColor: theme.cardBg }]}
                    onPress={() => handleSelectCity(displayName, item.latitude, item.longitude)}
                  >
                    <Feather name="map-pin" size={14} color={theme.text} />
                    <Text style={[styles.cityNameText, { color: theme.text }]}>
                      {displayName}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                cityQuery.length > 2 && !isSearching ? (
                  <Text style={[styles.emptySearchText, { color: theme.textMuted }]}>
                    No matching cities found on Open-Meteo.
                  </Text>
                ) : undefined
              }
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 96,
  },
  locationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  locationName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    marginLeft: 6,
  },
  changeLocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
  },
  changeLocText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
    marginRight: 4,
  },
  outlookSection: {
    marginTop: 14,
  },
  outlookTitle: {
    marginBottom: 8,
  },
  outlookRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  outlookCard: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  dayName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  outlookScore: {
    fontFamily: 'Anton_400Regular',
    fontSize: 22,
    lineHeight: 26,
  },
  miniLevelPill: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    marginTop: 2,
    marginBottom: 6,
  },
  miniLevelText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  outlookDivider: {
    width: '60%',
    height: 1,
    marginBottom: 6,
  },
  outlookTemp: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  outlookPrecip: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalGpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.maroon,
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  modalGpsText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 14,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  modalSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 14,
  },
  modalInput: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
  },
  cityNameText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    marginLeft: 8,
  },
  emptySearchText: {
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 20,
  },
});
