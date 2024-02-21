import { StatusBar } from 'expo-status-bar';
import {Appearance} from 'react-native';
import { Button, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import logo from './assets/logo.png'
import logoLight from './assets/logoLight.png'
import quickTracker from './assets/quickTracker.png'

const darkMode =  true ?? Appearance.getColorScheme() === 'dark'

const ONE_MILLION = 1_000_000
const ONE_TRILLION = 1_000_000_000_000
const UNITS = ["", "s", "ms", "mn", "hour", "day", "week", "month", "year", "lbs", "oz", "g", "kg", "mg", "m", "ft", "cm", "in", "km", "mi", "L", "mL", "°C", "°F", "K", "$", "€", "£", "¥", "₳", "₯", "₪", "฿", "원", "₫", "₮", "₱","₣", "₹", "د.ك", "د.إ", "﷼", "₻", "₽","₲", "₾", "₺", "₸", "F", "₵", 'Other']


export default function App() {
  const projects = []
  const [quickMode, setQuickMode] = useState (false)
  const [editMode, setEditMode] = useState (false)
  const [count, setCount] = useState (0)
  const [step, setStep] = useState (1)
  const [units, setUnits] = useState (UNITS)
  const [unit, setUnit] = useState (0)
  const [newUnit, setNewUnit] = useState ("")
  const [newStep, setNewStep] = useState (1)
  const [maxed, setMaxed] = useState (false)

  function fontSize() {
    const length = Math.floor(Math.log10(Math.abs(count))+1)
    if(length > 3) {
      return 90 - length - 3 * 13
    } else {
      return 90
    }
  }

  fontSize()
  return (
    <>
    <View style={styles.container}>
      <TouchableOpacity style={styles.logo} onPress={() => {setQuickMode(false) && setEditMode(false)}}>
        <Image style={{width: "100%", height: "100%"}} source={darkMode ? logoLight : logo}/>
      </TouchableOpacity>
      <View style={styles.main}>
        <Text style={styles.placeholder}>nothing saved...</Text>
      </View>
      <View style={styles.projects}><TouchableOpacity style={styles.new}><Text style={{fontSize: 20, opacity: .5}}>Yes</Text></TouchableOpacity><Text style={styles.buttonPrompt}>Track something new?</Text></View>
      <TouchableOpacity onPress={() => setQuickMode(!quickMode)}  style={styles.quickTrackerButton}><Image style={styles.quickTrackerLogo} source={quickTracker}/></TouchableOpacity>
      <View style={{...styles.quickTracker, display: quickMode ? "block": "none"}} >
        <View style={styles.advanced}> 
          <TouchableOpacity onLongPress={() => setEditMode(true)} onPress={() => {
            step < 9.5 ? setStep(step+1): setStep(step === 9.5 ? 1 : 0.5)
          }} style={styles.step}><Text style={{opacity: .8, fontSize: 16, color: "#FEFEFE"}}>Step</Text><Text style={styles.stepText}>{step}</Text></TouchableOpacity>
          <TouchableOpacity onLongPress={() => setEditMode(true)} onPress={() => {
            setUnit((unit+1)%(units.length))
          }} style={styles.unit}><Text style={{opacity: .8, fontSize: 16, color: "#FEFEFE"}}>Unit</Text><Text style={styles.unitText}>{units[unit] || "N/A"}</Text></TouchableOpacity>
        </View>
        <TouchableOpacity onLongPress={() => setEditMode(true)} onPress={() => maxed ? setCount(0) : count < ONE_TRILLION && setCount(count + step)} style={styles.tracked}><Text style={{color: maxed ? "#bb3333" : "#fefefe", fontSize: fontSize()}}>{format(count, maxed, setMaxed)}</Text></TouchableOpacity>
        <View style={styles.controls}> 
          <TouchableOpacity onPress={() =>  count > -1 * ONE_TRILLION && setCount(count - step)} style={styles.minus}><Text style={{color: "#FFF", fontSize: 35, opacity: .8}}>-</Text></TouchableOpacity>
          <TouchableOpacity onPress={() =>  count < ONE_TRILLION && setCount(count + step)}  style={styles.plus}><Text style={{color: "#FFF", fontSize: 35, opacity: .8}}>+</Text></TouchableOpacity>
        </View>
        {/* <TouchableOpacity onPress={() => setEditMode(true)} style={styles.more}><Text style={styles.more}>more options ?</Text></TouchableOpacity> */}
      </View>
        <View style={{...styles.editor, display: editMode ? "flex":"none"}}>
          <View style={{...styles.advanced, zIndex: 1}}> 
            <TouchableOpacity style={styles.step}><Text style={{opacity: .8, fontSize: 16, color: "#FEFEFE"}}>Step</Text><TextInput placeholder="?" placeholderTextColor="#fff" value={newStep} onChangeText={(val) => val < ONE_MILLION ? !isNaN(parseInt(val)) && setNewStep(parseInt(val)) : setNewStep(0)} style={{...styles.stepText, padding: 0}}/></TouchableOpacity>
            <TouchableOpacity style={styles.unit}><Text style={{opacity: .8, fontSize: 16, color: "#FEFEFE"}}>Unit</Text><TextInput placeholder="?" placeholderTextColor="#fff" value={newUnit} style={styles.unitText} onChangeText={(val) => setNewUnit(val.toLowerCase())}/></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => maxed && setCount(0)} style={{...styles.tracked, marginBottom: 90, zIndex: 1}}><TextInput style={{color: "#FFF", fontSize: fontSize(), color: maxed ? "#bb3333" : "#fefefe"}} editable={!maxed} onChangeText={(val) => val ? !isNaN(parseInt(val)) && setCount(parseInt(val.replace(/[^0-9.-]/g, ''))) : setCount(0)} value={format(count, maxed, setMaxed)}/></TouchableOpacity>
          <TouchableOpacity onPress={() => {
            if(newStep) {
              setStep(newStep)
              setNewStep(1)
            }
            if(newUnit) {
              setUnits([...units, newUnit])
              setUnit(units.length)
              setNewUnit("")
            }
            setEditMode(false)
            }} style={styles.exit}></TouchableOpacity>
        </View>
    </View>
      <StatusBar style={darkMode ? "light" : "dark"} />
    </>
  );
}

