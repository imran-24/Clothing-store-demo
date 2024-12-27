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
import { Picker } from "@react-native-picker/picker";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { categories } from "@/constants/utils";

export default function UploadProduct() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);


  const mutate = useMutation(api.products.create);

  const onClick = () => {
    mutate({
      title: productName,
      description: description,
      category: category,
      price: parseFloat(price),
      image: image,
    }).then((response) => {
      console.log(response);
    });
  };

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri as any);
    }
  };

  const handleSubmit = async () => {
    if (!image || !productName || !price || !category || !description) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    console.log("Product Name:", productName);
    console.log("Price:", price);
    console.log("Category:", category);
    console.log("Description:", description);
    console.log("Image:", image);

    setIsUploading(true);

    mutate({
      title: productName,
      description: description,
      category: category,
      price: parseFloat(price),
      image: image,
    })
      .then((response) => {
        Alert.alert("Success", "Product uploaded successfully!");
        setIsUploading(false);

        // Reset fields
        setProductName("");
        setPrice("");
        setCategory("");
        setDescription("");
        setImage(null);
      })
      .catch((error) => {
        console.error("Error uploading product:", error);
        Alert.alert("Error", "Failed to upload product.");
        setIsUploading(false);
      });

    // try {
    //   // Upload image to Firebase Storage
    //   const response = await fetch(image);
    //   const blob = await response.blob();
    //   const storageRef = ref(storageService, `products/${new Date().toISOString()}.jpg`);
    //   const uploadTask = uploadBytesResumable(storageRef, blob);

    //   uploadTask.on(
    //     "state_changed",
    //     null,
    //     (error) => {
    //       console.error("Error uploading image:", error);
    //       Alert.alert("Upload Error", "Something went wrong while uploading the image.");
    //       setIsUploading(false);
    //     },
    //     async () => {
    //       // Get the download URL for the uploaded image
    //       const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

    //       // Save product details to Firestore
    //       await addDoc(collection(db, "products"), {
    //         name: productName,
    //         price: parseFloat(price),
    //         category,
    //         description,
    //         imageUrl,
    //         status: "Pending Approval",
    //         createdAt: new Date(),
    //       });

    //       Alert.alert("Success", "Product uploaded successfully!");
    //       setIsUploading(false);

    //       // Reset fields
    //       setProductName("");
    //       setPrice("");
    //       setCategory("");
    //       setDescription("");
    //       setImage(null);
    //     }
    //   );
    // } catch (error) {
    //   console.error("Error uploading product:", error);
    //   Alert.alert("Error", "Failed to upload product.");
    //   setIsUploading(false);
    // }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Product</Text>
      <TextInput
        style={styles.input}
        placeholder='Product Name'
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder='Price'
        value={price}
        keyboardType='numeric'
        onChangeText={setPrice}
      />
      <View className='border border-gray-300 rounded mb-4'>
        <Picker
          selectedValue={category}
          className='text-xs'
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label='Select Category' value='' />
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>
      <TextInput
        style={styles.textArea}
        placeholder='Description'
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title='Pick an Image' onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={{ height: 20 }} />
      <Button
        title={isUploading ? "Uploading..." : "Upload Product"}
        onPress={handleSubmit}
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
