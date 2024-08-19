import { useEffect, useState } from 'react'

const Home = () => {
  const [isFocused, setIsFocused] = useState(true)
  const [_isWaitingToJoin, _setIsWaitingToJoin] = useState(true)

  const [participants, setParticipants] = useState(0)
  const [unmuted, setUnmuted] = useState(0)
  const [video, setVideo] = useState(0)

  useEffect(() => {
    console.log('init')
    window.electron.ipcRenderer.send('main')
    window.electron.ipcRenderer.on('main', (_event, data) => {
      if (data === 'BLUR') {
        setIsFocused(false)
      }

      if (data === 'FOCUS') {
        setIsFocused(true)
      }
    })

    setInterval(() => {
      fetch('http://localhost:3000/meeting/part')
        .then((res) => res.json())
        .then((result) => {
          setParticipants(result.part)
          setUnmuted(result.unmuted)
          setVideo(result.video)
        })
        .catch((e) => {
          console.log(e)
        })
    }, 500)
  }, [])

  return (
    <div
      className={
        'w-full h-full flex flex-col justify-center items-center bg-black rounded-xl' +
        (isFocused ? ' bg-opacity-80' : ' bg-opacity-50')
      }
    >
      <div className="flex h-10 w-full select-none">
        <div
          className={
            'w-full draggable-area h-10 bg-gray-800 text-white pl-4 font-semibold rounded-tl-xl flex justify-start items-center ' +
            (isFocused ? ' bg-opacity-100' : ' bg-opacity-50 text-opacity-50')
          }
        >
          Zoom Bot
        </div>

        <div
          className={
            'w-10 h-10 bg-gray-800 hover:bg-gray-600  flex justify-center font-semibold items-center text-xl text-white hover:text-white' +
            (isFocused ? ' bg-opacity-100' : ' bg-opacity-50 text-opacity-50')
          }
          onClick={() => window.electron.ipcRenderer.send('min')}
        >
          _
        </div>

        <div
          className={
            'w-10 h-10 hover:cursor-pointer bg-gray-800 hover:bg-red-600 flex justify-center items-center text-white rounded-tr-xl hover:fill-white fill-white' +
            (isFocused ? ' bg-opacity-100' : ' bg-opacity-50')
          }
          onClick={() => window.electron.ipcRenderer.send('close')}
        >
          <svg
            opacity={isFocused ? '100%' : '50%'}
            fill=""
            className=""
            width="25"
            height="25"
            viewBox="0 0 256 256"
            id="Flat"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M202.82861,197.17188a3.99991,3.99991,0,1,1-5.65722,5.65624L128,133.65723,58.82861,202.82812a3.99991,3.99991,0,0,1-5.65722-5.65624L122.343,128,53.17139,58.82812a3.99991,3.99991,0,0,1,5.65722-5.65624L128,122.34277l69.17139-69.17089a3.99991,3.99991,0,0,1,5.65722,5.65624L133.657,128Z" />
          </svg>
        </div>
      </div>

      <div
        className={
          'w-full h-full flex justify-around items-center text-white select-none' +
          (isFocused ? ' bg-opacity-100' : ' bg-opacity-50 text-opacity-50')
        }
      >
        <div className="flex justify-center items-center flex-col">
          <div className="text-9xl">{participants}</div>
          <div>Number of participants</div>
        </div>

        <div className="flex justify-center items-center flex-col">
          <div className="text-9xl">{unmuted}</div>
          <div>Number of unmuted mics</div>
        </div>

        <div className="flex justify-center items-center flex-col">
          <div className="text-9xl">{video}</div>
          <div>Number of opened camera</div>
        </div>
      </div>

      <div className="h-10 flex justify-end w-full items-center pr-5 pb-2 space-x-2">
        <div className="w-6 h-7 cursor-pointer">
          <svg
            opacity={isFocused ? '100%' : '50%'}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 6L21 6.00078M8 12L21 12.0008M8 18L21 18.0007M3 6.5H4V5.5H3V6.5ZM3 12.5H4V11.5H3V12.5ZM3 18.5H4V17.5H3V18.5Z"
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <div className="w-6 h-7 cursor-pointer flex justify-center items-center">
          <svg
            opacity={isFocused ? '100%' : '50%'}
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#fff"
              d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256z"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Home
