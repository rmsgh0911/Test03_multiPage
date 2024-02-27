

var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var modelResouce = {};


var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };
const createScene = function () {
    

    const scene = new BABYLON.Scene(engine);

    // camera
    //const camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", -Math.PI / 2, Math.PI / 2.2, 10, new BABYLON.Vector3(0, 0, 0), scene);
    var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI/2, 0.5, 25, new BABYLON.Vector3(0, 1, 0), scene);
    //const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Ground for positional reference
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 });
    ground.material = new BABYLON.GridMaterial("groundMat");
    ground.material.backFaceCulling = false;

    
    const box = BABYLON.MeshBuilder.CreateBox("box", { height: 1, width: 0.75, depth: 0.25 });

    // GUI
    var sampleAdvancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    sampleAdvancedTexture.idealWidth = 600;

    var rect1 = new BABYLON.GUI.Rectangle();
    rect1.width = 0.2;
    rect1.height = "40px";
    rect1.cornerRadius = 20;
    rect1.color = "Orange";
    rect1.thickness = 4;
    rect1.background = "green";
    sampleAdvancedTexture.addControl(rect1);
    rect1.linkWithMesh(box);   
    rect1.linkOffsetY = -150;

    var label = new BABYLON.GUI.TextBlock();
    label.text = "box";
    rect1.addControl(label);



    var line = new BABYLON.GUI.Line();
    line.lineWidth = 4;
    line.color = "Orange";
    line.y2 = 20;
    line.linkOffsetY = -20;
    sampleAdvancedTexture.addControl(line);
    line.linkWithMesh(box); 
    line.connectedControl = rect1; 
    //console.log(box);

    //
    const resultPromise = BABYLON.SceneLoader.ImportMeshAsync("", "../models/", "Building 1.glb", scene);

    resultPromise.then((result) => {
        //camera.target = result.meshes[0];
        //meshes.push(result.meshes[0]);

        
        //result.meshes[1].rotation.x = Math.PI / 2.5;
        //console.log(result.meshes[1]._absolutePosition);



        //plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

        var rect1 = new BABYLON.GUI.Rectangle();
        rect1.width = 0.2;
        rect1.height = "40px";
        rect1.cornerRadius = 20;
        rect1.color = "Orange";
        rect1.thickness = 4;
        rect1.background = "green";
        sampleAdvancedTexture.addControl(rect1);
        rect1.linkWithMesh(result.meshes[1]);   
        rect1.linkOffsetY = -150;

        var label = new BABYLON.GUI.TextBlock();
        label.text = "result.meshes[1]";
        rect1.addControl(label);



        var line = new BABYLON.GUI.Line();
        line.lineWidth = 4;
        line.color = "Orange";
        line.y2 = 20;
        line.linkOffsetY = -20;
        sampleAdvancedTexture.addControl(line);
        line.linkWithMesh(result.meshes[1]); 
        line.connectedControl = rect1; 
        //console.log(box);
        


        //camera.target = result.meshes[1];
    
    })




    createTestButton(sampleAdvancedTexture);



    return scene;
}

window.initFunction = async function () {



    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};
initFunction().then(() => {
    sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});


//window.createModel = createModel;

function createModel(modelName){
    const resultPromise = BABYLON.SceneLoader.ImportMeshAsync("", "../models/", modelName, scene);

    resultPromise.then((result) => {

        var randomPosX = (Math.random() * 50) - 25;
        var randomPosZ = (Math.random() * 50) - 25;

        var scale = 0.01;
        for(let i=1; i<result.meshes.length; i++){
            result.meshes[i].scaling.scaleInPlace(scale);
            result.meshes[i].setAbsolutePosition(new BABYLON.Vector3(randomPosX, result.meshes[i].position.y, randomPosZ));
            //result.meshes[i].billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            //result.meshes[i].rotate(BABYLON.Axis.X , Math.PI, BABYLON.Space.LOCAL);
            //result.meshes[i].rotate(BABYLON.Axis.X , Math.PI, BABYLON.Space.LOCAL);
        
        }




        // POI 표현

        // 1) 뒤에 담을 평면
        var ground1 = BABYLON.Mesh.CreateGround("ground1", 10, 10, 2, scene);
        ground1.setAbsolutePosition(new BABYLON.Vector3(randomPosX, 5, randomPosZ));
        
        ground1.rotate(BABYLON.Axis.X , Math.PI / 2, BABYLON.Space.LOCAL);
        ground1.rotate(BABYLON.Axis.Y , Math.PI, BABYLON.Space.LOCAL);
        ground1.rotate(BABYLON.Axis.Z , Math.PI, BABYLON.Space.LOCAL);
        
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(ground1, 512, 512);
        // test
        //advancedTexture.background = "yellow"
        var panel = new BABYLON.GUI.StackPanel();
        panel.width = "220px";
        advancedTexture.addControl(panel);

        // billboard MODE
        ground1.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

        // 2) 텍스트
        var textblock = new BABYLON.GUI.TextBlock();
        textblock.width = "200px";
        textblock.height = "50px";
        panel.addControl(textblock);   
        textblock.color = "white";
        textblock.text = "target" + (Math.random()*10);
        


        // 3) 아이콘
        var image = new BABYLON.GUI.Image("imageTest", "../icons/IconSample01.png");
        image.width = "60px";
        image.height = "60px";

        panel.addControl(image);

        // 4) 라인
        let tempVector3 = result.meshes[1]._absolutePosition.clone();
        tempVector3.y += 5;
        const linePoints = [
            result.meshes[1]._absolutePosition,
            tempVector3,
        ]
        const lines = BABYLON.MeshBuilder.CreateLines("lines", {points: linePoints});

    })
}

