import React from 'react'
import { useSvgDrawing } from 'react-hooks-svgdrawing';
import { Strings } from '../../dataProvider/localize'
import { notification } from 'antd';


export const SignCanvas = ({ signDetail, onSave, sign_id, signFlag }) => {
  const [renderRef, action] = useSvgDrawing({
    penWidth: 3, // pen width
    height: 100,
    width: 500
  });

  const signAreaId = "signature_area_id_" + Math.floor(Math.random() * 1000000);
  /** Returns png sign to onSave function from parent */
  const svgToPngSave = () => {
    if (document.getElementById(sign_id ? sign_id : signAreaId).childNodes[0].childNodes[1].childNodes.length === 0) {
      notification.warning({
        message: Strings.warning_title,
        description: "Please sign before saving",
        onClick: () => { },
        className: 'ant-warning'
      });
      return;
    }

    /** Converting svg sign to canvas and then to png blob */
    var svgString = new XMLSerializer().serializeToString(document.getElementById(sign_id ? sign_id : signAreaId).childNodes[0]);
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    var DOMURL = window.self.URL || window.self.webkitURL || window.self;
    var img = new Image();
    var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    var url = DOMURL.createObjectURL(svg);
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      var png = canvas.toDataURL("image/png");
      canvas.toBlob((blob) => {
        // var url = URL.createObjectURL(blob);
        // window.open(url, '_blank');
        onSave(signDetail, blob);
      })
      DOMURL.revokeObjectURL(png);
    };
    img.src = url;
  }

  return <><div className="signature-box">
    {signDetail.user_first_name && signDetail.user_role_name ?
      <span className="sig-title">{signDetail.user_first_name + ' (' + signDetail.user_role_name + ')'}</span> : null
    }
    <div className="upload-ur-sign">
      {signFlag ? <div className="sign-box" id={sign_id ? sign_id : signAreaId} ref={renderRef} onClick={() => signFlag(true)}></div> : <div className="sign-box" id={sign_id ? sign_id : signAreaId} ref={renderRef}></div>}
    </div>

    <div className="sign-action sm-bnt">
      {onSave ? <button type="button" className="bnt bnt-active" onClick={svgToPngSave}>{Strings.save_btn}</button> : null
      }
      {signFlag ? <button type="button" className="normal-bnt" onClick={() => { action.clear(); signFlag(false) }}>{Strings.clear_txt}</button> : <button type="button" className="normal-bnt" onClick={action.clear}>{Strings.clear_txt}</button>}
    </div>
  </div>
    <canvas id="canvas" width='500' height='100' className="sign-convas d-none"></canvas>
  </>
}