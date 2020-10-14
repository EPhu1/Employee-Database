import React, {useEffect, useState} from 'react';
import { FlatList, Image, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { Card, FAB } from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux'
const Home = (props) => {
    //~~~~~~~~~Hard Coded~~~~~~~~~
    // const data = [
    //     {_id: '1', name: 'Patrick Star', email: 'pstar@gmail.com', salary: '$1.00', phone: '696969', position: 'VIP Customer', picture: 'https://i.imgflip.com/1af99v.jpg'},
    //     {_id: '2', name: 'Spongebob Squarepants', email: 'sbsp@gmail.com', salary: '$3.00', phone: '696969', position: 'Head Chef', picture: 'https://cdn.shopify.com/s/files/1/0150/0643/3380/products/Viacom_Spongebob_SubTotePRTGENSOG16_00013_RO_800x.jpg?v=1581618420'},
    //     {_id: '3', name: 'Eugene H. Krabs', email: 'ehk@gmail.com', salary: '$4.20', phone: '696969', position: 'Manager', picture: 'https://i.kym-cdn.com/entries/icons/facebook/000/026/111/4917038d8bbd7fe362bed691690c7da4.jpg'},
    // ]

    // ~~~~~ Dynamic Data ~~~~~~~~
    // const [data, setData] = useState([]);
    // const [loading, setLoading] = useState(true);

    // ~~~~~~~~~~~~~REDUX~~~~~~~~~~~~~~~~~
    // const data = useSelector(state => state)
    // const {data, loading} = data;
    const dispatch = useDispatch();
    const {data, loading} = useSelector((state) => {
        return state;
    })

    const fetchData = () => {
        fetch("http://10.0.2.2:3000/")
        .then(res =>res.json())
        .then(results => {
            // setData(results)
            // setLoading(false)
            dispatch({ type: 'ADD_DATA', payload: results })
            dispatch({ type: 'SET_LOADING', payload: false })
        }).catch(err =>{
            Alert.alert('Something went wrong')
        })
    }

    useEffect(()=> { //fetches data from mongodb and saves it to data
        fetchData()
    }, [])

    console.log('d')
    return (
        <View style = {styles.root}>
            {loading? 
                <ActivityIndicator size = 'large' color = '#0000ff'/> 
                :
                <FlatList
                    onRefresh = {() => fetchData()}
                    refreshing = {loading}
                    data = {data}
                    keyExtractor = {datum => datum._id}
                    renderItem = {({item}) => {
                        return(
                            <Card 
                                onPress = {() => props.navigation.navigate('Profile', {item: item})}
                                style = {styles.myCard}>
                                <View style = {styles.cardView}>
                                    <Image
                                        style = {styles.imageStyle}
                                        source = {{uri: item.picture}}
                                    />
                                    <View style = {{ marginLeft: 15 }}>
                                        <Text style = {styles.textStyle}>{item.name}</Text>
                                        <Text style = {styles.textStyle}>{item.position}</Text>
                                    </View>
                                </View>
                            </Card>
                        )
                    }} 
                />
            }
            <FAB 
                onPress = {() => props.navigation.navigate('Create')}
                style={styles.fab}
                small = {false}
                animated
                theme = {{colors: {accent: "#006aff"}}}
                icon="plus"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    myCard: {
        margin: 5,
        padding: 5,
        flexDirection: 'row'
    },
    cardView: {
        flexDirection: 'row',
        padding: 6
    },
    imageStyle: {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    textStyle: {
        fontSize: 20
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
      },
  });

export default Home;
