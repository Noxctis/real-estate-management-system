import "./BgVisuals.scss";

function BgVisuals() {
  return (
    <div className="imgContainer">
      <img className="main-bg" src="/bg.png" alt="" />
      <img className="shape1" src="/shape1.svg" alt="" />
      <div className="circle"></div>
    </div>
  );
}

export default BgVisuals;