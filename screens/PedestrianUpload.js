import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, TextInput, FlatList } from "react-native";
import tw from "tailwind-react-native-classnames";
import Map from "../components/Map";
import { createStackNavigator } from "@react-navigation/stack";
import NavigateCard from "../components/NavigateCard";
import RideOptionsCard from "../components/RideOptionsCard";
import { useNavigation } from "@react-navigation/native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import {
  selectOrigin,
  selectDestination,
  setTravelTimeInformation,
} from "../slices/navSlice";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { SafeAreaView, Modal, Image, ScrollView } from "react-native";
import { setDestination } from "../slices/navSlice";
//import NavFavourites from './NavFavourites';
import { icons, SIZES, COLORS, FONTS, images } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { MaterialIcons } from "@expo/vector-icons";
//import Button from '../components/Button';
import ImagePickerExample from "../components/ImagePickerExample";
import { Button } from "react-native-paper";
import UploadAnimation from "./UploadAnimation";
import { showMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import Card from '../components/card';
import TextAvatar from '../components/textAvatar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import Icon from '@expo/vector-icons/Ionicons'
import Icon1 from '@expo/vector-icons/EvilIcons'

import { Video } from 'expo-av';
import { Audio } from 'expo-av';
import ModalPopup from '../components/ModalPopup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

  const colors = {
    gray: '#D1D3D2',
    darkGray: '#676767',
    orange: '#F35D38',
    black: '#0C0D0E',
    white: '#FBFCFE',
  };

  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;


const MapScreen = () => {
  const Stack = createStackNavigator();
  const navigation = useNavigation();

  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const mapRef = useRef(null);
  const dispatch = useDispatch();



  useEffect(() => {
    if (!origin || !destination) return;

    // Zoom and fit to markers
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [origin, destination]);

  useEffect(() => {
    if (!origin || !destination) return;

    const getTravelTime = async () => {
      fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&key=${GOOGLE_MAPS_APIKEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
        });
    };

    getTravelTime();
  }, [origin, destination, GOOGLE_MAPS_APIKEY]);

  const [image, setImage] = useState(null);
  const [image1, setImage1] = useState(null);

  const [camera, setShowCamera] = useState(false);
  const [camera1, setShowCamera1] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [cameraRef1, setCameraRef1] = useState(null);
  const [type1, setType1] = useState(Camera.Constants.Type.back);

  const [garbagenum, setGarbageNum] = useState(0);

  const [upload1, setUpload1] = useState(false);
  const [upload2, setUpload2] = useState(false);
  const [upload3, setUpload3] = useState(false);

  const [finishmodal, setFinishModal] = useState(false);

  const [showbottom, setshowbottom] = useState(true);
  // const [useCamera, setUseCamera] = useState(false);
  const [selectUploadOption, setSelectUploadOption] = useState(true);
  const [videoOption, setVideoOption] = useState(false);
  const [cameraOption, setCameraOption] = useState(false);
  const [comment, setComment] = useState("");
  const [visible, setVisible] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('Cleaning Issue');


  const changeRole = value => {
    if (value != selectedValue) {
      setVisible(false);
      setTimeout(() => {
        setSelectedValue(value);
      }, 400);
    }
  };


  const data = [{ id: 1 }, { id: 2 }];

  const [data1, setData] = React.useState({
    username: '',
    
  });

  const [activeTab, setActiveTab] = useState('tab1'); // State to track active tab

    // Function to handle tab press
    const handleTabPress = (tabName) => {
      setActiveTab(tabName);
    };

    const textInputChange = val => {
      setData({
        ...data1,
        username: val,
      });
    };


    const cameraVideoAction = type => {
      setSelectUploadOption(false)

      if(type == 'camera')
      {

        setCameraOption(true)
        setVideoOption(false)


      }

      if(type == 'videocam')
      {

        setCameraOption(false)
        setVideoOption(true)


      }


    };



  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [audioURI, setAudioUri] = React.useState("");


  async function getAudioURI() {
    const assets = await MediaLibrary.getAssetsAsync({
        first: 1,
        mediaType: ["audio"],
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
    });
    console.log(assets)
    const audioURI = assets.assets[0].uri;
    setAudioURI(audioURI)
    return audioURI;
  }

  async function startAudioRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopAudioRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    });

    MediaLibrary.saveToLibraryAsync(recording.getURI()).then(() => {
        console.log(recording.getURI())
      });

    setAudioUri(recording.getURI())


     

    setRecordings(updatedRecordings);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
          <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
        </View>
      );
    });
  }


    const selectOptionData = [
      {
        id: '123',
        title: 'Upload Picture',
        image: 'https://links.papareact.com/3pn',
        screen: 'FieldTasks',
        icon: 'camera'
      },
    
      {
          id: '568',
          title: 'Upload Video',
          image: 'https://links.papareact.com/3pn',
          screen: 'MapView',
          icon: 'videocam'
    
        },
    
    
    ];



  let VideoRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();
  const [videoURI, setVideoURI] = useState('');
  const [videoOn, setVideoOn] = useState(false)


  

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    let x = await AsyncStorage.getItem('audio_file')
    console.log(x)
    const sound = new Audio.Sound();
    await sound.loadAsync({ x });
    await sound.playAsync();
    })();
  }, []);

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <Text>Requestion permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>
  }

  let recordVideo = () => {
    setIsRecording(true);
    let options = {
      quality: "1080p",
      maxDuration: 60,
      mute: false
    };

    VideoRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
    });
  };

  async function stopRecording(){
    setIsRecording(false);
    setVideoOn(false)
    VideoRef.current.stopRecording();
    // getVideoURI()


  };

  


  async function playAudio(){
    const assets = await MediaLibrary.getAssetsAsync({
        first: 1,
        mediaType: ["audio"],
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
    });
    const audioUri = assets.assets[0].uri;

    console.log(assets)

    const playbackObject = new Audio.Sound();
    await playbackObject.loadAsync({ uri: audioUri});
    await playbackObject.playAsync();

  }

  async function getVideoURI() {
    const assets = await MediaLibrary.getAssetsAsync({
        first: 1,
        mediaType: ["video"],
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
    });
    const videoURI = assets.assets[0].uri;
    setVideoURI(videoURI)
    return videoURI;
  }

  let savePhoto = (uri) => {
    MediaLibrary.saveToLibraryAsync(uri).then(() => {
      console.log("PHOTO SAVED")
    });
  };

  if (video) {
    let shareVideo = () => {
      shareAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };

    let saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        setVideo(undefined);
        getVideoURI()
      });
    };

    



  

    

    return (
      <SafeAreaView style={styles.container}>
        <Video
          style={styles.video}
          source={{uri: video.uri}}
          useNativeControls
          resizeMode='contain'
          isLooping
        />
        {hasMediaLibraryPermission ? <Button title="Save" onPress={saveVideo} /> : undefined}
        <Button title="Discard" onPress={() => setVideo(undefined)} />
        <Button
          style={{
            width: "100%",
            marginTop: 16,
            marginBottom: 20,
            zIndex: 9999,

          }}
          icon="camera"
          mode="contained"
          onPress={() => {
            saveVideo()
            // setVideo(undefined)
            
          }}
        >
                 CONTINUE   
        </Button>
      </SafeAreaView>
    );
  }


  



  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate("PedestrianDashboard")}
        style={tw`bg-gray-100 absolute top-5 left-8 z-50 p-3 rounded-full shadow-lg`}
      >
        <Icon name="arrow-back-outline" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("SignInScreen")}
        style={tw`bg-gray-100 absolute top-5 right-8 z-50 p-3 rounded-full shadow-lg`}
      >
        <Icon name="power-sharp" />
      </TouchableOpacity>

      <ScrollView style={tw`h-1/2`}>
        <FlashMessage position="top" style={{ width: 400, marginTop: 0 }} />
        {!showbottom && (
          <Image
            source={require("../assets/images/success.png")}
            style={{ width: 200, height: 200, marginTop: 100, marginLeft: 90 }}
          />
        )}

        <Text
          style={{
            marginLeft: 95,
            marginTop: 25,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {" "}
          PEDESTRIAN UPLOAD
        </Text>

        <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <View style={{ height: 300, justifyContent: "center", alignItems: "center", marginTop: 30 }}>

          {selectUploadOption && <FlatList
            data={selectOptionData}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => cameraVideoAction(item.icon)}
                style={tw` w-48 h-40`}
                horizontal
                >
                <View style={styles.centered}>

                  <Text style={tw`mt-2 text-lg font-semibold`}>{item.title}</Text>
                  <Icon
                    style={tw`p-2 bg-violet-900 rounded-full w-13 mt-4`}
                    name={item.icon}
                    size={35}
                    color="rgb(59,34,138)"
                  />
                </View>
              </TouchableOpacity>
            )}
          />}






            {cameraOption && (
              <>
                <View
                  style={{
                    backgroundColor: "#eeee",
                    width: 200,
                    height: 200,
                    borderRadius: 0,

                    justifyContent: "center", alignItems: "center"
                  }}
                >
                  <Button
                    style={{
                      width: "100%",
                      marginTop: 16,
                      marginBottom: 20,
                      zIndex: 9999,

                    }}
                    icon="camera"
                    mode="contained"
                    onPress={() => {
                      setShowCamera(true);
                    }}
                  >
                    UPLOAD IMAGE
                  </Button>

                  <Image
                    source={{ uri: image }}
                    style={{ width: 200, height: 200, borderRadius: 0 }}
                  />
                </View>
              </>
            )}