function addPoi(result){
		var randomPosX = (Math.random() * 50) - 25;
        var randomPosZ = (Math.random() * 50) - 25;

        var scale = 0.01;
        for(let i=1; i<result.meshes.length; i++){
            result.meshes[i].scaling.scaleInPlace(scale);
            result.meshes[i].setAbsolutePosition(new BABYLON.Vector3(randomPosX, result.meshes[i].position.y, randomPosZ));
            //result.meshes[i].billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
            //result.meshes[i].rotate(BABYLON.Axis.X , Math.PI, BABYLON.Space.LOCAL);
            //result.meshes[i].rotate(BABYLON.Axis.X , Math.PI, BABYLON.Space.LOCAL);
        
        }




        // POI 표현

        // 1) 뒤에 담을 평면
        var ground1 = BABYLON.Mesh.CreateGround("ground1", 10, 10, 2, scene);
        ground1.setAbsolutePosition(new BABYLON.Vector3(randomPosX, 5, randomPosZ));
        
        ground1.rotate(BABYLON.Axis.X , Math.PI / 2, BABYLON.Space.LOCAL);
        ground1.rotate(BABYLON.Axis.Y , Math.PI, BABYLON.Space.LOCAL);
        ground1.rotate(BABYLON.Axis.Z , Math.PI, BABYLON.Space.LOCAL);
        
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(ground1, 512, 512);
        // test
        //advancedTexture.background = "yellow"
        var panel = new BABYLON.GUI.StackPanel();
        panel.width = "220px";
        advancedTexture.addControl(panel);

        // billboard MODE
        ground1.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

        // 2) 텍스트
        var textblock = new BABYLON.GUI.TextBlock();
        textblock.width = "200px";
        textblock.height = "50px";
        panel.addControl(textblock);   
        textblock.color = "white";
        textblock.text = "target" + (Math.random()*10);
        


        // 3) 아이콘
        var image = new BABYLON.GUI.Image("imageTest", "../icons/IconSample01.png");
        image.width = "60px";
        image.height = "60px";

        panel.addControl(image);

        // 4) 라인
        let tempVector3 = result.meshes[1]._absolutePosition.clone();
        tempVector3.y += 5;
        const linePoints = [
            result.meshes[1]._absolutePosition,
            tempVector3,
        ]
        const lines = BABYLON.MeshBuilder.CreateLines("lines", {points: linePoints});
}

function createModel_resourceAgain(modelName) {
    // 있을 경우. 클론
    if (modelResouce.hasOwnProperty('/models/' + modelName)) {

        //console.log(modelResouce['/models/'+modelName]);
        //let tempResult = modelResouce['/models/'+modelName].clone();
        let tempResult = Object.assign({}, modelResouce['/models/' + modelName]);
        addPoi(tempResult);

    } else {
        // 없을 경우
        // 
        //console.log('createModel_resourceAgain');
        console.log('createModel_resourceAgain', modelResouce.hasOwnProperty('/models/' + modelName));

        const resultPromise = BABYLON.SceneLoader.ImportMeshAsync("", "../models/", modelName, scene);

        resultPromise.then((result) => {
            modelResouce['/models/' + modelName] = result;
            addPoi(result);

        });

    }


}

