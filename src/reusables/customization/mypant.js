/* eslint-disable react-native/no-inline-styles */
import React, { useMemo } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FASTENINGS, PANTS, RAISES } from "../../pages/App/home/DesginByMyself/customization/constant";

function MyPant({ config, selectedIndex }) {

  const preview = useMemo(() => {
    let img = null;
    if (selectedIndex === 1) {
      img = config?.rise ? RAISES.find(a => a.name === config?.rise).icon : RAISES[0].icon
    } else {
      img = config?.pant ? PANTS.find(a => a.name === config.pant).icon : null
    }
    return <Image source={img || PANTS[0].icon} style={[styles.pant, {
      height: selectedIndex === 1 ? 150 : 250
    }]} />;
  }, [config, selectedIndex])

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.selectedPant,
          styles.text,
          { opacity: config.pant ? 1 : 0 },
        ]}
      >
        {config.pant}
      </Text>
      <Text
        style={[
          styles.selectedRise,
          styles.text,
          { opacity: config.rise ? 1 : 0 },
        ]}
      >
        {config.rise} Rise {config.waist && `- ${config.waist} Waist`}
      </Text>
      {
        selectedIndex !== 1 && <View style={[styles.fastening, { opacity: config.fastening ? 1 : 0 }]}>
          <View style={styles.circle}>
            {config?.fastening && <Image source={FASTENINGS.find(a => a.name === config.fastening).icon} alt="fastening" style={styles.hook} />}
          </View>
          <Text style={styles.selectedFastening}>{config.fastening}</Text>
        </View>
      }
      {preview}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 250,
    alignItems: "center",
    paddingTop: 50,
  },
  pant: {
    height: 250,
    resizeMode: "contain",
  },
  text: {
    fontSize: 12,
    textTransform: "capitalize",
    color: "#fff",
    position: "absolute",
    zIndex: 2,
  },
  selectedPant: {
    bottom: 10,
  },
  selectedRise: {
    top: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    // width: 100,
    textAlign: "center",
    paddingBottom: 5,
  },
  fastening: {
    position: "absolute",
    top: 50,
    zIndex: 2,
    left: 110,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hook: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  selectedFastening: {
    fontSize: 12,
    textTransform: "capitalize",
    color: "#fff",
    textAlign: "center",
  },
});

export default MyPant;
