import React from 'react';
import './App.css';

// import { VideoPage } from 'page/video-page';
import { TestPage } from 'page/test-page';
// import { ChartRoom } from 'page/chart-room';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className={'tit'}> 123</div>
      <TestPage />
      {/* <VideoPage /> */}
      {/* <ChartRoom /> */}
    </div>
  );
};

export default App;
