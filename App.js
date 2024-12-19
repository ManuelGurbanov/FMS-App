import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";
import { BannerAd, BannerAdSize, TestIds } from 'expo-ads-admob';

const App = () => {
    const [competitor1, setCompetitor1] = useState("MC 1");
    const [competitor2, setCompetitor2] = useState("MC 2");
    const [scores, setScores] = useState({
        competitor1: { random: 0, ida: 0, vuelta: 0, acapella: 0, deluxe: 0 },
        competitor2: { random: 0, ida: 0, vuelta: 0, acapella: 0, deluxe: 0 },
    });
    const [battles, setBattles] = useState([]); // Lista de batallas guardadas
    const [viewingBattles, setViewingBattles] = useState(false); // Modo de visualización de batallas

    const handleScoreChange = (competitor, round, value) => {
        const numericValue = parseFloat(value) || 0;
        setScores((prevScores) => ({
            ...prevScores,
            [competitor]: {
                ...prevScores[competitor],
                [round]: numericValue,
            },
        }));
    };

    const calculateTotal = (competitor) => {
        const competitorScores = scores[competitor];
        const total = Object.values(competitorScores).reduce(
            (sum, score) => sum + (parseFloat(score) || 0),
            0
        );
        return total.toFixed(2);
    };

    const saveBattle = () => {
        const newBattle = {
            id: Date.now(),
            competitor1,
            competitor2,
            scores: { ...scores },
        };
        setBattles((prevBattles) => [...prevBattles, newBattle]);
        alert("Batalla guardada exitosamente.");
    };

    const loadBattle = (battle) => {
        setCompetitor1(battle.competitor1);
        setCompetitor2(battle.competitor2);
        setScores(battle.scores);
        setViewingBattles(false); // Regresar a la pantalla principal
    };

    const deleteBattle = (id) => {
        Alert.alert(
            "¿Estás seguro?",
            "¿Quieres eliminar esta batalla?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setBattles((prevBattles) => prevBattles.filter((battle) => battle.id !== id));
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true }
        );
    };

    const renderBattleItem = ({ item }) => (
        <View style={styles.battleItem}>
            <TouchableOpacity onPress={() => loadBattle(item)}>
                <Text style={styles.battleText}>
                    {item.competitor1} vs {item.competitor2}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteBattle(item.id)}
            >
                <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );

    if (viewingBattles) {
        // Pantalla de visualización de batallas guardadas
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Batallas Guardadas</Text>
                {battles.length === 0 ? (
                    <Text style={styles.noBattlesText}>No hay batallas guardadas.</Text>
                ) : (
                    <FlatList
                        data={battles}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderBattleItem}
                    />
                )}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setViewingBattles(false)}
                >
                    <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>

                {/* Banner de AdMob */}
                <BannerAd
                    unitId={TestIds.BANNER}  // Usa el ID de prueba de AdMob
                    size={BannerAdSize.FULL_BANNER}
                    requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                    onAdFailedToLoad={(error) => console.log(error)}
                />
            </View>
        );
    }

    // Pantalla principal
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TextInput
                    style={styles.input}
                    placeholder="Competidor 1"
                    placeholderTextColor="#fff"
                    value={competitor1}
                    onChangeText={setCompetitor1}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Competidor 2"
                    placeholderTextColor="#fff"
                    value={competitor2}
                    onChangeText={setCompetitor2}
                />
            </View>

            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={styles.cell}>Ronda</Text>
                    <Text style={styles.cell}>{competitor1}</Text>
                    <Text style={styles.cell}>{competitor2}</Text>
                </View>
                {["random", "ida", "vuelta", "acapella", "deluxe"].map((round) => (
                    <View style={styles.row} key={round}>
                        <Text style={styles.cell}>{round.toUpperCase()}</Text>
                        <TextInput
                            style={styles.scoreInput}
                            keyboardType="numeric"
                            value={scores.competitor1[round].toString()}
                            onChangeText={(value) =>
                                handleScoreChange("competitor1", round, value)
                            }
                        />
                        <TextInput
                            style={styles.scoreInput}
                            keyboardType="numeric"
                            value={scores.competitor2[round].toString()}
                            onChangeText={(value) =>
                                handleScoreChange("competitor2", round, value)
                            }
                        />
                    </View>
                ))}
                <View style={styles.row}>
                    <Text style={styles.cell}>TOTAL</Text>
                    <Text style={styles.cell}>{calculateTotal("competitor1")}</Text>
                    <Text style={styles.cell}>{calculateTotal("competitor2")}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={saveBattle}>
                <Text style={styles.buttonText}>Guardar Batalla</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: "#4CAF50" }]}
                onPress={() => setViewingBattles(true)}
            >
                <Text style={styles.buttonText}>Ver Batallas Anteriores</Text>
            </TouchableOpacity>

            {/* Banner de AdMob */}
            <BannerAd
                unitId={TestIds.BANNER}  // Usa el ID de prueba de AdMob
                size={BannerAdSize.FULL_BANNER}
                requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                onAdFailedToLoad={(error) => console.log(error)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centrado vertical
        alignItems: 'center',     // Centrado horizontal
        padding: 20,
        backgroundColor: "#1C163B",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        marginTop: 30,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 12,
        marginHorizontal: 10,
        color: "#fff", // Asegura que el texto sea blanco en los inputs
    },
    table: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        overflow: "hidden",
        marginTop: 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    cell: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        width: "30%", // Ajuste de ancho
        textAlign: "center",
    },
    scoreInput: {
        backgroundColor: "#333",
        color: "#fff",
        width: "30%",
        padding: 8,
        textAlign: "center",
        borderRadius: 5,
    },
    button: {
        backgroundColor: "#FF5722",
        paddingVertical: 12,
        paddingHorizontal: 30,
        marginTop: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    battleItem: {
        marginBottom: 15,
        backgroundColor: "#2c2c2c",
        padding: 10,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    battleText: {
        color: "#fff",
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: "#d32f2f",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    noBattlesText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
    },
});

export default App;
