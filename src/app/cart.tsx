import { Header } from "@/components/header";
import { View, Text, ScrollView, Alert, Linking } from "react-native";
import { Product } from "@/components/product";
import { ProductsCartProps, useCartStore } from "@/stores/cart-store";
import { formartCurrency } from "@/utils/function/format-currency";
import { Input } from "@/components/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link-button";
import { useState } from "react";
import { useNavigation } from "expo-router";

const PHONE_NUMBER = "5511950345277"




export default function Cart() {
    const [adress, setAddress] = useState("")
    const cartStore = useCartStore()
    const total = formartCurrency(cartStore.products.reduce((total, product) => total + product.price * product.quantity, 0))
    const navegation = useNavigation()

    function handleProductRemove(product: ProductsCartProps) {
        Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [{
            text: "Cancelar",
        },
        {
            text: "Remover",
            onPress: () => cartStore.remove(product.id),
        }])

    }



    function handleOrder() {
        if (adress.trim().length === 0) {
            return Alert.alert("Pedido", "Informe os dados da entrega.")
        }

        const products = cartStore.products.map((product) => `\n  ${product.quantity} ${product.title}`).join("")

        const message = `
        
        🍔 NOVO PEDIDO
        \n Entregar em: ${adress}

        ${products}

        \n Valor total: ${total}

    
        `
        Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`)
        cartStore.clear()
        navegation.goBack()

    }

    return (
        <View className="flex-1 pt-8">
            <Header title="Seu carrinho" />

            <KeyboardAwareScrollView>
                <ScrollView>
                    <View className="p-5 flex-1">


                        {cartStore.products.length > 0 ? (

                            <View className="border-b border-slate-700 ">
                                {
                                    cartStore.products.map((product) => (
                                        <Product key={product.id} data={product} onPress={() => handleProductRemove(product)} />
                                    ))
                                }
                            </View>

                        ) :

                            <Text className="font-body text-slate-400 text-center my-8">
                                Seu carrinho está vazio.
                            </Text>
                        }

                        <View className="flex-row gap-2 items-center mt-5 mb-4 ">
                            <Text className="text-white text-xl font-subtitle">Total:</Text>
                            <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
                        </View>


                        <Input placeholder="Informe o endereço de entrega com Rua, Bairro, CEP, Número e Complemento" onChangeText={setAddress} blurOnSubmit={true}
                            onSubmitEditing={handleOrder} returnKeyType="next" />

                    </View>
                </ScrollView>

            </KeyboardAwareScrollView>

            <View className="p-5 gap-5 ">
                <Button onPress={handleOrder}>
                    <Button.Text>Enviar pedido</Button.Text>
                    <Button.Icon>
                        <Feather name="arrow-right-circle" size={20} />
                    </Button.Icon>
                </Button>

                <LinkButton title="Voltar ao cardápio" href="/" />
            </View>

        </View>

    )
}