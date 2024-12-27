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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

export default function AdminPage() {
  const data = useQuery(api.products.getAllProducts);

  const updatedProduct = useMutation(api.products.update);
  const deleteProduct = useMutation(api.products.remove);

  const [allProducts, setAllProducts] = useState<Doc<"product">[]>(data || []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const itemsPerPage = 5;

  useEffect(() => {
    if (data?.length) setAllProducts(data);
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

  const updateStatus = (product: Doc<"product">) => {
    updatedProduct({
      id: product._id,
    }).then(() => {
      window.alert("Product status updated successfully");
    });
  }

  const handleDeleteProduct = (productId: Id<"product">) => {
    deleteProduct({
      id: productId,
    }).then(() => {
      window.alert("Product deleted successfully");
    });
  }

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
      <Text className='text-2xl font-semibold text-fuchsia-600 mt-5 text-start px-4'>
        All Products
      </Text>
      <TextInput
        className='border p-2 m-4 rounded'
        placeholder='Search products...'
        value={searchQuery}
        onChangeText={handleSearchChange}
      />
      <View className='flex flex-row flex-wrap justify-start gap-2 p-2'>
        {["", ...categories].map((category) => (
          <Pressable
            key={category}
            onPress={() => handleCategoryChange(category)}
          >
            <Text
              className={`text-md transition-colors duration-150 transform ease-in-out border-gray-300 rounded-lg p-1.5 border-2 ${
                selectedCategory === category
                  ? "font-bold border-[#7F00FF] border-2 text-[#7F00FF]"
                  : "text-gray-500"
              }`}
            >
              {category === ""
                ? "All"
                : category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text className='text-md font-light text-gray-600 text-right px-4'>
        Showing {startIndex + 1} - {endIndex} of {filteredProducts.length}{" "}
        products
      </Text>
      <View className=''>
        <View className='border-b border-gray-200 shadow'>
          <View className='flex flex-row bg-gray-100 p-2 space-x-1'>
            <Text className='w-1/6 font-semibold text-gray-600'>Image</Text>
            <Text className='w-1/6 font-semibold text-gray-600'>Name</Text>
            <Text className='w-1/6 font-semibold text-gray-600'>Category</Text>
            <Text className='w-1/6 font-semibold text-gray-600'>Price</Text>
            <Text className='w-1/6 font-semibold text-gray-600'>Status</Text>
            <Text className='w-1/6 font-semibold text-gray-600'>Action</Text>
          </View>
          {paginatedProducts.map((product, index: number) => (
            <View
              key={index}
              className='flex flex-row p-2 border-b items-center space-x-1  border-gray-200'
            >
              <Image
                source={{ uri: product.image }}
                className='w-1/6 h-20 rounded-lg shrink-0 aspect-square' 
                resizeMode='contain'
              
              />
              <Text className='w-1/6 text-gray-600'>{product.title}</Text>
              <Text className='w-1/6 text-gray-600'>{product.category}</Text>
              <Text className='w-1/6 text-gray-600'>{`$${product.price}`}</Text>
              <Text className='w-1/6 text-gray-600'>{`${product.status}`}</Text>
                <View className='w-1/6 flex flex-col items-center space-y-6'>
                <TouchableOpacity
                  onPress={() => updateStatus(product)}
                  className="border-2 rounded-md p-[2px] border-gray-300"
                >
                  <Icon name='check' size={16} color='green' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteProduct(product._id)}>
                  <Icon name='delete' size={20} color='red' />
                </TouchableOpacity>
                </View>
            </View>
          ))}
        </View>
      </View>
      <View className='flex mb-4 flex-row justify-between p-5'>
        {currentPage > 1 && (
          <Pressable
            className='border-2 border-gray-300 p-2 rounded-xl'
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
            <Text className='text-md font-medium text-[#7F00FF]'>Next</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}
