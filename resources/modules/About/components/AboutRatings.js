import React from "react";
import { Image, View, Text } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";

import flex from "@styles/flex.styles";
import textStyles from "@styles/textStyles.styles";
import palette from "@styles/palette.styles";
import StarRating from "react-native-star-rating";

const AboutRatings = ({ merchant }) => {
  return merchant ? (
    <View style={{ marginTop: 10 }}>
      {merchant?.reviews?.map((review, index) => (
        <View style={[styles.ratingCard]} key={`ratingcard${index}`}>
          <View
            style={[flex.direction.row, flex.align.end, flex.justify.between]}
          >
            <Text style={[textStyles.size.sm, textStyles.weight.regular]}>
              {review?.user_name}
            </Text>
            <View style={flex.direction.row}>
              <StarRating
                disabled={false}
                maxStars={5}
                halfStarEnabled={true}
                starSize={12}
                emptyStarColor={palette.yellow}
                fullStarColor={palette.yellow}
                rating={Number(review?.rating)}
              />
            </View>
          </View>
          <Text
            style={[
              textStyles.size.sm,
              textStyles.color.darkGray,
              { marginTop: 10 },
            ]}
          >
            {review?.comment}
          </Text>
        </View>
      ))}
    </View>
  ) : (
    <></>
  );
};

const styles = {
  ratingCard: {
    paddingVertical: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
};

export { AboutRatings };
