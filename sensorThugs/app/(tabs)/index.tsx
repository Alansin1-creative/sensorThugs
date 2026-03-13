import { Video } from "expo-av";
import { BlurView } from "expo-blur";
import { Accelerometer } from "expo-sensors";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Index() {
  const [desbloqueado, setDesbloqueado] = useState(false);

  const [mensaje, setMensaje] = useState("Agita el celular para desbloquear");

  const video = useRef(null);

  // enviar evento a mongo
  const enviarEvento = async () => {
    if (!API_URL) {
      console.log("EXPO_PUBLIC_API_URL no está definida");
      return;
    }

    try {
      await fetch(`${API_URL}/evento`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          evento: "THUG_MODE",
        }),
      });
    } catch (error) {
      console.log("Error enviando", error);
    }
  };

  // sensor acelerómetro
  useEffect(() => {
    const subscription = Accelerometer.addListener((data) => {
      const total = Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);

      if (total > 2.5) {
        setMensaje("¡Somos Thugs! ¡Thuuuuugs!");

        setDesbloqueado(true);

        enviarEvento();
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      {/* MENSAJE */}
      <Text style={styles.text}>{mensaje}</Text>

      {/* VIDEO */}
      <View style={styles.videoBox}>
        <Video
          ref={video}
          style={styles.video}
          source={require("../../assets/thugs.mp4")}
          shouldPlay={desbloqueado}
          isLooping
        />

        {!desbloqueado && (
          <View style={styles.blurContainer}>
            <BlurView intensity={100} style={styles.blur} />

            <View style={styles.darkOverlay} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },

  videoBox: {
    width: 300,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },

  video: {
    width: 300,
    height: 200,
  },

  blurContainer: {
    position: "absolute",
    width: 300,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },

  blur: {
    width: 300,
    height: 200,
  },

  darkOverlay: {
    position: "absolute",
    width: 300,
    height: 200,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
