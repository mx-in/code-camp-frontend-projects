import React, { useEffect, useState } from 'react';
import './drum.scss';

const generateKey = (key, name, url) => {
  return {
    key,
    name,
    url,
  }
}

const PADS = [
  generateKey('Q', 'Heater 1', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'),
  generateKey('W', 'Heater 2', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'),
  generateKey('E', 'Heater 3', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'),
  generateKey('A', 'Heater 4', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'),
  generateKey('S', 'Clap', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'),
  generateKey('D', 'Open-HH', "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"),
  generateKey('Z', 'Kick-n\'Hat', 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'),
  generateKey('X', 'Kick', 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'),
  generateKey('C', 'Closed-HH', 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'),
]
const Audio = React.forwardRef((props, ref) => {
  const { src, key } = props
  return (
    <audio
      src={src}
      id={key}
      className='clip'
      ref={ref}
    />
  )
})

function Pad(props) {
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return function () {
      document.removeEventListener('keydown', handleKeyPress)
    }
  })

  const handleKeyPress = (e) => {
    info.key === e.key.toUpperCase() && playSound()
  }

  const ref = React.createRef()

  const playSound = () => {
    props.updateDisplay && props.updateDisplay(info.name)
    // const audio = document.getElementById(info.key)
    // audio.play()
    ref.current.play();
  }
  const { info } = props
  return (
    <div className='drum-pad' onClick={playSound}>
      <Audio
        src={info.url}
        key={info.key}
        ref={ref}
      />
      <div>
        {info.key}
      </div>
    </div>
  )
}

function Bank(props) {
  if (!props.pads || !props.pads.length) return (<></>)
  const { pads } = props

  return (
    <div className='bank'>
      {pads.length && pads.map((info) => (
        <Pad key={info.key} info={info} updateDisplay={props.updateDisplay} />
      ))}
    </div>
  )
}

function Drum() {

  const [displayName, setDisplayName] = useState('unset');
  const updateDisplay = (name) => {
    setDisplayName(name)
  }

  return (
    <div className="App">
      <div id='drum-machine'>
        <div id='display'>
          {displayName}
        </div>
        <Bank pads={PADS} updateDisplay={updateDisplay} />
      </div>
    </div>
  );
}

export default Drum;
