import Home from '@renderer/page/Home';
import Join from '@renderer/page/Join';
import { HashRouter, Route, Routes } from 'react-router-dom'

const AppRouter = () => {
    return (
        <div className='h-screen w-screen'>
            <HashRouter>
                <Routes>
                    <Route path='*' element={<>Not Found</>} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/' element={<Join />} />
                </Routes>
            </HashRouter>
        </div>
    );
}

export default AppRouter;
