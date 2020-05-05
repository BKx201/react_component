import React from 'react';
import './App.css';
import { VideoPlayerBox } from 'components/videobox';

function App() {
  return (
    <div className="App">
      <div className={'tit'}> 123</div>
      <div className={'box'}>
        <VideoPlayerBox videoUrl={''} />
      </div>
    </div>
  );
}

export default App;
