import React from 'react';
import { Viewer, WebIFCLoaderPlugin } from '@xeokit/xeokit-sdk';
import { useRef, useEffect } from 'react';
import './Building.css';



function Building() {
    const myCanvas = useRef();
    


    useEffect(()=>{
        const viewer = new Viewer({
            canvasId: "myCanvas",
            transparent: true
        })    

        viewer.camera.eye = [-3.933, 2.855, 27.018];
        viewer.camera.look = [4.400, 3.724, 8.899];
        viewer.camera.up = [-0.018, 0.999, 0.039];

        const webIFCLoader = new WebIFCLoaderPlugin(viewer, {
            wasmPath: "https://cdn.jsdelivr.net/npm/@xeokit/xeokit-sdk/dist/"
        });

        let model = webIFCLoader.load({
            id: "myModel",
            src: "./Duplex.ifc",
            excludeTypes: ["IfcSpace"],
            edges: true
        });

        model.on("loaded", () => {
            
    //--------------------------------------------------------------------------------------------------------------
    // 1. Find metadata on the bottom storey
    // 2. X-ray all the objects except for the bottom storey
    // 3. Fit the bottom storey in view
    //--------------------------------------------------------------------------------------------------------------

      // 1
      const metaModel = viewer.metaScene.metaModels["myModel"];       // MetaModel with ID "myModel"
      const metaObject
           = viewer.metaScene.metaObjects["1xS3BCk291UvhgP2dvNsgp"];  // MetaObject with ID "1xS3BCk291UvhgP2dvNsgp"
  
      const name = metaObject.name;                                   // "01 eerste verdieping"
      const type = metaObject.type;                                   // "IfcBuildingStorey"
      const parent = metaObject.parent;                               // MetaObject with type "IfcBuilding"
      const children = metaObject.children;                           // Array of child MetaObjects
      const objectId = metaObject.id;                                 // "1xS3BCk291UvhgP2dvNsgp"
      const objectIds = viewer.metaScene.getObjectIDsInSubtree(objectId);   // IDs of leaf sub-objects
      const aabb = viewer.scene.getAABB(objectIds);                   // Axis-aligned boundary of the leaf sub-objects
    // 2
    viewer.scene.setObjectsXRayed(viewer.scene.objectIds, true);
    viewer.scene.setObjectsXRayed(objectIds, false);

    // 3
    viewer.cameraFlight.flyTo(aabb);
    });

    
    // Find the model Entity by ID
    model = viewer.scene.models["myModel"];

    // Destroy the model
    // model.destroy();



    },[])

    

  return (
    <>

    <canvas ref={myCanvas} id='myCanvas'></canvas>
    </>
  )
}

export default Building