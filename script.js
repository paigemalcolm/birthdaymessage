document.addEventListener('DOMContentLoaded', () => {
    const flame = document.getElementById('flame');
    const message = document.getElementById('message');
    const finalMessage = document.getElementById('finalMessage');
    const candleScreen = document.getElementById('candleScreen');
    const celebrationScreen = document.getElementById('celebrationScreen');
  
    // Function to process audio input
    const processAudio = (stream) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const microphone = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      microphone.connect(analyser);
  
      const detectBlow = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
  
        if (volume > 80 && volume <= 150) {
          flame.classList.add('scatter');
          message.textContent = 'Almost there, blow a little harder!';
        } else if (volume > 150 && volume <= 180) {
          flame.classList.remove('scatter');
          message.textContent = ''; // Clear message when volume is between 150 and 180
        } else if (volume > 180) {
          flame.style.display = 'none';
          message.textContent = ''; // Hide the initial message
          finalMessage.textContent = 'The candle has been blown out!';
          transitionToCelebration();
        } else {
          flame.classList.remove('scatter');
        }
  
        requestAnimationFrame(detectBlow);
      };
  
      detectBlow();
    };
  
    const transitionToCelebration = () => {
      candleScreen.style.display = 'none';
      celebrationScreen.style.display = 'block';
      startCelebration();
    };
  
    const startCelebration = () => {
      // Start music
      const audio = new Audio('path_to_your_birthday_music.mp3'); // Replace with your music file
      audio.play();
  
      // Start fireworks
      const fireworks = new Fireworks(document.getElementById('fireworks-container'), {
        autoresize: true,
        opacity: 0.9,
        acceleration: 1.05,
        friction: 0.98,
        gravity: 1.5,
        particles: 50,
        trace: 3,
        explosion: 5,
        intensity: 30,
        flickering: 50,
        lineStyle: 'round',
        hue: {
          min: 0,
          max: 360
        },
        delay: {
          min: 30,
          max: 60
        },
        rocketsPoint: {
          min: 50,
          max: 50
        },
        lineWidth: {
          explosion: {
            min: 1,
            max: 3
          },
          trace: {
            min: 1,
            max: 2
          }
        },
        brightness: {
          min: 50,
          max: 80
        },
        decay: {
          min: 0.015,
          max: 0.03
        },
        mouse: {
          click: false,
          move: false,
          max: 1
        }
      });
      fireworks.start();
    };
  
    // Request access to the user's microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(processAudio)
      .catch((err) => {
        console.error('Error accessing microphone:', err);
        message.textContent = 'Please allow microphone access to blow the candle out!';
      });
  });
  