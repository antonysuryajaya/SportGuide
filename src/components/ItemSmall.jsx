import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { ReceiptText, Clock, MessageCircle } from "lucide-react-native";
import { colors } from "../../assets/theme";
import { useNavigation } from "@react-navigation/native";
import { formatDate } from "../utils/formatDate";

const ItemSmall = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("BlogDetail", { blogId: item.id })}
      style={styles.cardItem}
    >
      <Image
        style={styles.cardImage}
        source={{
          uri: item.image,
        }}
        contentFit="cover"
        priority="high"
        cachePolicy="memory-disk"
        transition={200}
      />
      <View style={styles.cardContent}>
        <View
          style={{
            flexDirection: "row",
            gap: 30,
          }}
        >
          <View style={{ gap: 5, flex: 1 }}>
            <Text style={styles.cardCategory}>
              {typeof item.category === "object"
                ? item.category.name
                : item.category}
            </Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
          <ReceiptText color={colors.orange(0.6)} variant="Linear" size={20} />
        </View>
        <View style={styles.cardInfo}>
          <Clock size={10} variant="Linear" color={colors.orange(0.6)} />
          <Text style={styles.cardText}>{formatDate(item?.createdAt)}</Text>
          <MessageCircle size={10} variant="Linear" color={colors.orange(0.6)} />
          <Text style={styles.cardText}>{item.totalComments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemSmall;

const styles = StyleSheet.create({
  listCard: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    gap: 15,
  },
  cardItem: {
    backgroundColor: colors.blue(0.03),
    flexDirection: "row",
    borderRadius: 10,
    marginHorizontal: 24,
    marginVertical: 5,
  },
  cardCategory: {
    color: colors.blue(),
    fontSize: 10,
    fontFamily: "Pjs-SemiBold",
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Pjs-Bold",
    color: colors.black(),
  },
  cardText: {
    fontSize: 10,
    fontFamily: "Pjs-Medium",
    color: colors.orange(0.6),
  },
  cardImage: {
    width: 94,
    height: 94,
    borderRadius: 10,
  },
  cardInfo: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  cardContent: {
    gap: 10,
    justifyContent: "space-between",
    paddingRight: 10,
    paddingLeft: 15,
    flex: 1,
    paddingVertical: 10,
  },
});
