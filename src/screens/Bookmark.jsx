import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Plus } from "lucide-react-native";
import { BlogList } from "../data/blogs";
import ItemBookmark from "../components/ItemBookmark";
import { colors } from "../../assets/theme";

const Bookmark = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Bookmarks</Text>
        <Plus color={colors.black()} size={24} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, gap: 10, paddingVertical: 10 }}>
          {BlogList.map((item, index) => (
            <ItemBookmark item={item} key={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Bookmark;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green(),
  },
  header: {
    paddingHorizontal: 24,
    gap: 30,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    elevation: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: "Pjs-ExtraBold",
    color: colors.black(),
    letterSpacing: -0.3,
  },
});
