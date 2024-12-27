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
} from "react-native";

import { categories } from "@/constants/utils";


import { useEffect, useRef, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/AntDesign";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

// import { RootStackParamList, Product } from '../types/navigation';

export default function ProductList() {

  const data = useQuery(api.products.getAllProducts);

  const [allProducts, setAllProducts] = useState<Doc<"product">[]>(data || []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const itemsPerPage = 5;

  useEffect(() => {
    if(data?.length) setAllProducts(data);
  }, [data]);

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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  if (data === undefined) {
    return (
      <View className='p-2'>
        <Text className='align-middle text-sm text-center text-[#7F00FF] mt-10 mr-2 font-base mx-auto '>
          Please wait...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
      <Text className='text-2xl font-semibold text-fuchsia-600  mt-5  text-start px-4'>
        All Products
      </Text>
      <TextInput
        className='border p-2 m-4 rounded'
        placeholder='Search products...'
        value={searchQuery}
        onChangeText={handleSearchChange}
      />
      <View className='flex flex-row flex-wrap justify-start gap-2 p-2 px-4'>
        {["", ...categories].map((category) => (
          <Pressable key={category} onPress={() => handleCategoryChange(category)}>
        <Text className={`text-md transition-colors duration-150 transform ease-in-out border-gray-300 rounded-lg p-1.5 border-2 ${selectedCategory === category ? "font-bold border-[#7F00FF] border-2 text-[#7F00FF]" : "text-gray-500"}`}>
          {category === "" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
          </Pressable>
        ))}
      </View>
      <Text className='text-md font-light text-gray-600 text-right px-4'>
        Showing {startIndex + 1} - {endIndex} of {filteredProducts.length} products
      </Text>
      <View></View>
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
