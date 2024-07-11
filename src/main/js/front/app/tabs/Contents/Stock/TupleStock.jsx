import React, {useState} from 'react';
import { View } from 'react-native';
import ReduceStockModal from './ReduceStockModal';
import AddStockModal from './AddStockModal';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {InventoryApi} from "../../../Api";

export default function TupleStock({ updateProducts,
    modalVisibleReduce,
    modalVisibleAdd,
    setModalReduce,currentPage, setModalProductInfo,
    setModalAdd,
    selectedProduct, navigation,
    styles,
}) {

    return (
        <View>
            <ReduceStockModal
                currentPage={currentPage}
                updateProducts={updateProducts}
                modalVisible3={modalVisibleReduce}
                selectedProduct={selectedProduct}
                setModalReduce={setModalReduce}
                styles={styles}
                setModalProductInfo={setModalProductInfo}
                navigation={navigation}
            />

            <AddStockModal
                currentPage={currentPage}
                updateProducts={updateProducts}
                modalVisible={modalVisibleAdd}
                setModalAdd={setModalAdd}
                selectedProduct={selectedProduct}
                styles={styles}
                setModalProductInfo={setModalProductInfo}
                navigation={navigation}
            />
        </View>
    );
}


