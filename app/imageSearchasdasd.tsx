import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";


export default function ImageSearch() {
  // const [productName, setProductName] = useState("");
  // const [price, setPrice] = useState("");
  // const [category, setCategory] = useState("");
  // const [description, setDescription] = useState("");
  // const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [imageUri, setImageUri] = useState(null);
  const [features, setFeatures] = useState(null);

  // const pickImage = async () => {
  //   const result = await launchImageLibrary({
  //     mediaType: 'photo',
  //     quality: 1,
  //   });

  //   if (result.assets && result.assets[0]) {
  //     setImageUri(result.assets[0].uri);
  //     analyzeImage(result.assets[0].uri);
  //   } else {
  //     console.error('Image selection canceled or failed.');
  //   }
  // };

  const analyzeImage = async (imageUri: string) => {
    try {
      // Convert image to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const result = reader.result as string | null;
        if (result) {
          const base64Image = result.replace("data:", "").replace(/^.+,/, "");

          console.log(base64Image);

    //       // Clarifai API call
    //       const clarifaiResponse = await axios({
    //         method: "post",
    //         url: `${process.env.EXPO_PUBLIC_CLARIFAI_URL}/v2/models/general-image-recognition/outputs`,
    //         headers: {
    //           Authorization: `Key ${process.env.EXPO_PUBLIC_CLARIFAI_API_KEY}`,
    //           "Content-Type": "application/json",
    //         },
    //         data: {
    //           inputs: [
    //             {
    //               data: {
    //                 image: {
    //                   base64: base64Image,
    //                 },
    //               },
    //             },
    //           ],
    //         },
          // });

          // const extractedFeatures =
          //   clarifaiResponse.data.outputs[0].data.concepts;
          // setFeatures(extractedFeatures);
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
  };

  const mutate = useMutation(api.products.create);

  // const onClick = () => {
  //   mutate({
  //     title: productName,
  //     description: description,
  //     category: category,
  //     price: parseFloat(price),
  //     image: image,
  //   }).then((response) => {
  //     console.log(response);
  //   });
  // };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permissions to select images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri as any);
      analyzeImage(result.assets[0].uri);
    } else {
      console.error("Image selection canceled or failed.");
    }
  };

  // const handleSubmit = async () => {
  //   if (!image || !productName || !price || !category || !description) {
  //     Alert.alert("Error", "All fields are required.");
  //     return;
  //   }
  //   setIsUploading(true);
  //   mutate({
  //     title: productName,
  //     description: description,
  //     category: category,
  //     price: parseFloat(price),
  //     image: image,
  //   })
  //     .then((response) => {
  //       Alert.alert("Success", "Product uploaded successfully!");
  //       setIsUploading(false);
  //       setProductName("");
  //       setPrice("");
  //       setCategory("");
  //       setDescription("");
  //       setImage(null);
  //     })
  //     .catch((error) => {
  //       console.error("Error uploading product:", error);
  //       Alert.alert("Error", "Failed to upload product.");
  //       setIsUploading(false);
  //     });
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Product</Text>
      <Button title='Pick an Image' onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <View style={{ height: 20 }} />
      <Button
        title={isUploading ? "Searching..." : "Search Product"}
        onPress={() => {}}
        disabled={isUploading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    paddingHorizontal: 10,
    textAlignVertical: "top",
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 4,
  },
});
