import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
} from "react-native";

import { categories } from "@/constants/utils";

import { useEffect, useRef, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/AntDesign";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import * as ImagePicker from "expo-image-picker";
import { run } from "@/geminiFlash";

// import { RootStackParamList, Product } from '../types/navigation';

export default function ImageSearch() {
  const products = useQuery(api.products.getAllProducts);

  const [isUploading, setIsUploading] = useState(false);

  const [imageUri, setImageUri] = useState(null);
  const [features, setFeatures] = useState(null);

  const [allProducts, setAllProducts] = useState<Doc<"product">[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const itemsPerPage = 5;

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
      setAllProducts([])
      analyzeImage(result.assets[0].uri);
    } else {
      console.error("Image selection canceled or failed.");
    }
  };

  const filterProducts = async (image: any) => {
    const data = await run(image);
    if (!data) {
      console.error("No data returned from run function.");
      return;
    }
    let response;
    try {
      response = (data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return;
    }

    const extractValue = (str: string, key: string): string => {
      const regex = new RegExp(`${key}:\\s*([^\\n]+)`, "i");
      const match = str.match(regex);
      return match ? match[1].trim() : "";
    };

    const title = extractValue(response, "Title");
    const description = extractValue(response, "Description");
    const category = extractValue(response, "Category");

    const filtered = products?.filter((product: Doc<"product">) => {
      return (
        product.title.toLowerCase().includes(title.toLowerCase()) ||
        product.description?.toLowerCase()
          .includes(description?.toLowerCase()) ||
        product.category?.toLowerCase().trim() === category.toLowerCase().trim()
      );
    });
    setIsUploading(false);
    console.log("Filtered Products:", filtered);
    setAllProducts(filtered || []);
  };

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
          await filterProducts(base64Image);
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
  };

  const filteredProducts = allProducts.filter((product) => {
    return (
      (selectedCategory === "" || product.category === selectedCategory) &&
      (searchQuery === "" ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (endIndex < filteredProducts.length) {
      setCurrentPage(currentPage + 1);
      scrollToTop();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToTop();
    }
  };

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };


  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
      <Text className='text-2xl font-semibold text-fuchsia-600  mt-5  text-start px-4'>
        Search Products
      </Text>
      <View className=' p-4'>
        <Button title='Pick an Image' onPress={pickImage} />
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        <View style={{ height: 20 }} />
        {/* <Button
          title={isUploading ? "Searching..." : "Search Product"}
          onPress={() => {}}
          disabled={isUploading}
        /> */}
      </View>
      <View>
        {
          <Text className='text-md font-light text-gray-600 text-right px-4'>
            Showing {startIndex + 1} - {endIndex} of {filteredProducts.length}{" "}
            products
          </Text>
        }
      </View>
      {paginatedProducts.map((product, index: number) => {
        return (
          <View
            key={index}
            className='flex flex-col h-max mb-4 self-center w-3/4  rounded-xl space-y-4 p-2  mt-5 mx-2'
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              shadowColor: "#7F00FF",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Link
              href={{
                pathname: "/productDetails",
                // params: { product: JSON.stringify(product) },
              }}
              asChild
            >
              <TouchableOpacity
                className='space-y-4 p-3'
                // onPress={() => navigation.navigate("productDetails", product)}
              >
                <Image
                  source={{ uri: product.image }}
                  className='w-40 h-40 self-center   rounded-xl'
                  resizeMode='contain'
                />
                <View className='flex rounded-xl py-0 text-neutral-50  flex-col space-y-2'>
                  <Text className='text-sm max-w-fit h-max  font-bold text-gray-500   truncate'>
                    <Text className='text-black font-semibold'>Name:</Text>{" "}
                    {product.title}
                  </Text>
                  <Text className='text-md w-40 h-max  font-bold capitalize text-gray-500'>
                    <Text className='text-black font-semibold'>Category:</Text>{" "}
                    {product.category}
                  </Text>
                  <Text className='w-40 h-max text-md  font-extrabold  text-gray-500'>
                    <Text className='text-black'>Price:</Text>{" "}
                    {`$${product.price}`}
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          </View>
        );
      })}
      <View className='flex mb-4 flex-row justify-between p-5'>
        {currentPage > 1 && (
          <Pressable
            className={`  border-2 border-gray-300 p-2 rounded-xl  outline `}
            onPress={handlePrevPage}
          >
            <Text className='text-md font-medium text-[#7F00FF]'>Previous</Text>
          </Pressable>
        )}
        {endIndex < filteredProducts.length && (
          <Pressable
            className='border-2 border-gray-300 p-2 rounded-xl'
            onPress={handleNextPage}
          >
            <Text className='text-md font-medium  text-[#7F00FF]'>
              {`Next`}{" "}
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
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
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 4,
  },
});
