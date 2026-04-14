import Profile from "./src/screens/Profile.jsx";
import { fontType } from "./assets/theme";
import { useFonts } from "expo-font";
export default function App() {
  const [loaded] = useFonts(fontType);
  if (!loaded) {
    return null;
  }
  return <Profile />;
}
