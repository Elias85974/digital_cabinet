import React, {useEffect, useState} from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import TupleStock from './TupleStock';

const ProductInfoModal = ({updateProducts,
    modalProductInfo,
    selectedProduct,
    modalReduce,
    modalAdd, setModalProductInfo,
    styles, currentPage,
    navigation

}) => {

    useEffect(() => {
        setModalAdd(false)
        setModalReduce(false)
    }, []);

    //const [modalProductInfo1, setModalProductInfo] = useState(true);
    const [modalAdd1, setModalAdd] = useState(false);
    const [modalReduce1, setModalReduce] = useState(false);


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalProductInfo}
            onRequestClose={() => {
                setModalProductInfo(!modalProductInfo);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Producto: {selectedProduct?.product.nombre}</Text>
                    <Text style={styles.modalText}>Marca: {selectedProduct?.product.marca}</Text>
                    <Text style={styles.modalText}>Cantidad total: {selectedProduct?.totalQuantity}</Text>
                    <Text style={styles.modalText}>Categoría: {selectedProduct?.product.category.nombre}</Text>
                    <Text style={styles.modalText}>Indicador de bajo stock: {selectedProduct?.lowStockIndicator}</Text>
                    <Text style={styles.modalText}>Próximo a vencer en: {new Date(selectedProduct?.nearestExpirationDate).toLocaleDateString()}</Text>

                    <View style={styles.linksContainer}>
                        <Pressable onPress={() => {
                            setModalReduce(true)
                        }}>
                            <Text style={styles.link}>Reduce Stock</Text>
                        </Pressable>
                        <Pressable onPress={() => {
                            setModalAdd(true)
                        }}>
                            <Text style={styles.link}>Add Stock</Text>
                        </Pressable>
                        <Pressable onPress={() => setModalProductInfo(false)} >
                            <Text style={styles.link}>Cerrar</Text>
                        </Pressable>
                    </View>

                    <TupleStock
                        currentPage={currentPage}
                        updateProducts={updateProducts}
                        navigation={navigation}
                        setModalAdd={setModalAdd}
                        setModalProductInfo={setModalProductInfo}
                        setModalReduce={setModalReduce}
                        modalVisibleReduce={modalReduce1}
                        modalVisibleAdd={modalAdd1}
                        selectedProduct={selectedProduct}
                        styles={styles}
                    />

                </View>
            </View>
        </Modal>
    );
};

export default ProductInfoModal;