function createTestButton(sampleAdvancedTexture){
    var uiButton = BABYLON.GUI.Button.CreateSimpleButton("c10", "create 10");
    uiButton.width = "100px"
    uiButton.height = "20px";
    uiButton.color = "white";
    uiButton.cornerRadius = 20;
    uiButton.background = "green";
    uiButton.onPointerUpObservable.add(function() {
        console.log('create 10');
        for(let i=0; i<10; i++){
            createModel_resourceAgain('Y_Bot.glb');
        }
    });
    uiButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    uiButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    sampleAdvancedTexture.addControl(uiButton);    

    var uiButton2 = BABYLON.GUI.Button.CreateSimpleButton("c100", "create 100");
    uiButton2.width = "100px"
    uiButton2.height = "20px";
    uiButton2.color = "white";
    uiButton2.cornerRadius = 20;
    uiButton2.background = "green";
    uiButton2.onPointerUpObservable.add(function() {
        console.log('create 100');
        for(let i=0; i<100; i++){
            createModel_resourceAgain('Y_Bot.glb');
        }
    });
    uiButton2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    
    sampleAdvancedTexture.addControl(uiButton2);    

    var uiButton3 = BABYLON.GUI.Button.CreateSimpleButton("c1000", "create 300");
    uiButton3.width = "100px"
    uiButton3.height = "20px";
    uiButton3.color = "white";
    uiButton3.cornerRadius = 20;
    uiButton3.background = "green";
    uiButton3.onPointerUpObservable.add(function() {
        console.log('create 300');
        for(let i=0; i<300; i++){
            createModel_resourceAgain('Y_Bot.glb');
        }
    });
    uiButton3.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    uiButton3.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    sampleAdvancedTexture.addControl(uiButton3);    

    // test 
    var consoleBut = BABYLON.GUI.Button.CreateSimpleButton("consoleBut", "consoleBut");
    consoleBut.width = "100px"
    consoleBut.height = "20px";
    consoleBut.color = "white";
    consoleBut.cornerRadius = 20;
    consoleBut.background = "green";
    consoleBut.onPointerUpObservable.add(function() {
        console.log('scene', scene);
        console.log('engine', engine);
        console.log('sceneToRender', sceneToRender)

    });
    consoleBut.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    sampleAdvancedTexture.addControl(consoleBut);    

    //renderTest
    // test 
    var resistBut = BABYLON.GUI.Button.CreateSimpleButton("resistBut", "resistBut");
    resistBut.width = "100px"
    resistBut.height = "20px";
    resistBut.top = "20px";
    resistBut.color = "white";
    resistBut.cornerRadius = 20;
    resistBut.background = "green";
    resistBut.onPointerUpObservable.add(function() {
        scene.registerBeforeRender(consoleLogBR);
        scene.registerAfterRender(consoleLogAR);
    });
    resistBut.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    sampleAdvancedTexture.addControl(resistBut);    

    var unresistBut = BABYLON.GUI.Button.CreateSimpleButton("unresist", "unresistBut");
    unresistBut.width = "100px"
    unresistBut.height = "20px";
    unresistBut.top = "40px";
    unresistBut.color = "white";
    unresistBut.cornerRadius = 20;
    unresistBut.background = "green";
    unresistBut.onPointerUpObservable.add(function() {
        scene.unregisterBeforeRender(consoleLogBR);
        scene.unregisterAfterRender(consoleLogAR);
    });
    unresistBut.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    //renderUpdateBut.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    sampleAdvancedTexture.addControl(unresistBut);    

    //
    var executeOnceBeforeRender = BABYLON.GUI.Button.CreateSimpleButton("OnceBeforeRender", "OnceBeforeRender");
    executeOnceBeforeRender.width = "100px"
    executeOnceBeforeRender.height = "20px";
    executeOnceBeforeRender.top = "60px";
    executeOnceBeforeRender.color = "white";
    executeOnceBeforeRender.cornerRadius = 20;
    executeOnceBeforeRender.background = "green";
    executeOnceBeforeRender.onPointerUpObservable.add(function() {
        scene.executeOnceBeforeRender(() => {
            console.log('executeOnceBeforeRender');
        });
        
    });
    executeOnceBeforeRender.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    sampleAdvancedTexture.addControl(executeOnceBeforeRender);    
    
    

    //

    function consoleLogBR(){
        console.log('registerBeforeRender');
    }
    function consoleLogAR(){
        console.log('registerAfterRender');
    }
}