{videoOption && (
              <>
                <View
                  style={{
                    backgroundColor: "#eeee",
                    width: 200,
                    height: 200,
                    borderRadius: 0,

                    justifyContent: "center", alignItems: "center"
                  }}
                >
                  {videoURI== "" && <><Button
                    style={{
                      width: "100%",
                      marginTop: 16,
                      marginBottom: 20,
                      zIndex: 9999,

                    }}
                    icon="camera"
                    mode="contained"
                    onPress={() => {
                      setVideoOn(true);
                    }}
                  >
                    UPLOAD VIDEO
                  </Button>

                  <Button
                  style={{
                    width: "100%",
                    marginTop: 16,
                    marginBottom: 20,
                    zIndex: 9999,

                  }}
                  icon="camera"
                  mode="contained"
                  onPress={() => {
                    navigation.navigate("CameraPrediction")
                  }}
                  >
                  ANALYZE LIVE VIDEO
                  </Button>

                  </>



                  
                  
                  }

                  {videoURI!= "" && <Video
                    source={{ uri: videoURI }}
                    style={{ width: 300, height: 300 }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                    autoplay={true}
                  />}
                </View>
              </>
            )}
          </View>
        </View>

        {/* {video && <Camera style={styles.videocontainer} ref={VideoRef}>
         <View style={styles.buttonContainer}>
           <Button title={isRecording ? "Stop Recording" : "Record Video"} onPress={isRecording ? stopRecording : recordVideo} />
         </View>
       </Camera>} */}


       {videoOn && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => {
              setVideoOn(false);
            }}
          >
            <Camera style={{ flex: 1 }} ref={VideoRef}>
            <View style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  justifyContent: "flex-end",
                }}>

                <View
                  style={{
                    backgroundColor: "black",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  
              <Button
                    icon={isRecording ? "close" : "camera"}
                    style={{ marginLeft: 12 }}
                    mode="outlined"
                    // color="white"
                    onPress={isRecording ? stopRecording : recordVideo}
                  >
                    {isRecording ? "Stop Recording" : "Record Video"}
                  </Button>
            </View>
            </View>
              
            </Camera>
          </Modal>
        )}


        {camera && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => {
              setShowCamera(false);
            }}
          >
            <Camera
              style={{ flex: 1 }}
              ratio="16:9"
              flashMode={Camera.Constants.FlashMode.off}
              type={type}
              ref={(ref) => {
                setCameraRef(ref);
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    backgroundColor: "black",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    icon="close"
                    style={{ marginLeft: 12 }}
                    mode="outlined"
                    color="white"
                    onPress={() => {
                      setShowCamera(false);
                    }}
                  >
                    Close
                  </Button>
                  <TouchableOpacity
                    onPress={async () => {
                      if (cameraRef) {
                        let photo = await cameraRef.takePictureAsync();
                        setImage(photo.uri);
                        savePhoto(photo.uri);
                        setShowCamera(false);

                      }
                    }}
                  >
                    <View
                      style={{
                        borderWidth: 2,
                        borderRadius: 50,
                        borderColor: "white",
                        height: 50,
                        width: 50,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 16,
                        marginTop: 16,
                      }}
                    >
                      <View
                        style={{
                          borderWidth: 2,
                          borderRadius: 50,
                          borderColor: "white",
                          height: 40,
                          width: 40,
                          backgroundColor: "white",
                        }}
                      ></View>
                    </View>
                  </TouchableOpacity>
                  <Button
                    icon="axis-z-rotate-clockwise"
                    style={{ marginRight: 12 }}
                    mode="outlined"
                    color="white"
                    onPress={() => {
                      setType(
                        type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back
                      );
                    }}
                  >
                    {type === Camera.Constants.Type.back ? "Front" : "Back "}
                  </Button>
                </View>
              </View>
            </Camera>
          </Modal>
        )}

        
      </ScrollView>

      <ScrollView vertical style={tw`h-1/2`}>
      <Text style={{alignItems: "center", justifyContent: "center", alignSelf: "center", fontSize: 13, fontWeight: "bold", paddingLeft: 0, marginBottom: 20}}>
        RECORD AUDIO
        </Text>

        <Button
                    // icon="axis-z-rotate-clockwise"
                    style={{ marginRight: 12, width: "50%", alignSelf: "center" }}
                    mode="outlined"
                    // color="white"
                    onPress={recording ? stopAudioRecording : startAudioRecording}
                  >
                    {recording ? 'Stop Recording' : 'Start Recording'}
                  </Button>

        
      {/* {getRecordingLines()} */}

      {/* <Button title="Use saved video" onPress={() => {
        const videoURI = getVideoURI();
      }} /> */}

      {audioURI!="" && <Button
                    style={{
                      marginTop: 10,
                      alignContent: "center",
                      justifyContent: "center",
                      paddingLeft: 10,
                      borderRadius: 100,
                      alignItems: "center"

                      // marginBottom: 20,

                    }}
                    icon="play"
                    onPress={() => {
                      const audioURI = playAudio();
                      
                    }}
                  >
                  </Button>}

                  <ModalPopup visible={visible}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header_modal}>
            <Text style={(styles.text_footer, {fontWeight: 'bold'})}>
              SELECT THE ISSUE
            </Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons
                name="close-outline"
                size={24}
                color="#52575D"></Ionicons>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.containerButton}>
          <View>
            <BouncyCheckbox
              isChecked={selectedValue == 'Cleaning Issue'}
              textColor="blue"
              borderColor="black"
              fillColor="#40c164"
              key={Math.random()}
              onPress={checked => changeRole('Cleaning Issue')}></BouncyCheckbox>
          </View>
          <Text style={styles.text_footer}>Cleaning Issue</Text>

        </View>

        <View style={styles.containerButton}>
                  <View>
                    <BouncyCheckbox
                      isChecked={selectedValue == 'Safety Issue'}
                      textColor="blue"
                      borderColor="black"
                      fillColor="#40c164"
                      key={Math.random()}
                      onPress={checked => changeRole('Safety Issue')}></BouncyCheckbox>
                  </View>
                  <Text style={styles.text_footer}>Safety Issue</Text>

                </View>

                <View style={styles.containerButton}>
          <View>
            <BouncyCheckbox
              isChecked={selectedValue == 'Fire Issue'}
              textColor="blue"
              borderColor="black"
              fillColor="#40c164"
              key={Math.random()}
              onPress={checked => changeRole('Fire Issue')}></BouncyCheckbox>
          </View>
          <Text style={styles.text_footer}>Fire Issue</Text>

        </View>
      </ModalPopup>

      


          <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: "white",
            marginTop: 30,
            paddingBottom: 20,
            paddingLeft: 50,
            paddingRight: 50,
            borderRadius: 50,
            width: "90%",
            marginLeft: 20
          },
        ]}>
      <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}>
          Username
        </Text>
        <View style={styles.action}>
          <Icon name="location-outline" color={colors.text} size={25} style={{marginBottom: 3, paddingBottom: 3,}} />
          <TouchableOpacity onPress={() => setVisible(true)} style={{alignSelf: "center", justifyContent: "center", marginLeft: 40}}>
              <TextInput
                editable={false}
                style={styles.text_footer}
                autoCapitalize="none"
                defaultValue={selectedValue}
              />
            </TouchableOpacity>
          
        </View>
      </Animatable.View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: "white",
            marginTop: 30,
            paddingBottom: 20,
            paddingLeft: 50,
            paddingRight: 50,
            borderRadius: 50,
            width: "90%",
            marginLeft: 20
          },
        ]}>
      <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}>
          Username
        </Text>
        <View style={styles.action}>
          <Icon name="location-outline" color={colors.text} size={25} style={{marginBottom: 3, paddingBottom: 3}} />
          <TextInput
            autoCompleteType="username"
            placeholder={'Location'}
            // value={data['username']}
            placeholderTextColor="#666666"
            style={[
              styles.textInput,
              {
                color: "black",
              },
            ]}
            value="         12° 55' 48'',   77° 43' 12''"
            editable={false}
            autoCapitalize="none"
            onChangeText={val => textInputChange(val)}
            //onEndEditing={e => handleValidUser(e.nativeEvent.text)}
          />
          
        </View>
      </Animatable.View>


      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: "white",
            marginTop: 30,
            paddingBottom: 20,
            paddingLeft: 50,
            paddingRight: 50,
            borderRadius: 50,
            width: "90%",
            marginLeft: 20
          },
        ]}>
      <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}>
          Username
        </Text>
        <View style={styles.action}>
          <Icon1 name="comment" color={colors.text} size={25} style={{marginBottom: 3, paddingBottom: 3}} />
          <TextInput
            autoCompleteType="username"
            placeholder={'Additional Comments'}
            // value={data['username']}
            placeholderTextColor="#666666"
            style={[
              styles.textInput,
              {
                color: "black",
              },
            ]}
            value={comment}
            onChangeText={val => setComment(val)}
            multiline={true}
            underlineColorAndroid='transparent'
    />
          
        </View>
      </Animatable.View>

      
      <ScrollView>
      {selectedValue=="Cleaning Issue" && <Animatable.View
        animation="fadeInUpBig"
        
        >
      <View style={styles.row}>
      <TextAvatar
        size={38}
        fontSize={18}
        text={"T"}
        color={"#3B228A"}
      />
      <View style={styles.mailText}>
        <Text style={[styles.title, styles.bold]}>CLEANLINESS SOCIAL MEDIA ANALYTICS</Text>
        <Text style={[styles.subTitle, styles.bold]}>
        {'\n'}{'\n'}🚀 "Impressed by the progress made towards achieving #WasteManagementGoals in #Bangalore. 
        {'\n'}{'\n'}
        Keep up the fantastic work, BBMP! Your efforts contribute significantly to a better tomorrow 🌱👍 
        
        {'\n'}{'\n'}
        #SustainableFuture #ZeroWaste"
        {'\n'}

        </Text>
        <Text style={[styles.subTitle]}>
        IMPACT: CRITICAL
        </Text>
      </View>
    </View>
    </Animatable.View>}

    {selectedValue=="Fire Issue" && <Animatable.View
        animation="fadeInUpBig"
        
        >
      <View style={styles.row}>
      <TextAvatar
        size={38}
        fontSize={18}
        text={"T"}
        color={"#3B228A"}
      />
      <View style={styles.mailText}>
        <Text style={[styles.title, styles.bold]}>FIRE SOCIAL MEDIA ANALYTICS</Text>
        <Text style={[styles.subTitle, styles.bold]}>
        {'\n'}🚨 BREAKING: Fire breaks out in a 3-storey building in Bangalore's CBD area 🚨 {'\n'}{'\n'}Firefighters on the scene, no casualties reported yet. 🚒 {'\n'}{'\n'}#BangaloreFire #FireIncident #CBD{'\n'}

        </Text>
        <Text style={[styles.subTitle]}>
        IMPACT: CRITICAL
        </Text>
      </View>
    </View>
    </Animatable.View>}

    {selectedValue=="Safety Issue" && <Animatable.View
        animation="fadeInUpBig"
        
        >
      <View style={styles.row}>
      <TextAvatar
        size={38}
        fontSize={18}
        text={"T"}
        color={"#3B228A"}
      />
      <View style={styles.mailText}>
        <Text style={[styles.title, styles.bold]}>POLICE SOCIAL MEDIA ANALYTICS</Text>
        <Text style={[styles.subTitle, styles.bold]}>
        {'\n'}{'\n'}🚨 Bengaluru law student suicide: National Law School forms expert panel to review mental health policy. 🚨
        
        {'\n'}{'\n'}
        Bangalore Police to provide support. 
        
        {'\n'}{'\n'}
        #BangalorePolice #MentalHealthMatters #LawStudentSuicide
        {'\n'}
        </Text>
        <Text style={[styles.subTitle]}>
        IMPACT: CRITICAL
        </Text>
      </View>
    </View>
    </Animatable.View>}
    </ScrollView>


    <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Button
            style={{ width: "50%", marginTop: 16, marginBottom: 10 }}
            icon="camera"
            mode="contained"
            onPress={() => {
              
              setshowbottom(false);
              showMessage({
                message: "TASK ANALYSIS IN PROGRESS",
                type: "success",
                icon: (props) => (
                  <Image
                    source={require("../assets/images/happy.png")}
                    {...props}
                  />
                ),
              });
              setTimeout(() => {
                setshowbottom(true);
                setImage(null);
                setImage1(null);
                navigation.navigate("TaskApproval")
              }, 2000);
            }}
          >
            RAISE ISSUE
          </Button>
        </View>

        

   
        </ScrollView>

        

    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backgroundImage: {
    height: height * 0.6,
    justifyContent: 'space-between',
  },
  descriptionWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: 20,
    borderRadius: 25,
    height: height * 1,
