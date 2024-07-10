import React, {useState} from 'react';
import { View } from 'react-native';
import ReduceStockModal from './ReduceStockModal';
import AddStockModal from './AddStockModal';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {InventoryApi} from "../../../Api";

export default function TupleStock({ updateProducts,
    modalVisibleReduce,
    setModalVisibleReduce,

    modalVisibleAdd,
    setModalVisibleAdd,

    selectedProduct,

    setQuantityToReduce,
    quantityToReduce,

    setQuantityToAdd,
    quantityToAdd,

    styles,
    navigation,

    refreshKey,
    setRefreshKey,
}) {

    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal

    const handleReduceStock = async () => {
        if (Number(quantityToReduce) > selectedProduct.totalQuantity) {
            setModalVisibleReduce(false);
            setModalMessage("You cannot reduce more stock than available"); // Muestra el modal en lugar de un alert
            setModalVisible(true);
            return;
        }
        const houseId = await AsyncStorage.getItem('houseId');
        // After successful reduction, close the modal and reset the quantity to reduce
        await InventoryApi.reduceStock(houseId, selectedProduct.product.producto_ID, quantityToReduce, navigation);
        setModalVisibleReduce(false);
        // no le llega a esto --> setModalProductInfo(false); // Close both modals
        setQuantityToReduce('');
        setRefreshKey(oldKey => oldKey + 1);

        const category = await AsyncStorage.getItem('category');
        const reduceProd = await InventoryApi.getProductsFromHouseAndCategory(houseId, category, navigation);
        updateProducts(reduceProd);
        console.log('reduceProd con getProdHC:', reduceProd);
        return reduceProd;
    }

    const handleAddStock = async () => {
        const houseId = await AsyncStorage.getItem('houseId');
        await InventoryApi.addLowOnStockProduct(houseId, {productId: selectedProduct.product.producto_ID, quantity: quantityToAdd}, navigation);
        setModalVisibleAdd(false);
        setQuantityToAdd('');
        setRefreshKey(oldKey => oldKey + 1);

        const stock = await InventoryApi.getLowOnStockProducts(houseId, navigation);
        /*setProducts(stock)
        setSuggestions(stock)
        setFilteredProducts(stock)*/ // a falta de esto se devuelve la lista, agregarlo en los otros lados
        console.log("Products loaded after adding stock", stock);
        setRefreshKey(oldKey => oldKey + 1);
        navigation.navigate('LowOnStock', {key: refreshKey});
        updateProducts(stock);
        return stock;
    }

    return (
        <View>
            <ReduceStockModal
                modalVisible={modalVisibleReduce}
                setModalVisible={setModalVisibleReduce}
                selectedProduct={selectedProduct}
                setQuantityToReduce={setQuantityToReduce}
                quantityToReduce={quantityToReduce}
                handleReduceStock={handleReduceStock}
                styles={styles}
            />

            <AddStockModal
                modalVisible={modalVisibleAdd}
                setModalVisible={setModalVisibleAdd}
                selectedProduct={selectedProduct}
                setQuantityToAdd={setQuantityToAdd}
                quantityToAdd={quantityToAdd}
                handleAddStock={handleAddStock}
                styles={styles}
            />
        </View>
    );
}


