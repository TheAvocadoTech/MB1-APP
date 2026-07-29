import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export const WithLoader = (Component: any) => {
    return function EnhancedComponent({ isLoading, ...props }: { isLoading: boolean; [key: string]: any }) {
        if (isLoading) {
            return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading</Text>
            </View>
        }
        return <Component {...props} />
    }
}


function Home() {
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Home Screen</Text>
    </View>
}

const HomeWithLoader = WithLoader(Home);

export default HomeWithLoader;