//    width: width * 0.5
  },
  backIcon: {
    marginLeft: 20,
    marginTop: 60,
  },
  titlesWrapper: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  itemTitle: {
    fontFamily: 'Lato-Bold',
    fontSize: 32,
    color: colors.white,
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    fontFamily: 'Lato-Bold',
    fontSize: 16,
    color: colors.white,
  },
  heartWrapper: {
    position: 'absolute',
    right: 40,
    top: -30,
    width: 64,
    height: 64,
    backgroundColor: colors.white,
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  descriptionTextWrapper: {
    marginTop: 30,
    marginHorizontal: 20,



  },
  descriptionTitle: {
    fontFamily: 'Lato-Bold',
    fontSize: 24,
    color: colors.black,
  },
  descriptionText: {
    marginTop: 20,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    color: colors.darkGray,
  },
  infoWrapper: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  infoItem: {},
  infoTitle: {
    fontFamily: 'Lato-Bold',
    fontSize: 12,
    color: colors.black,
  },
  infoTextWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 5,
  },
  infoText: {
    fontFamily: 'Lato-Bold',
    fontSize: 24,
    color: colors.orange,
  },
  infoSubText: {
    fontFamily: 'Lato-Bold',
    fontSize: 14,
    color: colors.gray,
  },
  buttonWrapper: {
    marginHorizontal: 20,
    marginTop: 40,
    backgroundColor: colors.orange,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: 'Lato-Bold',
    fontSize: 18,
    color: colors.white,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    width: "90%",
    marginLeft: 20,
    borderRadius: 50,
    marginTop: 30
  },
  mailText: {
    marginLeft: 15,
    width: '80%',
  },
  bold: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
  },
  subTitle: {
    fontSize: 13,
  },
  ext_header: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
//    backgroundColor: "#ffc2c2",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end"
  },
  video: {
    flex: 1,
    alignSelf: "stretch"
  },
  videocontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header_modal: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
  },
  containerButton: {
    // flex: 1,
    flexDirection: 'row',
    margin: 0,
    marginBottom: 10,
    // justifyContent: 'space-between',
  },
  buttonModal: {
    width: '90%',
    height: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginBottom: 35,
    marginTop: 40,
  },
  buttonMod: {
    width: '90%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 35,
    marginTop: 35,
  },
  mainViewModalTC: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  text_footerModal: {
    color: '#05375a',
    fontSize: 18,
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  
});