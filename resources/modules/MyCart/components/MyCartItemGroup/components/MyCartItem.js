import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Image } from "@components/elements";
import { Price } from "@components/common";
import palette from "../../../../../styles/palette.styles";
import { flex, textStyles as text } from "@styles/";
import Swipeout from "react-native-swipeout";
import { removeCart } from "../../../../../slices/cartSlice";
import { useDispatch } from "react-redux";

const MyCartItem = ({ item, selectedItems, removeItem }) => {
  const dispatch = useDispatch();
  const [isSelected, setIsSelected] = useState(false);
  const [itemId, setItemId] = useState(item.food_id);

  const _removeItem = async () => {
    try {
      dispatch(removeCart({ id: itemId }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    selectedItems?.product.map((items) => {
      if (items.id === item.id) {
        setIsSelected(true);
      } else {
        setIsSelected(false);
      }
    });
  }, [selectedItems]);

  var swipeoutBtns = [
    {
      text: "Delete",
      type: "delete",
      onPress: () => {
        _removeItem();
        removeItem(item.id);
      },
    },
  ];
  return (
    <View>
      <Swipeout
        autoClose={true}
        right={swipeoutBtns}
        style={{ backgroundColor: palette.Gray }}
      >
        <View style={[styles.wrapper, flex.direction.row]}>
          <View style={{ marginTop: 5, marginLeft: 30 }}>
            {/* <CheckBox
              offset={20}
              initialValue={selected}
              onChange={() => toggleSelected(item)}
            /> */}
          </View>
          <View style={[flex.align.center, flex.direction.row]}>
            <Image
              imgProps={{
                resizeMode: "cover",
                source: { uri: `${item?.food_image[0]}`, cache: "force-cache" },
                style: styles.image,
              }}
              containerStyle={{ paddingVertical: 20 }}
            />
            <View style={{ padding: 20 }}>
              <Text
                style={[text.weight.regular, { color: "#000", fontSize: 15 }]}
              >
                {item.food_name.length > 20
                  ? item.food_name.substring(0, 22) + "..."
                  : item.food_name}
              </Text>

              <Text
                style={[text.weight.regular, { marginTop: 0, fontSize: 13 }]}
              >
                {`Qty: ${item?.quantity} ${
                  item?.variation_name
                    ? `x (${item?.variation_name}${
                        item?.addOns_name && ` + ${item?.addOns_name}`
                      })`
                    : ""
                }`}
              </Text>
              <Price
                style={[
                  text.weight.regular,
                  { marginTop: 0, color: "#000", fontSize: 15 },
                ]}
                value={`${item.food_total}`}
              />
            </View>
          </View>
        </View>
      </Swipeout>

      {/* <View style={styles.ItemBottomCupenCode}>
        <View style={styles.AppliedContent}>
          <Text style={[text.size.md, { color: palette.black }]}>
            <Ticket style={{ color: "#FEA200" }} size={15} name="ticket" />
            5% off applied
          </Text>
          <Text style={{ color: "#FEA200" }}>
            Code FIVEOFF <Icon size={18} name="angle-right" />{" "}
          </Text>
        </View>
      </View> */}
    </View>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#fff",
    marginBottom: 0,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  ItemBottomCupenCode: {
    backgroundColor: palette.white,
    padding: 15,
  },
  AppliedContent: {
    backgroundColor: "#FDF0D6",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
};
export { MyCartItem };
