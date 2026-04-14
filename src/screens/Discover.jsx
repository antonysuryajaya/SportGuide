import { StyleSheet, Text, View, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlogList } from "../data/blogs";
import ItemSmall from "../components/ItemSmall";
import { Search } from "lucide-react-native";
import { colors } from "../../assets/theme";

const data = [
  { id: 1, label: "guide" },
  { id: 2, label: "beginner" },
  { id: 3, label: "food" },
  { id: 4, label: "lifestyle" },
  { id: 5, label: "step" },
];

const ItemRecent = ({ item }) => {
  return (
    <View style={recent.button}>
      <Text style={recent.label}>{item.label}</Text>
    </View>
  );
};
const FlatListRecent = () => {
  const renderItem = ({ item }) => {
    return <ItemRecent item={item} />;
  };
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={(item) => renderItem({ ...item })}
      ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 10 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

const Discover = () => {
  const recentBlog = BlogList.slice(5);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.bar}>
            <Search size={18} color={colors.orange(0.5)} />
            <Text style={styles.placeholder}>Search</Text>
          </View>
        </View>
        <View>
          <Text style={recent.text}>Recent Search</Text>
          <FlatListRecent />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.listCard}>
            {recentBlog.map((item, index) => (
              <ItemSmall item={item} key={index} />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Discover;

const styles = StyleSheet.create({
  listCard: {
    paddingBottom: 10,
    gap: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.green(),
  },
  header: {
    paddingHorizontal: 24,
    gap: 30,
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    elevation: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  bar: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
    alignItems: "center",
    backgroundColor: colors.orange(0.05),
    borderRadius: 10,
    flex: 1,
  },
  placeholder: {
    fontSize: 14,
    fontFamily: "Pjs-Medium",
    color: colors.orange(0.5),
    lineHeight: 18,
  },
});

const recent = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderColor: colors.orange(0.15),
    borderWidth: 1,
    backgroundColor: colors.orange(0.03),
  },
  label: {
    fontSize: 12,
    fontFamily: "Pjs-Medium",
    color: colors.orange(0.65),
  },
  text: {
    fontSize: 14,
    fontFamily: "Pjs-Bold",
    color: colors.black(),
    paddingVertical: 5,
    paddingHorizontal: 24,
  },
});
