import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";

import { ActivityCard, ActivityRateCard } from "./components";

import palette from "@styles/palette.styles";
import textStyles from "@styles/textStyles.styles";
import flex from "@styles/flex.styles";
import { connect, useSelector, useDispatch } from "react-redux";
import { getActiveFieldData, cancelOrderFromPending } from "../../../../http";
import { setActivitiData } from "../../../../slices/activitySlice";
import { LoadingOverlay, MessagePopup } from "../../../../components/common";
import { useNavigation } from "@react-navigation/native";
import CanclePopup from "../../../../components/common/CanclePopup";
import CancelDelivery from "../../../../components/common/CancelDelivery";

const Activities = ({ past }) => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const _statuscount = useSelector((state) => state?.activity?.activityStatus);
  const activityData = useSelector((state) => state?.activity?.activityData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nextValue, setNextValue] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState();

  const statuscount = past ? "completed" : _statuscount.nameOfBody;
  const navigation = useNavigation();

  const fetchData = async () => {
    let formData = {};
    formData["status"] = statuscount;
    LoadingOverlay.show("Fetching data...");
    await getActiveFieldData(formData)
      .then((res) => {
        setData(res?.data);
        dispatch(setActivitiData(res?.data));
        LoadingOverlay.hide();
      })
      .catch((e) => {
        LoadingOverlay.hide();
        throw e;
      });
  };

  useEffect(() => {
    const unsubscribeTab = navigation.addListener("tabPress", (e) => {
      LoadingOverlay.show("Fetching...");
      fetchData();
    });
    fetchData();
    return unsubscribeTab;
  }, [statuscount]);

  const removeItemFrom = (id) => {
    let list = data?.data?.filter((item) => item.id !== id);
    setData({ data: list });
  };

  const handleDeleteData = async (id) => {
    console.log("ID", id);
    setDeleteOrderId(id);
    id && setIsModalVisible(true);
  };

  return (
    <View style={[{ marginTop: past ? 0 : 30 }]}>
      {past ? (
        <></>
      ) : (
        <View style={[flex.direction.row, flex.align.center]}>
          <Text style={[textStyles.size.md, textStyles.weight.md]}>
            {_statuscount.name}
          </Text>
          {data?.data?.length > 0 ? (
            <Text
              style={[textStyles.size.md, textStyles.weight.md, styles.count]}
            >
              {data?.data?.length}
            </Text>
          ) : (
            <Text style={[textStyles.size.md, textStyles.weight.md]}></Text>
          )}
        </View>
      )}
      {data?.data && data?.data?.length > 0 ? (
        statuscount == "delivered" || statuscount == "completed" ? (
          <>
            {data?.data?.map((data, index) => (
              <ActivityRateCard
                key={`activity_${index}_`}
                data={data}
                index={index}
                past={past}
                handleRattingId={(id) => {
                  removeItemFrom(id);
                }}
              />
            ))}
          </>
        ) : (
          <>
            {data?.data?.map((data, index) => (
              <ActivityCard
                key={`activity_${index}`}
                data={data}
                handleDeleteData={(id) => handleDeleteData(id)}
                statuscount={statuscount}
              />
            ))}
          </>
        )
      ) : (
        <View
          style={{
            height: "100%",
            width: "100%",
            paddingTop: 180,
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Text style={{ height: "100%" }}>No Data Found!</Text>
        </View>
      )}

      {isModalVisible == true ? (
        <CanclePopup
          isModalVisible={true}
          handleModalTogle={(v) => setIsModalVisible(v)}
          callNext={(value) => setNextValue(value)}
        />
      ) : (
        <></>
      )}

      {nextValue ? (
        <CancelDelivery
          order_id={deleteOrderId}
          isModalVisible={true}
          handleModalTogle={(v) => setNextValue(v)}
        />
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = {
  count: {
    width: 20,
    height: 20,
    textAlign: "center",
    overflow: "hidden",
    backgroundColor: palette.yellow,
    borderRadius: 10,
    marginLeft: 5,
  },
};

export { Activities };
