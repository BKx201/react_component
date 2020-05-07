import React, { useEffect } from 'react';

// websocket 测试 未完待续！
const ChartRoom: React.FC = () => {
  useEffect(() => {
    var ws = new WebSocket('ws://localhost:3000');
    ws.onopen = function () {
      // Web Socket 已连接上，使用 send() 方法发送数据
      ws.send('发送数据');
      alert('数据发送中...');
    };

    ws.onmessage = function (evt) {
      var received_msg = evt.data;
      alert('数据已接收...' + received_msg);
    };

    ws.onclose = function () {
      // 关闭 websocket
      alert('连接已关闭...');
    };
  });
  return (
    <div className="page">
      <div>{'Chart'}</div>
      <div></div>
    </div>
  );
};

export { ChartRoom };
