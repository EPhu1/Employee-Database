import React from 'react';
import { StyleSheet, Text, View, Image, Linking, Platform, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Title, Card } from 'react-native-paper';
import { MaterialIcons, Entypo } from '@expo/vector-icons';

const Profile = (props) => {
    const { _id, name, picture, phone, salary, email, position} = props.route.params.item;
    console.log(_id)
    const deleteEmployee = () => {
        fetch("http://10.0.2.2:3000/delete",{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: _id //we are referring to the id in server/app.js
            })
        })
        .then(res=>res.json())
        .then(deletedEmployee=>{
            Alert.alert(`${deletedEmployee.name} has been deleted.`)
        })
        .catch(err =>{
            Alert.alert('Error deleting')
        })
    }
    const openDial = () => {
        if(Platform.OS == 'android'){
            Linking.openURL(`tel: ${phone}`)
        }
        else{
            Linking.openURL(`teleprompt: ${phone}`)
        }
    }

    return(
        <View style = {styles.root}>
            <LinearGradient
                colors = {['#0033ff', '#6bc1ff']}
                style = {{height: '20%'}}
            />
            <View style = {{alignItems: 'center'}}>
                <Image
                    style = {styles.imageStyle}
                    source = {{uri: picture}}
                />
            </View>
            <View style = {{alignItems: 'center', marginBottom: 5}}>
                <Title>{name}</Title>
                <Text style = {{fontSize: 15}}>{position}</Text>
            </View>
            <Card style = {styles.myCard}>
                <View style = {styles.cardContent}>
                    <Entypo name = 'briefcase' size = {32} color = '#006aff'/>
                    <Text style = {styles.myText}>{position}</Text>
                </View>
            </Card>
            <Card style = {styles.myCard} onPress = {() => Linking.openURL(`mailto:${email}`)}>
                <View style = {styles.cardContent}>
                    <MaterialIcons name = 'email' size = {32} color = '#006aff'/>
                    <Text style = {styles.myText}>{email}</Text>
                </View>
            </Card>
            <Card style = {styles.myCard} onPress = {() => openDial()}>
                <View style = {styles.cardContent}>
                    <Entypo name = 'phone' size = {32} color = '#006aff'/>
                    <Text style = {styles.myText}>{phone}</Text>
                </View>
            </Card>
            <Card style = {styles.myCard}>
                <View style = {styles.cardContent}>
                    <MaterialIcons name = 'attach-money' size = {32} color = '#006aff'/>
                    <Text style = {styles.myText}>{salary}</Text>
                </View>
            </Card>
            <View style = {styles.buttonView}>
                <Button 
                    icon = "account-edit" 
                    onPress={() => {
                        props.navigation.navigate('Create', { _id, name, picture, phone, salary, email, position})
                    }} 
                    mode="contained" 
                    theme = {{colors: {primary: "#006aff"}}}>
                    edit
                </Button>
                <Button 
                    icon = "delete" 
                    onPress={() => {
                        deleteEmployee()
                    }} 
                    mode="contained" theme = {{colors: {primary: "#006aff"}}}>
                    delete
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    imageStyle: {
        width: 140,
        height: 140, 
        borderRadius: 140/2,
        marginTop: -50
    },
    myCard: {
        marginHorizontal: 10,
        marginVertical: 5
    },
    cardContent: {
        flexDirection: 'row',
    },
    myText: {
        fontSize: 15, 
        marginTop: 3,
        marginLeft: 10
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 5
    }
})

export default Profile;