function ProjectList({item}) {
  return (
     <View>
      <Text>{item.value}</Text>
    </View>
  )
}

function NewProject({setNewMode}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  return (
    <View style={newStyle.form}>
      <Text style={{fontSize: 25, fontWeight: 300}}>New Project</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="name"
        style={newStyle.input}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="description"
        style={newStyle.input}
      />
      <Button title="Submit" onPress={() => setNewMode(false)} />
    </View>
  )
}

// alert(Appearance.getColorScheme())

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkMode ? "#0c413a" : '#e5fedc',
  },
  main: {
    width: "100%",
    height: "60%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  projects: {
    width: "100%",
    height: "40%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
    position: "absolute",
    bottom: 0,
  },
  new: {
    borderRadius: 12,
    width: "30%",
    backgroundColor: 'green',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowOpacity: .2,
    shadowColor: "black",
    shadowRadius: 5,
    elevation: 10,
    opacity: .8
  },
  cancel: {
    borderRadius: 12,
    width: "30%",
    backgroundColor: '#bb3333',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: "20%",
    height: "12%",
    marginTop: 40,
    marginLeft: "auto",
    marginRight: "auto",
    zIndex: 100
  },
  quickTracker: {
    width: "100%",
    height: "100%",
    backgroundColor: darkMode ? "#0c413a" : '#e5fedc',
    position: "absolute",
    top: 0,
    left: 0,
    display: "none",
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickTrackerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    width: 50,
    height: 50,
    borderRadius: 25,
    filter: "invert(1)",
    position: "absolute",
    bottom: "10%",
    right: 20,
    shadowOpacity: .5,
    shadowColor: "black",
    shadowRadius: 5,
    elevation: 15,
    opacity: .8
  },
  quickTrackerLogo: {
    width: 30,
    height: 30,
    opacity: .4,
  },
  placeholder: {
    fontSize: 14, 
    opacity: .5,
    color: darkMode ? "#FEFEFE" : "#000",
  },
  buttonPrompt: {
    fontSize: 16,
    color: darkMode ? "rgba(255, 255, 255, .7)" : "rgba(0,0,0,.7)",
  },
  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
  },
  advanced: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
    marginBottom: 40,
  },
  tracked: {
    borderRadius: 12,
    width: "80%",
    height: "40%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#111",
    marginBottom: 40,
  },
  plus: {
    width: 80,
    height: 50,
    backgroundColor: "green",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    shadowOpacity: .2,
    shadowColor: "black",
    shadowRadius: 5,
    elevation: 10
  },
  minus: {
    width: 80,
    height: 50,
    backgroundColor: "#bb3333",
    opacity: .8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: .2,
    shadowColor: "black",
    shadowRadius: 5,
    elevation: 10,
  },
  step: {
    padding: 5,
    width: 80,
    height: 60,
    backgroundColor: "green",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: "rgba(0,0,0,.5)",
    shadowOpacity: .2,
    shadowColor: "black",
    shadowRadius: 5,
    elevation: 10,
  },
  unit: {
    padding: 5,
    width: 80,
    height: 60,
    backgroundColor: "green",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: .2,
    shadowColor: "black",
    shadowRadius: 5,
    elevation: 10
  },
  stepText: {
    padding: 3,
    opacity: .75, 
    color: "#FEFEFE",
    fontSize: 18, 
    textAlign: "center",
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,.2)",
    // borderRadius: 5,
  },
  unitText: {
    padding: 3,
    opacity: .75, 
    color: "#FEFEFE",
    fontSize: 18, 
    textAlign: "center",
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,.2)",
    // borderRadius: 5
  },
  more: {
    opacity: .8,
    position: "absolute",
    bottom: "10%",
    alignItems: 'center',
    textAlign: "center",
    fontSize: 13,
    color: darkMode ? "#FEFEFE" : "#006700",
  },
  editor: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, .5)",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    zIndex: 101
  },
  exit: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
  }
});

const newStyle = StyleSheet.create({
  form: {
    marginTop: 50,
    width: "80%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
  }
})

function format(count, maxed, setMaxed) {
  const zeros = Math.floor(Math.log10(Math.abs(count)))
  const tags = ["M","B", "T"]
  switch(zeros) {
    case 12:
      if(!maxed) setMaxed(true)
      return `MAX`
    default:
      if(maxed) setMaxed(false)
  }
  return count.toLocaleString('en-US')
}