
import NavOptions from '../components/NavOptionsPedestrian';


import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Button,
    ImageBackground,
    TouchableOpacity
 } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { ScrollView }
    from 'react-native-gesture-handler'
import Deck from '../components/Deck';
import Cards from '../components/Cards';
import CardsCoverage from '../components/CardsCoverage';

import Buttons from '../components/Buttons';
import Chart from '../components/Chart';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from "@react-navigation/native";
import ChartCoverage from '../components/ChartCoverage';
import Icon2 from '@expo/vector-icons/MaterialCommunityIcons'
import ModalPopupCoverage from '../components/ModalPopupCoverage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DATA = [
    {
        id:1,
        title:"TODAYS PROGRESS",
        number:"1/3"
    },
    {
        id:2,
        title:"NEXT MILESTONE",
        number:"4"
    },
    {
        id:3,
        title:"REWARDS",
        number:"1"
    }
]
class Test extends Component {

    constructor(props){
        super(props);

        this.state = {visible: false};
    }

 renderCard(item){
   return(
    <View key={item.id} style={styles.cardContainer}>
        <View style={styles.card}>
            <View>
                <Text style={styles.title}>{item.title}</Text>
                <Icon
                    name="ios-remove"
                    size={40}
                    color="red"
                    style={{marginTop:25}}
                />
                <Text style={styles.number}>{item.number}</Text>
            </View>
            <View style={{marginLeft:150}}>
                <Icon name="md-options" size={24} color="#FFF"/>
                <Text style={styles.textCovid}>METRICS</Text>
            </View>
        </View>
    </View>
    );
}

renderNoMoreCards(){
    return(
        <View title="All Domne!">
            <Text style={styles.noCard}>NO MORE CARDS HERE</Text>
            <Button backgroundColor="#03A9F4" title="Get more!"/>
        </View>
    );
}

    render(){
        const { navigation } = this.props;

        return(
            <View style={styles.container}>
                <ImageBackground
//                    source={require("../images/unnamed.jpg")}
                    style={styles.map}
                >
                    <Text style={tw` text-lg font-bold text-center`}>PEDESTRIAN DASHBOARD</Text>
                     <Chart/>
                     <TouchableOpacity
                        onPress={() => navigation.navigate("SignInScreen")}
                        style={tw`bg-gray-100 absolute top-4 right-5 z-50 p-3 rounded-full shadow-lg`}
                    >
                        <Icon name="power-sharp" />
                    </TouchableOpacity>
                </ImageBackground>
                {/* <Deck
                    data={DATA}
                    renderCard={this.renderCard}
                    renderNoMoreCards={this.renderNoMoreCards}
                /> */}
                <ScrollView
                    style={{marginTop:100}}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                >
                    <Cards
                        onPress={()=>this.props.navigation.navigate('Detail')}
                        icon="checkmark-circle-outline"
                        title="ISSUES REPORTED"
                        bg="#EAE8F3"
                        iconbg = "#3B228A"
                        number="9"
                    />
                     <Cards
                        icon="reader-outline"
                        title="ISSUES COMPLETED"
                        bg="#EAE8F3"
                        iconbg = "#3B228A"
                        borderRadius={10}

                        number="20"
                    />
                     <Cards
                        icon="map-outline"
                        title="AREAS COVERED"
                        bg="#EAE8F3"
                        iconbg = "#3B228A"
                        number="3"
                    />

<View style={{
            ...styles.containerCard, 
            backgroundColor:"#EAE8F3"
         }}>
            <View style={styles.colCard}>
               <Icon 
                 name="map-outline"
                 size={30}
                 color="#3B228A"
               />
               <TouchableOpacity 
               onPress={() => 
                {
                    console.log("PRESSING")
                this.setState({visible: true})
                }}
                >
                    <Icon2
                        style={{marginLeft:50}}
                        name="dots-vertical"
                        size={30}
                        color="#b8b8aa"
                    />
               </TouchableOpacity>
            </View>
             <Text style={{...styles.titleCard,
             color: this.props.bg == "red" ? "#FFF":"#3a4b4f",}}>GUARDIAN COVERAGE</Text>
            <Text style={{
                ...styles.numberCard,
                color: this.props.bg == "red" ? "#FFF":"#3a4b4f",
            }}>
                {this.props.number}
            </Text>
         </View>

                    

                
                </ScrollView>

                {/* <ChartCoverage /> */}

                <View style={{width: "100%", marginBottom: 60, justifyContent: "center", alignItems: "center"}}>
                    <NavOptions />
                </View>


                <ModalPopupCoverage visible={this.state.visible}>

                <TouchableOpacity onPress={() => this.setState({visible: false})}>
                    <Ionicons
                        name="close-outline"
                        size={24}
                        color="#52575D"></Ionicons>
                </TouchableOpacity>

                    <View style={{alignItems: 'center'}}>
                    
                    <ChartCoverage />

                    </View>
          
                </ModalPopupCoverage>
                
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff"
    },
    cardContainer:{
        height:150,
        width:320,
        alignSelf:"center",
        backgroundColor:"#6A706E",
        borderRadius:30
    },
    card:{
        height:150,
        width:260,
        paddingTop:20,
        paddingHorizontal:30,
        backgroundColor:'#EEEEEE',
        borderRadius:30,
        flexDirection:'row'
    },
    title:{
        color:"#3a4b4f",
        width:100,
        fontSize:12,
        fontWeight:"bold"
    },
    number:{
        color:"#3a4b4f",
        width:100,
        fontSize:22,
        fontWeight:"bold",
        marginTop:-10,
    },
    textCovid:{
        transform:[{ rotate : "-90deg"}],
        color:"#fff",
        fontSize:14,
        width:90,
        marginLeft:-35,
        fontWeight:'bold',
        marginTop:20
    },
    noCard:{
        marginBottom:10,
        color:'#3a4b4f',
        alignSelf:"center"
    },
    map:{
        height:200,
        paddingTop:25,
        paddingHorizontal:20,
        marginBottom:15
    },
    col:{
        flexDirection:'row'
    },
    minusIcon:{
        marginTop:-20,
        marginLeft:5
    },
    avatarContainer:{
        width:"50%",
        alignItems:'flex-end',
    },
    avatar:{
        width:40,
        height:40,
        borderRadius:20
    },
    textDash:{
        color:"#3a4b4f",
        fontSize:20,
        alignSelf:'center',
        marginTop:15,
        fontWeight:'bold'
    },
    colContainer:{
        flexDirection:"row",
        paddingHorizontal:30,
        marginTop:40,
        alignItems:'center',
    },
    textGlobal:{
        fontWeight:"bold",
        fontSize:16,
        color:"red"
    },
    textRussia:{
        fontWeight:"bold",
        fontSize:16,
        paddingHorizontal:30,
        color:"#6a706e"
    },
    reloadContainer:{
        backgroundColor:"#FFF",
        elevation:2,
        width:40,
        height:40,
        borderRadius:20,
        alignItems:'center',
        justifyContent:"center",
        marginLeft:50
    },
    containerCard:{
        height:220,
        width:130,
        borderRadius:30,
        padding:15,
        marginLeft:20,
        borderRadius: 20,
        borderColor: "black"
    
      },
      colCard: {
          flexDirection:"row"
      },
      titleCard:{
          marginTop:90,
          color:"#b8b8aa",
          fontWeight:"bold",
          fontSize:12
      },
      numberCard:{
          fontWeight:'bold',
          fontSize:22
      }
    


});

export default function(props) {
    const navigation = useNavigation();
  
    return <Test {...props} navigation={navigation} />;
  }