import Particles from "react-tsparticles";
import { loadFull } from "tsparticles"; // loads tsparticles
import { useCallback, useMemo } from "react";

// tsParticles Repository: https://github.com/matteobruni/tsparticles
// tsParticles Website: https://particles.js.org/
const ParticlesComponent = (props) => {
  // using useMemo is not mandatory, but it's recommended since this value can be memoized if static
  const options = useMemo(() => {
    // using an empty options object will load the default options, which are static particles with no background and 3px radius, opacity 100%, white color
    // all options can be found here: https://particles.js.org/docs/interfaces/Options_Interfaces_IOptions.IOptions.html
    return {
      background: {
        color: "#000000"
      },
      detectRetina: false,
      fpsLimit: 240,
      interactivity: {
        detectsOn: "canvas",
        events: {
          onHover: {
            enable: true,
            mode: "bubble"
          },
          resize: true
        },
        modes: {
          bubble: {
            color: "#048B48",
            distance: 100,
            duration: 2,
            opacity: 1,
            size: 10,
            speed: 3
          }
        }
      },
      particles: {
        color: {
          value: "#fff"
        },
        links: {
          blink: false,
          color: "#fff",
          consent: false,
          distance: 20,
          enable: true,
          opacity: 0.8,
          width: 1
        },
        move: {
          attract: {
            enable: false,
            rotate: {
              x: 600,
              y: 1200
            }
          },
          bounce: false,
          direction: "none",
          enable: true,
          outMode: "bounce",
          random: false,
          speed: 1,
          straight: false
        },
        number: {
          density: {
            enable: false,
            area: 2000
          },
          limit: 0,
          value: 400
        },
        opacity: {
          animation: {
            enable: true,
            minimumValue: 0.3,
            speed: 0.5,
            sync: false
          },
          random: { enable: true, minimumValue: 0.3 },
          value: 0.8
        },
        shape: {
          type: "circle"
        },
        size: {
          value: 1
        }
      },
      polygon: {
        move: {
          radius: 10
        },
        inlineArrangement: "equidistant",
        scale: 1,
        type: "inline",
        position: {
          x: 20,
          y: 40
        },
        data: {
          path:
            "M129.6,200.8c0,62.6-26.5,78.4-80.2,105c6.9,4.6,16.2,10.1,32,17.6c41.4-19.6,81.4-45.3,81.4-113.8V65.1h-33.2V200.8z M98.1,65.1H0v28.7h65v91.9c0,42-2.5,45.9-57.1,70.5c3.8,9.6,9.3,19,16.5,27.5c61.7-27.5,73.7-41.7,73.7-89.3V65.1z",
          size: {
            width: 162.7,
            height: 323.3
          }
        }
      }
    };
  }, []);

  // useCallback is not mandatory, but it's recommended since this callback can be memoized if static
  const particlesInit = useCallback((engine) => {
    loadFull(engine);
    // loadFull(engine); // for this sample the slim version is enough, choose whatever you prefer, slim is smaller in size but doesn't have all the plugins and the mouse trail feature
  }, []);

  // setting an id can be useful for identifying the right particles component, this is useful for multiple instances or reusable components
  return <Particles id={props.id} init={particlesInit} options={options}/>;
};

export default ParticlesComponent;