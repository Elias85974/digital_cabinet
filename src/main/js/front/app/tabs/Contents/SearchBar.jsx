import React from 'react';
import { View, TextInput } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import FilterModal from './FilterModal';

const SearchBar = ({ currentPage, navigation, styles, handleInputChange, query, products, handleFilteredProducts }) => {
    return (
        <View style={{backgroundColor: '#3b0317', borderRadius: 30, flex: 3, alignItems: 'center',
            flexDirection: 'row', justifyContent: 'space-between',margin: 5,}}>
            <FontAwesome style={{paddingLeft:10}} name="search" size={24} color="white" />
            <TextInput
                style={styles.input}
                onChangeText={handleInputChange}
                value={query}
                placeholder="Search product"
            />
            <FilterModal products={products} onFilter={handleFilteredProducts} currentPage={currentPage} navigation={navigation}/>
        </View>
    );

};

export default SearchBar;