import React, { useState } from "react";
import { View } from "react-native";
import LoadingScreen from "./Screens/LoadingScreen";
import ARScene from "./Screens/ARScene";

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {!isLoaded ? (
        <LoadingScreen onFinishLoading={() => setIsLoaded(true)} />
      ) : (
        <ARScene />
      )}
    </View>
  );
};

export default App;
