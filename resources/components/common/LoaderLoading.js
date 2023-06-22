const LoaderLoading = ({ value }) => {
  return (
    <>
      {value == true ? (
        <View>
          <Text>Loading ..</Text>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export default LoaderLoading;
