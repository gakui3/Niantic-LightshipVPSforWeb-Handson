// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a threejs scene on startup.

export const initScenePipelineModule = () => {
    const purple = 0xAD50FF
  
    // Populates a cube into an XR scene and sets the initial camera position.
    const initXrScene = ({scene, camera, renderer}) => {
      // Enable shadows in the rednerer.
      renderer.shadowMap.enabled = true
  
      // Add some light to the scene.
      const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
      directionalLight.position.set(2, 10, 2)
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.05;
      directionalLight.shadow.camera.far = 10;
      directionalLight.shadow.camera.bottom = -2.5;
      directionalLight.shadow.camera.top = 2.5;
      directionalLight.shadow.camera.left = -2.5;
      directionalLight.shadow.camera.right = 2.5;
      scene.add(directionalLight)
  
   
      camera.position.set(0, 2, 2)
  
      const light = new THREE.AmbientLight(0xFFFFFF, 0.25);
      scene.add(light);
    }
  
    // Return a camera pipeline module that adds scene elements on start.
    return {
      // Camera pipeline modules need a name. It can be whatever you want but must be unique within
      // your app.
      name: 'threejsinitscene',
  
      // onStart is called once when the camera feed begins. In this case, we need to wait for the
      // XR8.Threejs scene to be ready before we can access it to add content. It was created in
      // XR8.Threejs.pipelineModule()'s onStart method.
      onStart: ({canvas}) => {
        const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs
  
        initXrScene({scene, camera, renderer})  // Add objects set the starting camera position.
  
        // prevent scroll/pinch gestures on canvas
        canvas.addEventListener('touchmove', (event) => {
          event.preventDefault()
        })
  
        // Sync the xr controller's 6DoF position and camera paremeters with our scene.
        XR8.XrController.updateCameraProjectionMatrix(
          {origin: camera.position, facing: camera.quaternion}
        )
      },
    }
  }