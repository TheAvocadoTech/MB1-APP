import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler';

const Test = () => {
    
    const [products, setProducts] = useState<any[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetch('https://dummy.restapiexample.com/api/v1/employees')
            .then((res) => res.json())
            .then((data) => setProducts(data?.data || []))
            .catch((err) => console.log('Fetch error:', err));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query == "") return;
            const filteredData = products.filter((item) => item && item.employee_name && item.employee_name.contains(query));
            setProducts(filteredData);
        }, 500)

        return ()=>{
            clearTimeout(timer);
        }
    }, [query, products])

    return (
        <View>
            <TextInput value={query} onChangeText={(text) => setQuery(text)} />
        </View>
    )
}

export default Test

const styles = StyleSheet.create({})