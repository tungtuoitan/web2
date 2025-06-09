import Cube3D from "./cubic.3d";
import FisheyeLensCanvas from "./FishEye";





export default function Homepage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100"
            style={{ 
                // border: '10px solid red',
                height: '100vh',
                width: '100%',
                // backgroundImage: 'url(./sample.jpg)',
                overflow: 'hidden',
                position: 'relative',

            }}>
                {/* <img src="./sample.jpg" width={'100%'} height={'100%'}/>
                <div
                style={{
                    backgroundColor: 'white',
                    // opacity:0.4 ,
                    filter: 'blur(10px)',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    zIndex: 2,
                }}></div> */}
                {/* <EraserCanvas /> */}
                <Cube3D />
                {/* <FisheyeLensCanvas /> */}
        </div>
    );
}