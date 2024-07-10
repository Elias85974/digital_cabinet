import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import TupleStock from './TupleStock';

const ProductInfoModal = ({updateProducts,
    modalProductInfo,
    setModalProductInfo,
    selectedProduct,
    setModalReduce,
    modalReduce,
    setModalAdd,
    modalAdd,
    setQuantityToReduce,
    quantityToReduce,
    setQuantityToAdd,
    quantityToAdd,
    styles,
    refreshKey,
    setRefreshKey
}) => {
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
                    <Text style={styles.modalText}>Próximo a vencer en: {new Date(selectedProduct?.nearestExpirationDate).toLocaleDateString()}</Text>

                    <View style={styles.linksContainer}>
                        <Pressable onPress={() => setModalReduce(true)}>
                            <Text style={styles.link}>Reduce Stock</Text>
                        </Pressable>
                        <Pressable onPress={() => setModalAdd(true)}>
                            <Text style={styles.link}>Add Stock</Text>
                        </Pressable>
                        <Pressable onPress={() => setModalProductInfo(false)} >
                            <Text style={styles.link}>Cerrar</Text>
                        </Pressable>
                    </View>

                    <TupleStock
                        updateProducts={updateProducts}

                        modalVisibleReduce={modalReduce}
                        setModalVisibleReduce={setModalReduce}
                        modalVisibleAdd={modalAdd}
                        setModalVisibleAdd={setModalAdd}
                        selectedProduct={selectedProduct}
                        setQuantityToReduce={setQuantityToReduce}
                        quantityToReduce={quantityToReduce}
                        setQuantityToAdd={setQuantityToAdd}
                        quantityToAdd={quantityToAdd}
                        styles={styles}
                        refreshKey={refreshKey}
                        setRefreshKey={setRefreshKey}
                    />

                </View>
            </View>
        </Modal>
    );
};

export default ProductInfoModal;