import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageSource } from "../../../../constants/assets/images";
import { useStyles } from "./CommonNavigationScreen.styles";
import { useTheme } from "../../../../theme/ThemeProvider";
import MB1Commons2DMap from "../../../../components/Map/MB1Commons2DMap";
import { RouteProp, useRoute } from "@react-navigation/native";
import MB1Native2DMap from "../../../../components/Map/MB1Native2DMap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { getLive3DPositionByToken } from "../../../../services/ApiUtility";
type RouteParams = {
    CommonsNavigationScreen: {
        cabinetName?: string;
    };
};

const CommonsNavigationScreen=()=>{
        const { colors } = useTheme();
           const route = useRoute<RouteProp<RouteParams, 'CommonsNavigationScreen'>>();
          const cabinetName=route.params.cabinetName;
          const targetName = (cabinetName || "").toLowerCase();
        const styles = useStyles(colors);
                const [liveData, setLiveData] = useState(null);
                const {visitor,token}= useSelector((state: RootState) => state.auth);

                const fetch3dPosition=async()=>{
                 if(token){
                     const result= await getLive3DPositionByToken(token);
                     console.log(result);
                     setLiveData(result)
                     // setMergedVisitorLocation(result);
                 }
             }
     return ( <SafeAreaView edges={['bottom', 'top']} style={styles.container}>
                {/* Header section with brand indicator */}
                <View style={styles.header}>
                    <View style={styles.redIndicator} />
                    <View style={styles.logoContainer}>
                        <Image source={ImageSource.Logo} style={styles.logo} />
                         <Image source={ImageSource.LogoName} style={{height: 15,resizeMode: 'contain'}} />
                        {/* <View style={styles.titleWrapper}>
                            <Text style={styles.logoTitle} varient="bold">
                                {cabinetDetails?.companyName || "AVOCADO"}
                            </Text>
                            <Text style={styles.logoSubtitle}>
                                {cabinetDetails?.cabinetName || "From seed to screen"}
                            </Text>
                        </View> */}
                    </View>
                </View>
                    {
                        (targetName.includes("colo"))?(<MB1Native2DMap liveData={liveData} cabinType={cabinetName}/>):
                        (<MB1Commons2DMap cabinetName={cabinetName}/>)
                    }
                   {/* <MB1Native2DMap liveData={liveData} cabinType={cabinetName}/>  */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.btnBack} >
                    <Text style={styles.btnBackText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnAction} >
                    <Text style={styles.btnActionText}>Get into my phone</Text>
                </TouchableOpacity>
            </View>
            </SafeAreaView>)
           
   
}
export default CommonsNavigationScreen;
