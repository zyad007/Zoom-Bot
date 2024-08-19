import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Join = () => {
  const nav = useNavigate()

  const [meetingUrl, setMeetingUrl] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsloading] = useState(false); 

  const handleSumbit = (_e: any) => {
    if (!meetingUrl) {
      setError("Input can't be empty")
      return
    }

    setIsloading(true);
    fetch('http://localhost:3000/meeting', {
      method: 'POST',
      body: JSON.stringify({
        meetingUrl
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.status === 200) {
          nav('/home')
          setError('')
          window.electron.ipcRenderer.send('resize')
        }
      })
      .catch((e) => {
        console.log(e)
        setIsloading(false)
      })
  }

  // function createBrowserWindow() {
  //     const BrowserWindow = remote.BrowserWindow;
  //     const win = new BrowserWindow({
  //         height: 400,
  //         width: 600
  //     });

  //     win.loadURL('<url>');
  // }

  const dragBar = useRef(null)

  return (
    <div className="w-full h-full flex justify-center items-center flex-col bg-white rounded-xl">
      <div className="fixed top-0 right-0 flex w-full select-none">
        <div
          className="w-full draggable-area h-10 bg-gray-200 text-white rounded-tl-xl flex justify-start items-center"
          ref={dragBar}
        >
          <span className="text-black pl-4 font-semibold">Zoom Bot</span>
        </div>

        <div
          className="w-10 h-10 bg-gray-200 hover:bg-gray-400  flex justify-center font-semibold items-center text-xl text-black hover:text-white"
          onClick={() => window.electron.ipcRenderer.send('min')}
        >
          _
        </div>

        <div
          className="w-10 h-10 hover:cursor-pointer bg-gray-200 hover:bg-red-600 flex justify-center items-center text-white rounded-tr-xl hover:fill-white fill-[#555555]"
          onClick={() => window.electron.ipcRenderer.send('close')}
        >
          <svg
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

      <div className="text-3xl font-semibold mb-10 text-blue-600">Enter meeting URL</div>

      <div className="w-full flex justify-center items-center mb-10">
        <input
          onChange={(e) => setMeetingUrl(e.target.value)}
          value={meetingUrl}
          className="w-[70%] h-12 rounded-xl px-4 border-2 border-blue-600 focus:outline-none shadow-sm disabled:text-gray-500 disabled:bg-gray-300"
          type="text"
          placeholder="https://example.com"
          disabled={isLoading}
        />
      </div>

      <div className="mb-5">
        <button
          onClick={handleSumbit}
          className="w-52 h-12 disabled:bg-blue-400 bg-blue-600 rounded-xl text-2xl text-white shadow shadow-black transition-all hover:bg-blue-500"
          disabled={isLoading}
        >
          Start
        </button>
      </div>

      <div className="text-red-600 text-lg font-semibold">{error}</div>
    </div>
  )
}

export default Join
